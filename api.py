from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from tensorflow.keras.models import load_model
import mediapipe as mp
from agent import analyze_hand



app = FastAPI(
    title="ASL Recognition API",
    version="1.0",
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



asl_model = load_model("asl_model.h5")
labels = {i: chr(65+i) for i in range(26)}  # A-Z

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.7)

@app.post("/predict/")
async def predict_asl(image: UploadFile = File(...), letter: str = Form(...)):
    try:
        print("Letra recibida:", letter)
        img_bytes = await image.read()
        np_img = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if frame is None:
            return JSONResponse({"error": "No se pudo leer la imagen."}, status_code=400)

        h, w, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(frame_rgb)
        if not result.multi_hand_landmarks:
            return JSONResponse({"error": "No se detectó ninguna mano."}, status_code=200)

        for hand_landmarks in result.multi_hand_landmarks:
            x_coords = [lm.x for lm in hand_landmarks.landmark]
            y_coords = [lm.y for lm in hand_landmarks.landmark]
            xmin = max(int(min(x_coords)*w)-20, 0)
            xmax = min(int(max(x_coords)*w)+20, w)
            ymin = max(int(min(y_coords)*h)-20, 0)
            ymax = min(int(max(y_coords)*h)+20, h)

            hand_img = frame[ymin:ymax, xmin:xmax]
            if hand_img.size == 0:
                continue

            hand_resized = cv2.resize(hand_img, (224, 224))
            hand_norm = hand_resized / 255.0
            hand_input = np.expand_dims(hand_norm, axis=0)
            pred = asl_model.predict(hand_input, verbose=0)[0]
            pred_class = int(np.argmax(pred))
            confidence = float(pred[pred_class])
            pred_letter = labels.get(pred_class, "Desconocido")

            feedback = analyze_hand(pred_letter, confidence, hand_img, letter)

            return JSONResponse({
                "pred_letter": pred_letter,
                "confidence": round(confidence*100, 2),
                "feedback": feedback
            })

        return JSONResponse({"error": "No se pudo procesar la mano."}, status_code=200)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

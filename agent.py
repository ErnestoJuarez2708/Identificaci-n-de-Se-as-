import dspy
from tools import get_gold_info
import base64
import cv2

dllm = dspy.LM(model="openai/gpt-4o-mini", max_tokens=4000)

def image_to_base64(img):
    """Convierte una imagen OpenCV a base64 para enviarla al agente como string."""
    _, buffer = cv2.imencode('.jpg', img)
    return base64.b64encode(buffer).decode('utf-8')

def analyze_hand(pred_letter, confidence, user_img, gold_letter):
    """
    Analiza la mano del usuario comparándola con la letra del gold dataset.
    Recibe:
    - pred_letter: letra predicha por el modelo
    - confidence: confianza de la predicción
    - user_img: imagen recortada de la mano del usuario (OpenCV)
    - gold_letter: letra correcta
    """

    gold_img_path, gold_description = get_gold_info(gold_letter)
    if gold_img_path is None:
        return "No se encontró información del gold dataset para esa letra."

    user_b64 = image_to_base64(user_img)


    prompt = f"""
Eres un experto en lenguaje de señas americano (ASL).
La predicción automática del modelo dice: '{pred_letter}' con confianza {confidence:.2f}.
La letra correcta es '{gold_letter}'.
Descripción de referencia del dataset: "{gold_description}".

Analiza:
1. Compara la mano del usuario con la imagen de referencia.
2. Explica coincidencias y diferencias visuales.
3. Da feedback sobre si la letra está correcta o no.
4. Da consejos claros de corrección.

La imagen del usuario está codificada en base64: {user_b64}
La imagen de referencia está en: {gold_img_path}
"""

    response = dllm(prompt)
    return response

import React, { useState, useRef } from "react";
import type { ASLResponse } from "../services/aslService";
import { sendHandImage } from "../services/aslService";

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

const Chat: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [result, setResult] = useState<ASLResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Error accediendo a la cámara", err);
      alert("No se pudo acceder a la cámara.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const takePhoto = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob && resolve(blob), "image/jpeg");
    });
  };

  const handleSend = async () => {
    if (!cameraActive) {
      alert("Primero activa la cámara.");
      return;
    }

    setLoading(true);
    const photoBlob = await takePhoto();

    try {
      const data = await sendHandImage(photoBlob, selectedLetter);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error enviando imagen al backend");
    } finally {
      setLoading(false);
      stopCamera();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🖐️ Reconocimiento de Señas ASL
      </h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-4">
          <video
            ref={videoRef}
            className="border rounded-2xl w-full aspect-[4/3] object-cover mb-4"
            autoPlay
          />

          <div className="flex flex-wrap justify-center gap-3">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition"
              >
                Iniciar Cámara
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition"
              >
                Detener Cámara
              </button>
            )}

            <button
              onClick={handleSend}
              className={`px-5 py-2 rounded-xl text-white transition ${
                loading || !cameraActive
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={loading || !cameraActive}
            >
              {loading ? "Enviando..." : "Capturar y Enviar"}
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Seleccione la letra esperada:
            </label>
            <select
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedLetter}
              onChange={(e) => setSelectedLetter(e.target.value)}
            >
              {letters.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {result ? (
            <div className="bg-white p-4 rounded-xl border shadow-inner">
              <p className="text-lg font-semibold mb-2">
                🔤 Predicción: <span className="text-blue-600">{result.pred_letter}</span>
              </p>
              <p className="text-gray-700 mb-4">
                Confianza: <strong>{result.confidence}%</strong>
              </p>
              <div className="border-t pt-2">
                <p className="font-semibold text-gray-800 mb-1">💬 Feedback del modelo:</p>
                <p className="whitespace-pre-wrap text-gray-700">{result.feedback}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic text-center mt-8">
              No hay resultados aún. Capture una imagen para comenzar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

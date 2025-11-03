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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">ASL Feedback Chat</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Seleccione letra:</label>
        <select
          className="border p-2 rounded w-full"
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

      <div className="mb-4 flex justify-center flex-col items-center">
        <video
          ref={videoRef}
          className="border rounded w-96 h-72 mb-2 object-cover"
          autoPlay
        />
        {!cameraActive && (
          <button
            onClick={startCamera}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 hover:bg-blue-600"
          >
            Iniciar Cámara
          </button>
        )}
        {cameraActive && (
          <button
            onClick={stopCamera}
            className="bg-red-500 text-white px-4 py-2 rounded mb-2 hover:bg-red-600"
          >
            Detener Cámara
          </button>
        )}
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading || !cameraActive}
        >
          {loading ? "Enviando..." : "Enviar Foto"}
        </button>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          <p>
            <strong>Predicción:</strong> {result.pred_letter}
          </p>
          <p>
            <strong>Confianza:</strong> {result.confidence}%
          </p>
          <p className="mt-2">
            <strong>Feedback del agente:</strong>
          </p>
          <div className="whitespace-pre-wrap">{result.feedback}</div>
        </div>
      )}
    </div>
  );
};

export default Chat;

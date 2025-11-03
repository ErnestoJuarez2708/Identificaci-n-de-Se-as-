import apiClient from "../api/apiClient";

export interface ASLResponse {
  pred_letter: string;
  confidence: number;
  feedback: string;
}

export const sendHandImage = async (imageFile: Blob, letter: string): Promise<ASLResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("letter", letter);
  console.log("Enviando letra:", letter);
  console.log("Archivo de imagen:", imageFile);

  const response = await apiClient.post<ASLResponse>("/predict/", formData);
  console.log("Respuesta del servidor:", response.data);  
  return response.data;
};

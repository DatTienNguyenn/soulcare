import axiosInstance, { endpoints } from './axios';

export interface MessageHistory {
  role: 'user' | 'model';
  content: string;
}

export interface AiChatRequest {
  message: string;
  context?: string;
  history?: MessageHistory[];
}

export interface AiChatResponse {
  response: string;
}

export async function chatWithAi(data: AiChatRequest): Promise<AiChatResponse> {
  const response = await axiosInstance.post(endpoints.ai.chat, data);
  return response.data;
}

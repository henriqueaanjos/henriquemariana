import { api } from "../libs/axios";

export type Message = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

type CreateMessage = {
  name: string;
  message: string;
};

export async function getMessages() {
    const response = await api.get<Message[]>("/api/messages");
    console.log(response.data);
    return response.data;
}

export async function sendMessage({ name, message }: CreateMessage) {
    const response = await api.post<Message>("/api/messages", { name, message });
    return response.data;
}
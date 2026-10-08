import axios from "axios";

export interface AdminMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminMessages(): Promise<AdminMessage[]> {
  const { data } = await axios.get<AdminMessage[]>(
    "/api/admin/messages",
  );

  return data;
}

export async function deleteAdminMessage(
  messageId: string,
) {
  const { data } = await axios.delete(
    `/api/admin/messages/${messageId}`,
  );

  return data;
}
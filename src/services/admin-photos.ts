import axios from "axios";

export interface AdminPhoto {
  id: string;
  userName: string;
  name: string;
  url: string;
  storageKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminPhotos(): Promise<AdminPhoto[]> {
  const { data } = await axios.get<AdminPhoto[]>(
    "/api/admin/photos",
  );

  return data;
}

export async function deleteAdminPhoto(
  photoId: string,
) {
  const { data } = await axios.delete(
    `/api/photos/${photoId}`,
  );

  return data;
}
import axios from "axios";

export interface AdminSong {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  album: string | null;
  artworkUrl: string | null;
  previewUrl: string | null;
  itunesUrl: string | null;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminSongPayload {
  trackId: string;
  title: string;
  artist: string;
  album?: string | null;
  artworkUrl?: string | null;
  previewUrl?: string | null;
  itunesUrl?: string | null;
}

interface CreateSongResponse {
  song: AdminSong;
  alreadyExists: boolean;
}

export async function getAdminSongs(): Promise<AdminSong[]> {
  const { data } = await axios.get<AdminSong[]>(
    "/api/admin/songs",
  );

  return data;
}

export async function createAdminSong(
  payload: CreateAdminSongPayload,
): Promise<CreateSongResponse> {
  const { data } = await axios.post<CreateSongResponse>(
    "/api/songs",
    payload,
  );

  return data;
}

export async function deleteAdminSong(
  songId: string,
) {
  const { data } = await axios.delete(
    `/api/admin/songs/${songId}`,
  );

  return data;
}
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

export interface AdminMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSong {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  album?: string | null;
  artworkUrl?: string | null;
  previewUrl?: string | null;
  itunesUrl?: string | null;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFamily {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStats {
  families: number;
  guests: number;
  confirmed: number;
  declined: number;
  pending: number;
  photos: number;
  songs: number;
  messages: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;

  rsvp: {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
  };

  recent: {
    photos: AdminPhoto[];
    songs: AdminSong[];
    messages: AdminMessage[];
    families: AdminFamily[];
  };
}

export async function getAdminDashboard() {
  const { data } = await axios.get<AdminDashboardData>(
    "/api/admin/dashboard",
  );

  return data;
}
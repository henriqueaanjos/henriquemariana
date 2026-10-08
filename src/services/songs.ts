import { api } from "../libs/axios";
import { ItunesSong } from "./itunes";

export type SuggestedSong = {
    id: string;
    trackId: string;
    title: string;
    artist: string;
    album: string | null;
    artworkUrl: string | null;
    previewUrl: string | null;
    itunesUrl: string | null;
    likes: number;
    liked: boolean;
    createdAt: string;
    updatedAt: string;
}

type GetSongsResponse = {
    songs: SuggestedSong[];
}

type CreateSongResponse  = {
    song: SuggestedSong;
    alreadyExists: boolean;
}

export async function getSuggestedSongs(): Promise<SuggestedSong[]> {
    const { data } = await api.get<GetSongsResponse>("/api/songs");

    return data.songs;
}

interface LikeSongResponse {
    song: SuggestedSong;
}

export async function likeSong(
    songId: string,
    liked: boolean
): Promise<SuggestedSong> {
    const { data } = await api.post<LikeSongResponse>(
        `/api/songs/${songId}/like`,
        {
            liked,
        }
    );

    return data.song;
}

export async function createSuggestedSong(
    song: ItunesSong
): Promise<CreateSongResponse> {
    const { data } = await api.post<CreateSongResponse>(
        "/api/songs",
        {
            trackId: String(song.trackId),
            title: song.title,
            artist: song.artist,
            album: song.album,
            artworkUrl: song.artworkUrl,
            previewUrl: song.previewUrl,
            itunesUrl: song.itunesUrl,
        }
    );

    return data;
}

const STORAGE_KEY = "henriquemariana@likedSongs";

function getLikedSongIds(): string[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveLikedSongIds(ids: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isSongLiked(songId: string): boolean {
    return getLikedSongIds().includes(songId);
}

export function setSongLiked(songId: string, liked: boolean) {
    const ids = getLikedSongIds();

    if (liked) {
        if (!ids.includes(songId)) {
            ids.push(songId);
        }
    } else {
        const index = ids.indexOf(songId);

        if (index !== -1) {
            ids.splice(index, 1);
        }
    }

    saveLikedSongIds(ids);
}
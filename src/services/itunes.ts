import { api } from "../libs/axios";

export type ItunesSong = {
    trackId: number;
    title: string;
    artist: string;
    album: string | null;
    artworkUrl: string | null;
    previewUrl: string | null;
    itunesUrl: string | null;
}


interface SearchItunesResponse {
    results: ItunesSong[];
}

export async function searchItunes(query: string): Promise<ItunesSong[]> {
    const { data } = await api.get<SearchItunesResponse>("/api/itunes/search",
        {
            params: {
                q: query,
            },
        }
    );
    return data.results;
}
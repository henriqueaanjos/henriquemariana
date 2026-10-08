"use client";

import { useQuery } from "@tanstack/react-query";
import { getSuggestedSongs } from "../services/songs";
import { PlaylistSong } from "./PlaylistSong";

export function PlaylistSongs() {
    const {
        data: songs = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["suggested-songs"],
        queryFn: getSuggestedSongs,
    });

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-primary-light/70">
                    Carregando músicas...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-primary-light/70">
                    Não foi possível carregar as músicas.
                </p>
            </div>
        );
    }

    if (songs.length === 0) {
        return (
            <div className="flex h-full items-center justify-center px-6 text-center">
                <p className="text-sm text-primary-light/70">
                    Ainda não temos músicas sugeridas.
                    <br />
                    Seja o primeiro a escolher uma!
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col gap-2 overflow-y-auto pr-2">
            {songs.map((song) => (
                <PlaylistSong
                    key={song.id}
                    song={song}
                />
            ))}
        </div>
    );
}
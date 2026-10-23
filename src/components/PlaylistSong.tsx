"use client";

import { Heart, HeartIcon } from "@phosphor-icons/react/ssr";
import { isSongLiked, likeSong, setSongLiked, SuggestedSong } from "../services/songs";
import { PlaylistSongPreview } from "./PlaylistSongPreview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface PlaylistSongProps {
    song: SuggestedSong;
}

export function PlaylistSong({
    song,
}: PlaylistSongProps) {
    const queryClient = useQueryClient();

    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        if (likeMutation.isPending) {
            return;
        }

        likeMutation.mutate(!liked);
    };

    const likeMutation = useMutation({
        mutationFn: (nextLiked: boolean) =>
            likeSong(song.id, nextLiked),

        onMutate: async (nextLiked) => {
            await queryClient.cancelQueries({
                queryKey: ["suggested-songs"],
            });

            const previousSongs =
                queryClient.getQueryData<SuggestedSong[]>(
                    ["suggested-songs"]
                );

            queryClient.setQueryData<SuggestedSong[]>(
                ["suggested-songs"],
                (songs) =>
                    songs?.map((currentSong) =>
                        currentSong.id === song.id
                            ? {
                                ...currentSong,
                                likes: nextLiked
                                    ? currentSong.likes + 1
                                    : Math.max(
                                        0,
                                        currentSong.likes - 1
                                    ),
                                liked: nextLiked,
                            }
                            : currentSong
                    )
            );

            setLiked(nextLiked);
            setSongLiked(song.id, nextLiked);

            return {
                previousSongs,
            };
        },

        onError: (_error, _nextLiked, context) => {
            if (context?.previousSongs) {
                queryClient.setQueryData(
                    ["suggested-songs"],
                    context.previousSongs
                );
            }

            setLiked(isSongLiked(song.id));
        },

        onSuccess: (updatedSong) => {
            queryClient.setQueryData<SuggestedSong[]>(
                ["suggested-songs"],
                (songs) =>
                    songs?.map((currentSong) =>
                        currentSong.id === updatedSong.id
                            ? {
                                ...currentSong,
                                likes: updatedSong.likes,
                            }
                            : currentSong
                    )
            );
        },
    });

    useEffect(() => {
        setLiked(isSongLiked(song.id));
    }, [song.id]);

    return (
        <div className="flex w-full items-center gap-3 rounded-2xl p-3 transition-all hover:bg-background/10 duration-300">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                {song.artworkUrl ? (
                    <img
                        src={song.artworkUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-white/10" />
                )}

                <PlaylistSongPreview
                    trackId={song.trackId}
                    previewUrl={song.previewUrl}
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary-light">
                    {song.title}
                </p>

                <p className="truncate text-xs text-primary-light/70">
                    {song.artist}
                </p>

                {song.album && (
                    <p className="truncate text-xs text-primary-light/50">
                        {song.album}
                    </p>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-primary-light/70">
                    {song.likes}
                </span>

                <button
                    type="button"
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                    aria-label={liked ? "Remover curtida" : "Curtir música"}
                    className="flex h-9 w-9 items-center text-background justify-center rounded-full transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-50"
                >
                    <HeartIcon
                        size={20}
                        weight={liked ? "fill" : "regular"}
                    />
                </button>
            </div>
        </div>
    );
}
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import Input from "./Input";
import { ItunesSong, searchItunes } from "../services/itunes";
import { useDebounce } from "../hooks/useDebouce";
import z from "zod";
import { PlaylistSongPreview } from "./PlaylistSongPreview";
import { useEffect, useState } from "react";
import { createSuggestedSong } from "../services/songs";

export const playlistSearchSchema = z.object({
    query: z.string(),
});

export type PlaylistSearchForm = z.infer<typeof playlistSearchSchema>;

export function PlaylistSearch() {
    const {
        control,
        watch,
        setValue,
    } = useForm<PlaylistSearchForm>({
        resolver: zodResolver(playlistSearchSchema),
        defaultValues: {
            query: "",
        },
    });

    const query = watch("query");

    const debouncedQuery = useDebounce(query, 400);

    const {
        data: results = [],
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["itunes-search", debouncedQuery],
        queryFn: () => searchItunes(debouncedQuery),
        enabled: debouncedQuery.trim().length >= 3,
    });

    const queryClient = useQueryClient();

    const addSongMutation = useMutation({
        mutationFn: createSuggestedSong,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["suggested-songs"],
            });

            setValue("query", "");
        },
    });

    function handleSelectSong(song: ItunesSong) {
        addSongMutation.mutate(song);
    };

    const showDropdown =
        query.trim().length >= 3 &&
        (isLoading || isFetching || results.length > 0 || isError);

    return (
        <div className="relative w-full">
            <Controller
                control={control}
                name="query"
                render={({ field, fieldState }) => (
                    <Input
                        label="Pesquisa"
                        placeholder="Digite o nome da música"
                        error={fieldState.error?.message}
                        {...field}
                    />
                )}
            />

            {showDropdown && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl bg-background/95 shadow-2xl">
                    {(isLoading || isFetching) && (
                        <div className="p-4 text-center text-sm">
                            Pesquisando músicas...
                        </div>
                    )}

                    {!isLoading &&
                        !isFetching &&
                        isError && (
                            <div className="p-4 text-center text-sm">
                                Não foi possível buscar as músicas.
                            </div>
                        )}

                    {!isLoading &&
                        !isFetching &&
                        !isError &&
                        results.length === 0 && (
                            <div className="p-4 text-center text-sm">
                                Nenhuma música encontrada.
                            </div>
                        )}

                    {!isLoading &&
                        !isFetching &&
                        !isError &&
                        results.length > 0 && (
                            <div className="max-h-80 overflow-y-auto">
                                {results.map((song) => (
                                    <button
                                        key={song.trackId}
                                        type="button"
                                        onClick={() => handleSelectSong(song)}
                                        className="flex w-full items-center gap-3 p-3 text-left transition hover:bg-white/10"
                                    >
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
                                                trackId={song.trackId.toString()}
                                                previewUrl={song.previewUrl}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {song.title}
                                            </p>

                                            <p className="truncate text-xs opacity-70">
                                                {song.artist}
                                            </p>

                                            {song.album && (
                                                <p className="truncate text-xs opacity-50">
                                                    {song.album}
                                                </p>
                                            )}
                                        </div>

                                        {song.previewUrl && (
                                            <audio
                                                src={song.previewUrl}
                                                preload="none"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
"use client";

import { motion } from "motion/react";

import { usePlaylistAudio } from "./PlaylistAudioProvider";

interface PlaylistSongPreviewProps {
    trackId: string;
    previewUrl: string | null;
}

export function PlaylistSongPreview({
    trackId,
    previewUrl,
}: PlaylistSongPreviewProps) {
    const {
        playingTrackId,
        loadingTrackId,
        playPreview,
        stopPreview,
    } = usePlaylistAudio();

    const isPlaying = playingTrackId === trackId;
    const isLoading = loadingTrackId === trackId;

    if (!previewUrl) {
        return null;
    }

    return (
        <div
            className="absolute inset-0 z-10"
            onMouseEnter={() =>
                playPreview(trackId, previewUrl)
            }
            onMouseLeave={() =>
                stopPreview(trackId)
            }
        >
            {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-white/70 border-b-white/70 border-l-transparent border-r-transparent" />
                </div>
            )}

            {isPlaying && !isLoading && (
                <div className="pointer-events-none absolute bottom-2 left-2 z-20 flex h-5 items-end gap-0.5 rounded-md bg-black/50 px-1.5 py-1 backdrop-blur-sm">
                    {[0, 1, 2].map((bar) => (
                        <motion.span
                            key={bar}
                            className="w-0.5 rounded-full bg-white"
                            animate={{
                                height: [
                                    "35%",
                                    "100%",
                                    "55%",
                                    "85%",
                                    "35%",
                                ],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: bar * 0.12,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
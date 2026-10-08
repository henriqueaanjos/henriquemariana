"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

interface PlaylistAudioContextData {
    playingTrackId: string | null;
    loadingTrackId: string | null;
    playPreview: (trackId: string, previewUrl: string) => void;
    stopPreview: (trackId: string) => void;
}

const PlaylistAudioContext =
    createContext<PlaylistAudioContextData | null>(null);

interface PlaylistAudioProviderProps {
    children: ReactNode;
}

export function PlaylistAudioProvider({
    children,
}: PlaylistAudioProviderProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const trackIdRef = useRef<string | null>(null);

    const [playingTrackId, setPlayingTrackId] =
        useState<string | null>(null);

    const [loadingTrackId, setLoadingTrackId] =
        useState<string | null>(null);

    useEffect(() => {
        const audio = document.createElement("audio");

        audio.preload = "none";
        audio.volume = 0;

        audioRef.current = audio;

        const handleCanPlay = () => {
            const trackId = trackIdRef.current;

            if (!trackId) return;

            setLoadingTrackId(null);

            audio
                .play()
                .catch((error) => {
                    console.error(
                        "Erro ao reproduzir preview:",
                        error
                    );

                    setPlayingTrackId(null);
                    setLoadingTrackId(null);
                });
        };

        const handlePlaying = () => {
            const trackId = trackIdRef.current;

            if (!trackId) return;

            setLoadingTrackId(null);
            setPlayingTrackId(trackId);

            audio.volume = 0;

            const startVolume = 0;
            const endVolume = 1;
            const duration = 400;

            const startTime = performance.now();

            const fadeIn = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(
                    elapsed / duration,
                    1
                );

                audio.volume =
                    startVolume +
                    (endVolume - startVolume) * progress;

                if (progress < 1) {
                    requestAnimationFrame(fadeIn);
                }
            };

            requestAnimationFrame(fadeIn);
        };

        const handleEnded = () => {
            setPlayingTrackId(null);
        };

        const handleError = () => {
            console.error(
                "Erro ao carregar preview:",
                audio.error
            );

            setLoadingTrackId(null);
            setPlayingTrackId(null);
        };

        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();

            audio.removeEventListener(
                "canplay",
                handleCanPlay
            );

            audio.removeEventListener(
                "playing",
                handlePlaying
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

            audio.removeEventListener(
                "error",
                handleError
            );

            audioRef.current = null;
        };
    }, []);

    const playPreview = useCallback(
        (trackId: string, previewUrl: string) => {
            const audio = audioRef.current;

            if (!audio) return;

            /*
             * Se já é a música atual e está tocando,
             * não fazemos nada.
             */
            if (
                trackIdRef.current === trackId &&
                !audio.paused
            ) {
                return;
            }

            /*
             * Para completamente o preview anterior.
             */
            audio.pause();

            audio.currentTime = 0;
            audio.volume = 0;

            /*
             * Atualiza a música atual ANTES de carregar.
             */
            trackIdRef.current = trackId;

            setPlayingTrackId(null);
            setLoadingTrackId(trackId);

            /*
             * Carrega o novo preview.
             */
            audio.src = previewUrl;
            audio.load();
        },
        []
    );

    const stopPreview = useCallback(
        (trackId: string) => {
            const audio = audioRef.current;

            if (!audio) return;

            /*
             * Ignora o mouseleave de uma música antiga.
             */
            if (trackIdRef.current !== trackId) {
                return;
            }

            /*
             * Fade out.
             */
            const startVolume = audio.volume;
            const duration = 200;
            const startTime = performance.now();

            const fadeOut = (currentTime: number) => {
                /*
                 * Se outra música já começou,
                 * abandonamos esse fade.
                 */
                if (trackIdRef.current !== trackId) {
                    return;
                }

                const elapsed = currentTime - startTime;
                const progress = Math.min(
                    elapsed / duration,
                    1
                );

                audio.volume =
                    startVolume * (1 - progress);

                if (progress < 1) {
                    requestAnimationFrame(fadeOut);
                    return;
                }

                audio.pause();
                audio.currentTime = 0;
                audio.volume = 0;

                /*
                 * Só limpamos se ainda for a mesma música.
                 */
                if (trackIdRef.current === trackId) {
                    trackIdRef.current = null;
                    setPlayingTrackId(null);
                    setLoadingTrackId(null);
                }
            };

            requestAnimationFrame(fadeOut);
        },
        []
    );

    return (
        <PlaylistAudioContext.Provider
            value={{
                playingTrackId,
                loadingTrackId,
                playPreview,
                stopPreview,
            }}
        >
            {children}
        </PlaylistAudioContext.Provider>
    );
}

export function usePlaylistAudio() {
    const context = useContext(PlaylistAudioContext);

    if (!context) {
        throw new Error(
            "usePlaylistAudio deve ser usado dentro de PlaylistAudioProvider"
        );
    }

    return context;
}
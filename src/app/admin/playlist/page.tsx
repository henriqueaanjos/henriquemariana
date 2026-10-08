"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import {
    Check,
    Heart,
    MagnifyingGlass,
    MusicNote,
    Pause,
    Play,
    SkipBack,
    SkipForward,
    Trash,
    X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { ConfirmDeleteModal } from "@/src/components/admin/ConfirmDeleteModal";

import {
    deleteAdminSong,
    getAdminSongs,
    type AdminSong,
    type CreateAdminSongPayload,
} from "@/src/services/admin-playlist";

export default function PlaylistAdminPage() {
    const queryClient = useQueryClient();

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [search, setSearch] = useState("");
    const [selectedSongId, setSelectedSongId] = useState<string | null>(
        null,
    );
    const [playingId, setPlayingId] = useState<string | null>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);


    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [deleteIds, setDeleteIds] = useState<string[]>([]);

    const songsQuery = useQuery({
        queryKey: ["admin-songs"],
        queryFn: getAdminSongs,
    });

    const songs = songsQuery.data ?? [];

    /*
     * Quando nenhuma música estiver selecionada,
     * usamos automaticamente a primeira música disponível.
     */
    const activeSong = useMemo(() => {
        if (selectedSongId) {
            return (
                songs.find((song) => song.id === selectedSongId) ??
                songs[0]
            );
        }

        return songs[0];
    }, [songs, selectedSongId]);

    const activeSongIndex = activeSong
        ? songs.findIndex((song) => song.id === activeSong.id)
        : -1;

    const deleteMutation = useMutation({
        mutationFn: deleteAdminSong,

        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({
                queryKey: ["admin-songs"],
            });

            setSelectedIds((current) =>
                current.filter((id) => id !== deletedId),
            );

            if (selectedSongId === deletedId) {
                setSelectedSongId(null);
            }

            if (playingId === deletedId) {
                setPlayingId(null);
            }
        },
    });

    /*
     * Configura o elemento de áudio sempre que
     * a música ativa mudar.
     */
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio || !activeSong?.previewUrl) {
            setCurrentTime(0);
            setDuration(0);
            return;
        }

        audio.pause();

        audio.src = activeSong.previewUrl;
        audio.load();

        setCurrentTime(0);
        setDuration(0);

        if (playingId === activeSong.id) {
            const playPromise = audio.play();

            playPromise?.catch(() => {
                setPlayingId(null);
            });
        }
    }, [activeSong?.id, activeSong?.previewUrl]);

    /*
     * Se a música ativa for removida, garantimos
     * que o player não fique apontando para ela.
     */
    useEffect(() => {
        if (
            selectedSongId &&
            songs.length > 0 &&
            !songs.some((song) => song.id === selectedSongId)
        ) {
            setSelectedSongId(null);
        }

        if (
            playingId &&
            songs.length > 0 &&
            !songs.some((song) => song.id === playingId)
        ) {
            setPlayingId(null);
        }
    }, [songs, selectedSongId, playingId]);

    const filteredSongs = useMemo(() => {
        const normalizedSearch = search
            .toLowerCase()
            .trim();

        if (!normalizedSearch) {
            return songs;
        }

        return songs.filter((song) => {
            return (
                song.title
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                song.artist
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                song.album
                    ?.toLowerCase()
                    .includes(normalizedSearch)
            );
        });
    }, [songs, search]);

    const totalLikes = songs.reduce(
        (total, song) => total + song.likes,
        0,
    );

    const songsWithPreview = songs.filter(
        (song) => Boolean(song.previewUrl),
    ).length;

    const songsWithArtwork = songs.filter(
        (song) => Boolean(song.artworkUrl),
    ).length;

    const allVisibleSelected =
        filteredSongs.length > 0 &&
        filteredSongs.every((song) =>
            selectedIds.includes(song.id),
        );

    const deleteTargetSongs = songs.filter((song) =>
        deleteIds.includes(song.id),
    );

    const deleteCount = deleteIds.length;

    const deleteModalOpen = deleteIds.length > 0;

    function toggleSelected(id: string) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );
    }

    function toggleSelectAll() {
        if (allVisibleSelected) {
            setSelectedIds((current) =>
                current.filter(
                    (id) =>
                        !filteredSongs.some(
                            (song) => song.id === id,
                        ),
                ),
            );

            return;
        }

        setSelectedIds((current) => [
            ...new Set([
                ...current,
                ...filteredSongs.map((song) => song.id),
            ]),
        ]);
    }

    async function togglePlay(song: AdminSong) {
        if (!song.previewUrl) {
            return;
        }

        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        /*
         * Se clicou na música que já está selecionada:
         * alternamos Play/Pause sem recriar o áudio.
         */
        if (activeSong?.id === song.id) {
            if (audio.paused) {
                try {
                    await audio.play();
                    setPlayingId(song.id);
                } catch {
                    setPlayingId(null);
                }
            } else {
                audio.pause();
                setPlayingId(null);
            }

            return;
        }

        /*
         * Outra música:
         * seleciona e inicia automaticamente.
         */
        setSelectedSongId(song.id);
        setPlayingId(song.id);
    }

    async function toggleFeaturedPlay() {
        if (!activeSong?.previewUrl) {
            return;
        }

        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            try {
                await audio.play();
                setPlayingId(activeSong.id);
            } catch {
                setPlayingId(null);
            }

            return;
        }

        audio.pause();
        setPlayingId(null);
    }

    function playPrevious() {
        if (
            activeSongIndex <= 0 ||
            !songs.length
        ) {
            return;
        }

        const previousSong = songs[activeSongIndex - 1];

        if (!previousSong) {
            return;
        }

        setSelectedSongId(previousSong.id);

        if (previousSong.previewUrl) {
            setPlayingId(previousSong.id);
        } else {
            setPlayingId(null);
        }
    }

    function playNext() {
        if (
            activeSongIndex === -1 ||
            activeSongIndex >= songs.length - 1
        ) {
            return;
        }

        const nextSong = songs[activeSongIndex + 1];

        if (!nextSong) {
            return;
        }

        setSelectedSongId(nextSong.id);

        if (nextSong.previewUrl) {
            setPlayingId(nextSong.id);
        } else {
            setPlayingId(null);
        }
    }

    function handleAudioTimeUpdate(
        event: React.SyntheticEvent<HTMLAudioElement>,
    ) {
        setCurrentTime(event.currentTarget.currentTime);
    }

    function handleAudioLoadedMetadata(
        event: React.SyntheticEvent<HTMLAudioElement>,
    ) {
        const nextDuration = event.currentTarget.duration;

        if (Number.isFinite(nextDuration)) {
            setDuration(nextDuration);
        }
    }

    function handleAudioEnded() {
        setCurrentTime(0);

        if (
            activeSongIndex >= 0 &&
            activeSongIndex < songs.length - 1
        ) {
            playNext();
            return;
        }

        setPlayingId(null);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }

    function handleSeek(
        event: React.MouseEvent<HTMLDivElement>,
    ) {
        const audio = audioRef.current;

        if (!audio || !duration) {
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        const ratio = Math.min(
            Math.max(
                (event.clientX - rect.left) / rect.width,
                0,
            ),
            1,
        );

        const nextTime = ratio * duration;

        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
    }

    function openDeleteModal(songId: string) {
        setDeleteIds([songId]);
    }

    function openDeleteSelectedModal() {
        if (selectedIds.length === 0) {
            return;
        }

        setDeleteIds([...selectedIds]);
    }

    function closeDeleteModal() {
        if (deleteMutation.isPending) {
            return;
        }

        setDeleteIds([]);
    }

    async function confirmDelete() {
        if (deleteIds.length === 0) {
            return;
        }

        const ids = [...deleteIds];

        try {
            for (const id of ids) {
                await deleteMutation.mutateAsync(id);
            }

            setSelectedIds((current) =>
                current.filter((id) => !ids.includes(id)),
            );

            if (
                activeSong &&
                ids.includes(activeSong.id)
            ) {
                setSelectedSongId(null);
                setPlayingId(null);
                setCurrentTime(0);
                setDuration(0);

                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }

            setDeleteIds([]);
        } catch {
            // O erro da mutation continua disponível
            // através de deleteMutation.error.
        }
    }

    const progress =
        duration > 0
            ? Math.min(
                (currentTime / duration) * 100,
                100,
            )
            : 0;

    const isPlaying =
        activeSong?.id === playingId;

    return (
        <AdminShell>
            <div className="space-y-7 pb-10">
                <AdminPageHeader
                    eyebrow="Playlist"
                    title="Músicas"
                    description="Gerencie as músicas escolhidas para acompanhar a história de Mariana e Henrique."
                />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <PlaylistStat
                        label="Músicas"
                        value={songs.length}
                        detail="na playlist"
                        icon={<MusicNote size={19} />}
                    />

                    <PlaylistStat
                        label="Curtidas"
                        value={totalLikes}
                        detail="dos convidados"
                        icon={
                            <Heart
                                size={19}
                                weight="fill"
                            />
                        }
                    />

                    <PlaylistStat
                        label="Prévias"
                        value={songsWithPreview}
                        detail="com áudio disponível"
                        icon={<Play size={18} />}
                    />

                    <PlaylistStat
                        label="Capas"
                        value={songsWithArtwork}
                        detail="com artwork"
                        icon={<MusicNote size={19} />}
                    />
                </div>

                {/* Featured player */}
                <FeaturedPlayer
                    song={activeSong}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    progress={progress}
                    canGoPrevious={
                        activeSongIndex > 0
                    }
                    canGoNext={
                        activeSongIndex >= 0 &&
                        activeSongIndex < songs.length - 1
                    }
                    onToggle={toggleFeaturedPlay}
                    onPrevious={playPrevious}
                    onNext={playNext}
                    onSeek={handleSeek}
                    audioRef={audioRef}
                    onTimeUpdate={handleAudioTimeUpdate}
                    onLoadedMetadata={
                        handleAudioLoadedMetadata
                    }
                    onEnded={handleAudioEnded}
                />

                {/* Toolbar */}
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="relative w-full flex-1">
                        <MagnifyingGlass
                            size={17}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2c2925]/35"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Buscar música ou artista..."
                            className="h-11 w-full rounded-full border border-[#2c2925]/8 bg-white/65 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#2c2925]/30 focus:border-[#6e4c12]/30 focus:bg-white"
                        />
                    </div>

                    <AnimatePresence>
                        {selectedIds.length > 0 && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.96,
                                    x: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.96,
                                    x: 10,
                                }}
                                className="flex items-center gap-2"
                            >
                                <span className="px-2 text-[11px] text-[#2c2925]/45">
                                    {selectedIds.length}{" "}
                                    {selectedIds.length === 1
                                        ? "selecionada"
                                        : "selecionadas"}
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        openDeleteSelectedModal
                                    }
                                    disabled={
                                        deleteMutation.isPending
                                    }
                                    className="flex h-10 items-center gap-2 rounded-full border border-red-900/10 bg-red-50 px-4 text-[11px] font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-50"
                                >
                                    <Trash size={15} />
                                    Remover
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Loading */}
                {songsQuery.isLoading && (
                    <SongsSkeleton />
                )}

                {/* Error */}
                {songsQuery.isError && (
                    <EmptyState
                        title="Não foi possível carregar a playlist"
                        description="Ocorreu um erro ao buscar as músicas. Tente novamente."
                        action={
                            <button
                                type="button"
                                onClick={() =>
                                    songsQuery.refetch()
                                }
                                className="mt-5 h-10 rounded-full bg-[#2c2925] px-5 text-[11px] font-medium text-white"
                            >
                                Tentar novamente
                            </button>
                        }
                    />
                )}

                {/* Songs */}
                {!songsQuery.isLoading &&
                    !songsQuery.isError && (
                        <section className="overflow-hidden rounded-[28px] border border-[#2c2925]/7 bg-white/60">
                            {/* Header */}
                            <div className="hidden border-b border-[#2c2925]/7 px-5 py-3 md:grid md:grid-cols-[40px_1fr_180px_90px_100px] md:items-center md:gap-4">
                                <button
                                    type="button"
                                    onClick={toggleSelectAll}
                                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${allVisibleSelected
                                            ? "border-[#2c2925] bg-[#2c2925] text-white"
                                            : "border-[#2c2925]/15 bg-white"
                                        }`}
                                    aria-label="Selecionar todas"
                                >
                                    {allVisibleSelected && (
                                        <Check
                                            size={12}
                                            weight="bold"
                                        />
                                    )}
                                </button>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
                                    Música
                                </span>

                                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
                                    Álbum
                                </span>

                                <span className="text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
                                    Curtidas
                                </span>

                                <span className="text-right text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
                                    Ações
                                </span>
                            </div>

                            <div>
                                {filteredSongs.map((song, index) => {
                                    const selected =
                                        selectedIds.includes(song.id);

                                    const playing =
                                        playingId === song.id;

                                    return (
                                        <motion.div
                                            key={song.id}
                                            layout
                                            initial={{
                                                opacity: 0,
                                                y: 8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            className={`group border-b border-[#2c2925]/6 px-4 py-4 last:border-0 sm:px-5 ${selected
                                                    ? "bg-[#d9b982]/8"
                                                    : ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 md:grid md:grid-cols-[40px_1fr_180px_90px_100px] md:gap-4">
                                                {/* Select */}
                                                <div className="flex shrink-0 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSelected(song.id)
                                                        }
                                                        className={`hidden h-5 w-5 items-center justify-center rounded-md border transition md:flex ${selected
                                                                ? "border-[#2c2925] bg-[#2c2925] text-white"
                                                                : "border-[#2c2925]/15 bg-white"
                                                            }`}
                                                    >
                                                        {selected && (
                                                            <Check
                                                                size={12}
                                                                weight="bold"
                                                            />
                                                        )}
                                                    </button>

                                                    <span className="hidden text-[10px] text-[#2c2925]/25 lg:ml-2 lg:block">
                                                        {String(index + 1).padStart(
                                                            2,
                                                            "0",
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Song */}
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            togglePlay(song)
                                                        }
                                                        disabled={!song.previewUrl}
                                                        className="group/play relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-[#2c2925] disabled:cursor-default"
                                                        aria-label={
                                                            playing
                                                                ? `Pausar ${song.title}`
                                                                : `Reproduzir ${song.title}`
                                                        }
                                                    >
                                                        {song.artworkUrl ? (
                                                            <img
                                                                src={song.artworkUrl}
                                                                alt=""
                                                                className="h-full w-full object-cover transition duration-500 group-hover/play:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <MusicNote
                                                                    size={20}
                                                                    className="text-white/40"
                                                                />
                                                            </div>
                                                        )}

                                                        {song.previewUrl && (
                                                            <span
                                                                className={`absolute inset-0 flex items-center justify-center bg-[#2c2925]/45 text-white transition ${playing
                                                                        ? "opacity-100"
                                                                        : "opacity-0 group-hover/play:opacity-100"
                                                                    }`}
                                                            >
                                                                {playing ? (
                                                                    <Pause
                                                                        size={16}
                                                                        weight="fill"
                                                                    />
                                                                ) : (
                                                                    <Play
                                                                        size={16}
                                                                        weight="fill"
                                                                    />
                                                                )}
                                                            </span>
                                                        )}
                                                    </button>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-sm font-medium text-[#2c2925]">
                                                                {song.title}
                                                            </p>

                                                            {playing && (
                                                                <span className="hidden rounded-full bg-[#d9b982]/20 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#6e4c12] sm:inline">
                                                                    Tocando
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-0.5 truncate text-[12px] text-[#2c2925]/40">
                                                            {song.artist}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Album */}
                                                <div className="hidden min-w-0 md:block">
                                                    <p className="truncate text-[12px] text-[#2c2925]/50">
                                                        {song.album || "Single"}
                                                    </p>
                                                </div>

                                                {/* Likes */}
                                                <div className="hidden items-center justify-center gap-1.5 md:flex">
                                                    <Heart
                                                        size={14}
                                                        weight="fill"
                                                        className="text-[#6e4c12]/60"
                                                    />

                                                    <span className="text-[12px] text-[#2c2925]/55">
                                                        {song.likes}
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="ml-auto flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteModal(song.id)
                                                        }
                                                        disabled={
                                                            deleteMutation.isPending
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#2c2925]/30 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                                                        aria-label="Remover música"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile metadata */}
                                            <div className="mt-3 flex items-center gap-4 pl-15 md:hidden">
                                                <span className="truncate text-[10px] text-[#2c2925]/35">
                                                    {song.album || "Single"}
                                                </span>

                                                <span className="flex items-center gap-1 text-[10px] text-[#2c2925]/35">
                                                    <Heart
                                                        size={11}
                                                        weight="fill"
                                                    />
                                                    {song.likes}
                                                </span>

                                                {!song.previewUrl && (
                                                    <span className="ml-auto text-[9px] uppercase tracking-wider text-[#2c2925]/25">
                                                        Sem prévia
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {filteredSongs.length === 0 && (
                                <EmptyState
                                    title={
                                        songs.length === 0
                                            ? "A playlist está vazia"
                                            : "Nenhuma música encontrada"
                                    }
                                    description={
                                        songs.length === 0
                                            ? "Adicione a primeira música à playlist."
                                            : "Tente alterar os termos da busca."
                                    }
                                />
                            )}
                        </section>
                    )}

                <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#2c2925]/25">
                    As músicas são armazenadas na playlist pública do
                    casamento
                </p>
            </div>

            {/* Delete confirmation */}
            <ConfirmDeleteModal
                open={deleteModalOpen}
                title={
                    deleteCount === 1
                        ? "Excluir música?"
                        : "Excluir músicas?"
                }
                description={
                    deleteCount === 1
                        ? `A música "${deleteTargetSongs[0]?.title ?? ""}" será removida permanentemente da playlist.`
                        : `${deleteCount} músicas serão removidas permanentemente da playlist.`
                }
                // loading={deleteMutation.isPending}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />

            {/* Single audio element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={
                    handleAudioLoadedMetadata
                }
                onEnded={handleAudioEnded}
                onPlay={() => {
                    if (activeSong) {
                        setPlayingId(activeSong.id);
                    }
                }}
                onPause={() => {
                    setPlayingId(null);
                }}
                className="hidden"
            />
        </AdminShell>
    );
}

function FeaturedPlayer({
    song,
    isPlaying,
    currentTime,
    duration,
    progress,
    canGoPrevious,
    canGoNext,
    onToggle,
    onPrevious,
    onNext,
    onSeek,
    audioRef,
    onTimeUpdate,
    onLoadedMetadata,
    onEnded,
}: {
    song: AdminSong | undefined;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    progress: number;
    canGoPrevious: boolean;
    canGoNext: boolean;
    onToggle: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onSeek: (
        event: React.MouseEvent<HTMLDivElement>,
    ) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    onTimeUpdate: (
        event: React.SyntheticEvent<HTMLAudioElement>,
    ) => void;
    onLoadedMetadata: (
        event: React.SyntheticEvent<HTMLAudioElement>,
    ) => void;
    onEnded: () => void;
}) {
    return (
        <section className="overflow-hidden rounded-[28px] border border-[#2c2925]/7 bg-[#2c2925] text-white shadow-[0_20px_60px_rgba(44,41,37,0.08)]">
            <div className="flex flex-col gap-6 p-6 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Song info */}
                    <div className="flex min-w-0 items-center gap-5">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[18px] bg-white/10">
                            {song?.artworkUrl ? (
                                <img
                                    src={song.artworkUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <MusicNote
                                        size={27}
                                        weight="duotone"
                                        className="text-white/60"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d9b982]">
                                {song
                                    ? isPlaying
                                        ? "Reproduzindo agora"
                                        : "Selecionada"
                                    : "Playlist do casamento"}
                            </p>

                            <h2 className="truncate font-serif text-2xl tracking-[-0.03em] sm:text-3xl">
                                {song
                                    ? song.title
                                    : "Nossa trilha sonora"}
                            </h2>

                            <p className="mt-1 text-sm text-white/45">
                                {song
                                    ? song.artist
                                    : "As músicas escolhidas para contar nossa história"}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <motion.button
                            type="button"
                            whileHover={
                                canGoPrevious
                                    ? { scale: 1.04 }
                                    : undefined
                            }
                            whileTap={
                                canGoPrevious
                                    ? { scale: 0.94 }
                                    : undefined
                            }
                            disabled={!canGoPrevious}
                            onClick={onPrevious}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-white disabled:cursor-default disabled:opacity-20"
                            aria-label="Música anterior"
                        >
                            <SkipBack
                                size={18}
                                weight="fill"
                            />
                        </motion.button>

                        <motion.button
                            type="button"
                            whileHover={
                                song?.previewUrl
                                    ? { scale: 1.04 }
                                    : undefined
                            }
                            whileTap={
                                song?.previewUrl
                                    ? { scale: 0.94 }
                                    : undefined
                            }
                            disabled={!song?.previewUrl}
                            onClick={onToggle}
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d9b982] text-[#2c2925] disabled:cursor-default disabled:opacity-40"
                            aria-label={
                                isPlaying
                                    ? "Pausar música"
                                    : "Reproduzir música"
                            }
                        >
                            {isPlaying ? (
                                <Pause
                                    size={19}
                                    weight="fill"
                                />
                            ) : (
                                <Play
                                    size={19}
                                    weight="fill"
                                />
                            )}
                        </motion.button>

                        <motion.button
                            type="button"
                            whileHover={
                                canGoNext
                                    ? { scale: 1.04 }
                                    : undefined
                            }
                            whileTap={
                                canGoNext
                                    ? { scale: 0.94 }
                                    : undefined
                            }
                            disabled={!canGoNext}
                            onClick={onNext}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition hover:bg-white/8 hover:text-white disabled:cursor-default disabled:opacity-20"
                            aria-label="Próxima música"
                        >
                            <SkipForward
                                size={18}
                                weight="fill"
                            />
                        </motion.button>
                    </div>
                </div>

                {/* Progress */}
                <div>
                    <div
                        role="slider"
                        aria-label="Progresso da música"
                        aria-valuemin={0}
                        aria-valuemax={duration || 0}
                        aria-valuenow={currentTime}
                        tabIndex={song?.previewUrl ? 0 : -1}
                        onClick={onSeek}
                        onKeyDown={(event) => {
                            if (
                                !song?.previewUrl ||
                                !duration
                            ) {
                                return;
                            }

                            if (
                                event.key === "ArrowRight"
                            ) {
                                event.preventDefault();

                                if (audioRef.current) {
                                    audioRef.current.currentTime =
                                        Math.min(
                                            duration,
                                            audioRef.current
                                                .currentTime + 5,
                                        );
                                }
                            }

                            if (
                                event.key === "ArrowLeft"
                            ) {
                                event.preventDefault();

                                if (audioRef.current) {
                                    audioRef.current.currentTime =
                                        Math.max(
                                            0,
                                            audioRef.current
                                                .currentTime - 5,
                                        );
                                }
                            }
                        }}
                        className={`group relative h-4 ${song?.previewUrl
                            ? "cursor-pointer"
                            : "cursor-default"
                            }`}
                    >
                        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                className="h-full rounded-full bg-[#d9b982]"
                                animate={{
                                    width: `${progress}%`,
                                }}
                                transition={{
                                    duration: 0.08,
                                    ease: "linear",
                                }}
                            />
                        </div>

                        {song?.previewUrl && (
                            <motion.div
                                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#d9b982] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                style={{
                                    left: `calc(${progress}% - 6px)`,
                                }}
                            />
                        )}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-white/30">
                        <span>
                            {formatTime(currentTime)}
                        </span>

                        <span>
                            {duration
                                ? formatTime(duration)
                                : song?.previewUrl
                                    ? "0:00"
                                    : "—"}
                        </span>
                    </div>
                </div>

                {/* Hidden audio reference */}
                <audio
                    ref={audioRef}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                    onEnded={onEnded}
                    className="hidden"
                />
            </div>
        </section>
    );
}

function PlaylistStat({
    label,
    value,
    detail,
    icon,
}: {
    label: string;
    value: string | number;
    detail: string;
    icon: ReactNode;
}) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="rounded-[22px] border border-[#2c2925]/7 bg-white/60 p-5"
        >
            <div className="mb-5 flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
                    {label}
                </span>

                <span className="text-[#6e4c12]/65">
                    {icon}
                </span>
            </div>

            <p className="font-serif text-3xl tracking-[-0.04em] text-[#2c2925]">
                {value}
            </p>

            <p className="mt-1 text-[11px] text-[#2c2925]/35">
                {detail}
            </p>
        </motion.div>
    );
}

function SongModal({
    loading,
    error,
    onClose,
    onSave,
}: {
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onSave: (
        data: CreateAdminSongPayload,
    ) => void;
}) {
    const [trackId, setTrackId] = useState("");
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [album, setAlbum] = useState("");
    const [artworkUrl, setArtworkUrl] =
        useState("");
    const [previewUrl, setPreviewUrl] =
        useState("");
    const [itunesUrl, setItunesUrl] =
        useState("");

    const canSave = Boolean(
        trackId.trim() &&
        title.trim() &&
        artist.trim(),
    );

    function handleSubmit(
        event: FormEvent,
    ) {
        event.preventDefault();

        if (!canSave || loading) {
            return;
        }

        onSave({
            trackId: trackId.trim(),
            title: title.trim(),
            artist: artist.trim(),
            album: album.trim() || null,
            artworkUrl:
                artworkUrl.trim() || null,
            previewUrl:
                previewUrl.trim() || null,
            itunesUrl:
                itunesUrl.trim() || null,
        });
    }

    return (
        <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-[#2c2925]/35 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
                if (
                    event.currentTarget ===
                    event.target &&
                    !loading
                ) {
                    onClose();
                }
            }}
        >
            <motion.form
                onSubmit={handleSubmit}
                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.98,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-[#f7f4ef] shadow-2xl"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2c2925]/7 bg-[#f7f4ef]/95 px-6 py-5 backdrop-blur-xl sm:px-7">
                    <div>
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6e4c12]">
                            Playlist
                        </p>

                        <h2 className="font-serif text-2xl tracking-[-0.03em]">
                            Adicionar música
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c2925]/5 text-[#2c2925]/45 transition hover:bg-[#2c2925]/10 hover:text-[#2c2925] disabled:opacity-40"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="space-y-5 p-6 sm:p-7">
                    <Field
                        label="Track ID"
                        value={trackId}
                        onChange={setTrackId}
                        placeholder="ID da música no iTunes"
                        required
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                            label="Título"
                            value={title}
                            onChange={setTitle}
                            placeholder="Ex.: Until I Found You"
                            required
                        />

                        <Field
                            label="Artista"
                            value={artist}
                            onChange={setArtist}
                            placeholder="Ex.: Stephen Sanchez"
                            required
                        />
                    </div>

                    <Field
                        label="Álbum"
                        value={album}
                        onChange={setAlbum}
                        placeholder="Ex.: Easy On My Own"
                    />

                    <Field
                        label="URL da capa"
                        value={artworkUrl}
                        onChange={setArtworkUrl}
                        placeholder="https://..."
                    />

                    <Field
                        label="URL da prévia"
                        value={previewUrl}
                        onChange={setPreviewUrl}
                        placeholder="https://..."
                    />

                    <Field
                        label="URL do iTunes"
                        value={itunesUrl}
                        onChange={setItunesUrl}
                        placeholder="https://music.apple.com/..."
                    />

                    {error && (
                        <div className="rounded-2xl border border-red-900/10 bg-red-50 px-4 py-3 text-xs leading-5 text-red-800">
                            {error}
                        </div>
                    )}

                    <div className="rounded-2xl border border-[#6e4c12]/10 bg-[#d9b982]/8 px-4 py-3">
                        <p className="text-[10px] leading-5 text-[#6e4c12]/75">
                            A música será adicionada à
                            playlist pública do casamento e
                            poderá receber curtidas dos
                            convidados.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#2c2925]/7 px-6 py-5 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-10 rounded-full px-4 text-[11px] font-medium text-[#2c2925]/45 transition hover:text-[#2c2925] disabled:opacity-40"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={!canSave || loading}
                        className="h-10 rounded-full bg-[#2c2925] px-5 text-[11px] font-medium text-white transition hover:bg-[#3b3732] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        {loading
                            ? "Adicionando..."
                            : "Adicionar música"}
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#2c2925]/45">
                {label}
            </label>

            <input
                type={type}
                required={required}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                className="h-11 w-full rounded-xl border border-[#2c2925]/8 bg-white/70 px-3.5 text-sm text-[#2c2925] outline-none transition placeholder:text-[#2c2925]/25 focus:border-[#6e4c12]/30 focus:bg-white"
            />
        </div>
    );
}

function EmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex min-h-70 flex-col items-center justify-center rounded-[28px] border border-dashed border-[#2c2925]/10 bg-white/25 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2c2925]/5 text-[#2c2925]/35">
                <MusicNote size={23} />
            </div>

            <h3 className="font-serif text-2xl text-[#2c2925]">
                {title}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#2c2925]/40">
                {description}
            </p>

            {action}
        </div>
    );
}

function SongsSkeleton() {
    return (
        <section className="overflow-hidden rounded-[28px] border border-[#2c2925]/7 bg-white/60">
            {Array.from({ length: 6 }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 border-b border-[#2c2925]/6 px-4 py-4 sm:px-5"
                    >
                        <div className="h-5 w-5 animate-pulse rounded bg-[#e9e3da]" />

                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-[14px] bg-[#e9e3da]" />

                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/3 animate-pulse rounded bg-[#e9e3da]" />

                            <div className="h-3 w-1/4 animate-pulse rounded bg-[#eee9e1]" />
                        </div>
                    </div>
                ),
            )}
        </section>
    );
}

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(
        seconds / 60,
    );

    const remainingSeconds = Math.floor(
        seconds % 60,
    );

    return `${minutes}:${String(
        remainingSeconds,
    ).padStart(2, "0")}`;
}

function getMutationErrorMessage(
    error: unknown,
) {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const response = (
            error as {
                response?: {
                    data?: {
                        error?: string;
                    };
                };
            }
        ).response;

        return (
            response?.data?.error ??
            "Não foi possível adicionar a música."
        );
    }

    return "Não foi possível adicionar a música.";
}
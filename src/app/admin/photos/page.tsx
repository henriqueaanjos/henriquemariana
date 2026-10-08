"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Check,
  DotsThree,
  Eye,
  ImageSquare,
  MagnifyingGlass,
  Plus,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";

import { AnimatePresence, motion } from "motion/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { ConfirmDeleteModal } from "@/src/components/admin/ConfirmDeleteModal";
import {
  deleteAdminPhoto,
  getAdminPhotos,
  type AdminPhoto,
} from "@/src/services/admin-photos";
import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";

export default function AdminPhotosPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<AdminPhoto | null>(null);

  const [showUpload, setShowUpload] = useState(false);

  const [deletingPhoto, setDeletingPhoto] =
    useState<AdminPhoto | null>(null);

  /*
   * --------------------------------------------------------------------------
   * QUERY
   * --------------------------------------------------------------------------
   */

  const photosQuery = useQuery({
    queryKey: ["admin-photos"],
    queryFn: getAdminPhotos,
  });

  const photos = photosQuery.data ?? [];

  /*
   * --------------------------------------------------------------------------
   * MUTATIONS
   * --------------------------------------------------------------------------
   */

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoIds: string[]) => {
      await Promise.all(
        photoIds.map((photoId) => deleteAdminPhoto(photoId)),
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-photos"],
      });

      setSelected([]);
      setDeletingPhoto(null);
      setPreview(null);
    },
  });

  /*
   * --------------------------------------------------------------------------
   * FILTER
   * --------------------------------------------------------------------------
   */

  const filteredPhotos = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) {
      return photos;
    }

    return photos.filter((photo) => {
      return (
        photo.name.toLowerCase().includes(normalizedSearch) ||
        photo.userName.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [photos, search]);

  /*
   * --------------------------------------------------------------------------
   * STATS
   * --------------------------------------------------------------------------
   */

  const totalPhotos = photos.length;

  const uniqueAuthors = new Set(
    photos.map((photo) => photo.userName),
  ).size;

  /*
   * --------------------------------------------------------------------------
   * SELECTION
   * --------------------------------------------------------------------------
   */

  const allFilteredSelected =
    filteredPhotos.length > 0 &&
    filteredPhotos.every((photo) =>
      selected.includes(photo.id),
    );

  function togglePhoto(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleAll() {
    if (allFilteredSelected) {
      setSelected((current) =>
        current.filter(
          (id) =>
            !filteredPhotos.some(
              (photo) => photo.id === id,
            ),
        ),
      );

      return;
    }

    setSelected((current) => [
      ...new Set([
        ...current,
        ...filteredPhotos.map((photo) => photo.id),
      ]),
    ]);
  }

  /*
   * --------------------------------------------------------------------------
   * DELETE
   * --------------------------------------------------------------------------
   */

  function handleDeletePhoto() {
    if (selected.length > 0) {
      deletePhotoMutation.mutate(selected);
      return;
    }

    if (deletingPhoto) {
      deletePhotoMutation.mutate([deletingPhoto.id]);
    }
  }

  /*
   * --------------------------------------------------------------------------
   * RENDER
   * --------------------------------------------------------------------------
   */

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------------------------------------- */}

        <AdminPageHeader
          eyebrow="Galeria"
          title="Fotos"
          description="Gerencie as fotos enviadas pelos convidados para a galeria do casamento."
        />

        {/* ---------------------------------------------------------------- */}
        {/* STATS */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<ImageSquare size={19} weight="duotone" />}
            label="Total de fotos"
            value={totalPhotos}
            highlight
          />

          <StatCard
            icon={<Check size={19} weight="bold" />}
            label="Convidados"
            value={uniqueAuthors}
          />

          <StatCard
            icon={<ImageSquare size={19} weight="duotone" />}
            label="Fotos na galeria"
            value={totalPhotos}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TOOLBAR */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full flex-1">
              <MagnifyingGlass
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c2925]/35"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome da foto ou convidado..."
                className="h-11 w-full rounded-full border border-[#2c2925]/8 bg-white/65 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#2c2925]/30 focus:border-[#6e4c12]/30 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={toggleAll}
              disabled={filteredPhotos.length === 0}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#2c2925]/8 bg-white/55 px-4 text-[11px] font-medium text-[#2c2925]/55 transition hover:bg-white hover:text-[#2c2925] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-[5px] border ${allFilteredSelected
                    ? "border-[#2c2925] bg-[#2c2925] text-white"
                    : "border-[#2c2925]/15 bg-white"
                  }`}
              >
                {allFilteredSelected && (
                  <Check
                    size={10}
                    weight="bold"
                  />
                )}
              </span>

              {allFilteredSelected
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </button>
          </div>

          <AnimatePresence>
            {selected.length > 0 && (
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
                className="flex items-center gap-1"
              >
                <span className="mr-2 px-2 text-[11px] text-[#2c2925]/45">
                  {selected.length} selecionada
                  {selected.length > 1 ? "s" : ""}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const photo = photos.find(
                      (item) => item.id === selected[0],
                    );

                    if (photo) {
                      setDeletingPhoto(photo);
                    }
                  }}
                  className="flex h-10 items-center gap-2 rounded-full px-3 text-[11px] font-medium text-red-800 transition hover:bg-red-50"
                >
                  <Trash size={15} />
                  Excluir
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CONTENT */}
        {/* ---------------------------------------------------------------- */}

        {photosQuery.isLoading ? (
          <PhotoGridSkeleton />
        ) : photosQuery.isError ? (
          <EmptyState
            title="Não foi possível carregar as fotos"
            description="Ocorreu um erro ao buscar as fotos da galeria."
          />
        ) : filteredPhotos.length === 0 ? (
          <EmptyState
            title={
              search
                ? "Nenhuma foto encontrada"
                : "Nenhuma foto ainda"
            }
            description={
              search
                ? "Tente buscar por outro nome de arquivo ou convidado."
                : "As fotos enviadas pelos convidados aparecerão aqui."
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => {
                const isSelected = selected.includes(
                  photo.id,
                );

                return (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    selected={isSelected}
                    onSelect={() =>
                      togglePhoto(photo.id)
                    }
                    onPreview={() =>
                      setPreview(photo)
                    }
                    onDelete={() =>
                      setDeletingPhoto(photo)
                    }
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PREVIEW */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence>
        {preview && (
          <PreviewModal
            photo={preview}
            onClose={() => setPreview(null)}
            onDelete={() => {
              setDeletingPhoto(preview);
              setPreview(null);
            }}
          />
        )}
      </AnimatePresence>
      {/* ------------------------------------------------------------------ */}
      {/* DELETE */}
      {/* ------------------------------------------------------------------ */}

      <ConfirmDeleteModal
        open={Boolean(deletingPhoto)}
        title={
          selected.length > 1
            ? `Excluir ${selected.length} fotos?`
            : "Excluir foto?"
        }
        description={
          selected.length > 1
            ? `${selected.length} fotos serão removidas permanentemente da galeria.`
            : deletingPhoto
              ? `A foto "${deletingPhoto.name}" será removida permanentemente da galeria.`
              : "Esta ação não poderá ser desfeita."
        }
        confirmLabel={
          selected.length > 1
            ? `Excluir ${selected.length} fotos`
            : "Excluir foto"
        }
        isLoading={deletePhotoMutation.isPending}
        onClose={() => {
          if (!deletePhotoMutation.isPending) {
            setDeletingPhoto(null);
          }
        }}
        onConfirm={handleDeletePhoto}
      />
    </AdminShell>
  );
}

/*
|--------------------------------------------------------------------------
| PHOTO CARD
|--------------------------------------------------------------------------
*/

function PhotoCard({
  photo,
  selected,
  onSelect,
  onPreview,
  onDelete,
}: {
  photo: AdminPhoto;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDelete: () => void;
}) {
  const formattedDate = new Date(
    photo.createdAt,
  ).toLocaleDateString("pt-BR");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-2xl border border-[#e9e1d6] bg-white shadow-[0_8px_30px_rgba(80,60,40,0.04)]"
    >
      {/* Image */}

      <div className="relative aspect-square overflow-hidden bg-[#f2eee8]">
        <img
          src={photo.url}
          alt={photo.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10 opacity-0 transition group-hover:opacity-100" />

        {/* Selection */}

        <button
          type="button"
          onClick={onSelect}
          aria-label={
            selected
              ? "Desmarcar foto"
              : "Selecionar foto"
          }
          className={`absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition ${selected
            ? "border-[#332a20] bg-[#332a20] text-white"
            : "border-white/80 bg-white/80 text-[#665b4e] opacity-0 group-hover:opacity-100"
            }`}
        >
          {selected && (
            <Check size={16} weight="bold" />
          )}
        </button>

        {/* Actions */}

        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={onPreview}
            aria-label="Visualizar foto"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#4e4439] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Excluir foto"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Info */}

      <div className="p-3.5">
        <div className="truncate text-sm font-medium text-[#3c332a]">
          {photo.name}
        </div>

        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="truncate text-xs text-[#9b9084]">
            {photo.userName}
          </span>

          <span className="shrink-0 text-[11px] text-[#b1a79c]">
            {formattedDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/*
|--------------------------------------------------------------------------
| PREVIEW MODAL
|--------------------------------------------------------------------------
*/

function PreviewModal({
  photo,
  onClose,
  onDelete,
}: {
  photo: AdminPhoto;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:flex-row"
      >
        {/* Image */}

        <div className="relative flex min-h-80 flex-1 items-center justify-center bg-[#f2eee8]">
          <img
            src={photo.url}
            alt={photo.name}
            className="max-h-[75vh] max-w-full object-contain"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Details */}

        <div className="flex w-full flex-col justify-between p-6 lg:w-[320px]">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#a18d70]">
                  Detalhes
                </span>

                <h2 className="mt-1 font-serif text-2xl text-[#332a20]">
                  Foto
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#f6f2ec] text-[#665b4e] transition hover:bg-[#eee8df] lg:flex"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <PreviewInfo
                label="Enviada por"
                value={photo.userName}
              />

              <PreviewInfo
                label="Arquivo"
                value={photo.name}
              />

              <PreviewInfo
                label="Enviada em"
                value={new Date(
                  photo.createdAt,
                ).toLocaleString("pt-BR")}
              />

              {photo.storageKey && (
                <PreviewInfo
                  label="Storage"
                  value={photo.storageKey}
                />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash size={17} />
            Excluir foto
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/*
|--------------------------------------------------------------------------
| UPLOAD MODAL
|--------------------------------------------------------------------------
*/

function UploadModal({
  files,
  name,
  isLoading,
  error,
  onNameChange,
  onFilesChange,
  onClose,
  onUpload,
}: {
  files: File[];
  name: string;
  isLoading: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onFilesChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onClose: () => void;
  onUpload: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#a18d70]">
              Galeria
            </span>

            <h2 className="mt-1 font-serif text-2xl text-[#332a20]">
              Adicionar fotos
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#8d8378]">
              Envie fotos para a galeria do casamento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f2ec] text-[#665b4e] transition hover:bg-[#eee8df] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}

        <div className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d4338]">
              Nome
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                onNameChange(event.target.value)
              }
              disabled={isLoading}
              placeholder="Nome de quem está enviando"
              className="h-11 w-full rounded-xl border border-[#e9e1d6] bg-[#fcfaf7] px-4 text-sm text-[#332a20] outline-none transition placeholder:text-[#b4a99d] focus:border-[#bca783] disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d4338]">
              Fotos
            </label>

            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8cbb9] bg-[#fcfaf7] px-5 text-center transition hover:border-[#bca783] hover:bg-[#faf6f0]">
              <UploadSimple
                size={28}
                weight="duotone"
                className="text-[#9d8766]"
              />

              <span className="mt-3 text-sm font-medium text-[#665b4e]">
                Clique para selecionar
              </span>

              <span className="mt-1 text-xs text-[#a89d91]">
                JPG, PNG ou WEBP · até 10 MB por foto
              </span>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={onFilesChange}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="rounded-xl border border-[#e9e1d6] bg-[#fcfaf7] p-3">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#9a8a76]">
                {files.length} arquivo
                {files.length !== 1 ? "s" : ""} selecionado
                {files.length !== 1 ? "s" : ""}
              </div>

              <div className="max-h-28 space-y-1 overflow-auto">
                {files.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="truncate text-xs text-[#665b4e]"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-11 rounded-xl px-5 text-sm font-medium text-[#665b4e] transition hover:bg-[#f6f2ec] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onUpload}
            disabled={
              isLoading ||
              files.length === 0 ||
              !name.trim()
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#332a20] px-5 text-sm font-medium text-white transition hover:bg-[#493b2d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadSimple size={17} />

            {isLoading
              ? "Enviando..."
              : "Enviar fotos"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 ${highlight
          ? "border-[#d9b982]/25 bg-[#d9b982]/10"
          : "border-[#2c2925]/7 bg-white/60"
        }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
          {label}
        </span>

        <span
          className={
            highlight
              ? "text-[#6e4c12]"
              : "text-[#6e4c12]/65"
          }
        >
          {icon}
        </span>
      </div>

      <p className="font-serif text-3xl tracking-[-0.04em] text-[#2c2925]">
        {value}
      </p>

      <p className="mt-1 truncate text-[11px] text-[#2c2925]/35">
        {label === "Total de fotos"
          ? "fotos enviadas"
          : label === "Convidados"
            ? "convidados participantes"
            : "fotos disponíveis na galeria"}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| PREVIEW INFO
|--------------------------------------------------------------------------
*/

function PreviewInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#a99b8b]">
        {label}
      </div>

      <div className="mt-1 break-all text-sm leading-5 text-[#4d4338]">
        {value}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

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
    <div className="flex min-h-90 flex-col items-center justify-center rounded-3xl border border-dashed border-[#ddd2c4] bg-white/50 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5efe7] text-[#a18b6c]">
        <ImageSquare size={26} weight="duotone" />
      </div>

      <h3 className="mt-5 font-serif text-2xl text-[#332a20]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#8d8378]">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SKELETON
|--------------------------------------------------------------------------
*/

function PhotoGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map(
        (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-[#e9e1d6] bg-white"
          >
            <div className="aspect-square animate-pulse bg-[#eee8df]" />

            <div className="space-y-2 p-3.5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#eee8df]" />

              <div className="h-3 w-1/2 animate-pulse rounded bg-[#f1ece5]" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
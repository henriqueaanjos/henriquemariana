"use client";

import { useMemo, useState } from "react";
import {
  Check,
  EnvelopeSimple,
  Heart,
  MagnifyingGlass,
  PaperPlaneTilt,
  Trash,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { ConfirmDeleteModal } from "@/src/components/admin/ConfirmDeleteModal";
import {
  deleteAdminMessage,
  getAdminMessages,
  type AdminMessage,
} from "@/src/services/admin-messages";

export default function MessagesAdminPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<AdminMessage | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AdminMessage | null>(null);

  const [deleteBulkOpen, setDeleteBulkOpen] = useState(false);

  const messagesQuery = useQuery({
    queryKey: ["admin-messages"],
    queryFn: getAdminMessages,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-messages"],
      });
    },
  });

  const messages = messagesQuery.data ?? [];

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search
      .toLowerCase()
      .trim();

    if (!normalizedSearch) {
      return messages;
    }

    return messages.filter((message) => {
      return (
        message.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        message.message
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [messages, search]);

  const todayCount = useMemo(() => {
    const today = new Date();

    return messages.filter((message) => {
      const date = new Date(message.createdAt);

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length;
  }, [messages]);

  const lastSevenDaysCount = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return messages.filter((message) => {
      const createdAt = new Date(
        message.createdAt,
      ).getTime();

      return now - createdAt <= sevenDays;
    }).length;
  }, [messages]);

  const latestMessage = messages[0];

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function openMessage(message: AdminMessage) {
    setSelectedMessage(message);
  }

  function openDeleteModal(message: AdminMessage) {
    setDeleteTarget(message);
  }

  function closeDeleteModal() {
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    await deleteMutation.mutateAsync(deleteTarget.id);

    setSelectedIds((current) =>
      current.filter(
        (id) => id !== deleteTarget.id,
      ),
    );

    if (selectedMessage?.id === deleteTarget.id) {
      setSelectedMessage(null);
    }

    setDeleteTarget(null);
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) {
      return;
    }

    await Promise.all(
      selectedIds.map((id) =>
        deleteAdminMessage(id),
      ),
    );

    await queryClient.invalidateQueries({
      queryKey: ["admin-messages"],
    });

    if (
      selectedMessage &&
      selectedIds.includes(selectedMessage.id)
    ) {
      setSelectedMessage(null);
    }

    setSelectedIds([]);
    setDeleteBulkOpen(false);
  }

  function toggleAllVisible() {
    const visibleIds = filteredMessages.map(
      (message) => message.id,
    );

    const allSelected = visibleIds.every((id) =>
      selectedIds.includes(id),
    );

    if (allSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) => !visibleIds.includes(id),
        ),
      );
      return;
    }

    setSelectedIds((current) => [
      ...current,
      ...visibleIds.filter(
        (id) => !current.includes(id),
      ),
    ]);
  }

  const allVisibleSelected =
    filteredMessages.length > 0 &&
    filteredMessages.every((message) =>
      selectedIds.includes(message.id),
    );

  const isLoading = messagesQuery.isLoading;
  const isError = messagesQuery.isError;

  return (
    <AdminShell>
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Mensagens dos convidados"
          title="Recados"
          description="Guarde as palavras e mensagens deixadas pelos convidados para vocês."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MessageStat
            label="Total"
            value={messages.length}
            detail="recados recebidos"
            icon={<EnvelopeSimple size={19} />}
          />

          <MessageStat
            label="Hoje"
            value={todayCount}
            detail="recados recebidos hoje"
            icon={<PaperPlaneTilt size={19} />}
            highlight
          />

          <MessageStat
            label="Últimos 7 dias"
            value={lastSevenDaysCount}
            detail="recados nesta semana"
            icon={<Heart size={19} />}
          />

          <MessageStat
            label="Mais recente"
            value={
              latestMessage
                ? formatRelativeDate(
                    latestMessage.createdAt,
                  )
                : "—"
            }
            detail={
              latestMessage
                ? latestMessage.name
                : "nenhum recado"
            }
            icon={<EnvelopeSimple size={19} />}
          />
        </div>

        {/* Featured message */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#2c2925]/7 bg-[#2c2925] p-6 text-white sm:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d9b982]/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9b982]/15 text-[#d9b982]">
                <Heart
                  size={15}
                  weight="fill"
                />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d9b982]">
                Uma coleção de carinho
              </span>
            </div>

            <p className="font-serif text-2xl leading-[1.2] tracking-tight text-white sm:text-3xl lg:text-[34px]">
              “Cada mensagem deixada aqui é um
              pedacinho da história que estamos
              construindo junto com quem amamos.”
            </p>

            <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-white/30">
              Mariana & Henrique · 09.01.2027
            </p>
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full flex-1">
              <MagnifyingGlass
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c2925]/35"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar por nome ou mensagem..."
                className="h-11 w-full rounded-full border border-[#2c2925]/8 bg-white/65 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#2c2925]/30 focus:border-[#6e4c12]/30 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={toggleAllVisible}
              disabled={filteredMessages.length === 0}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#2c2925]/8 bg-white/55 px-4 text-[11px] font-medium text-[#2c2925]/55 transition hover:bg-white hover:text-[#2c2925] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-[5px] border ${
                  allVisibleSelected
                    ? "border-[#2c2925] bg-[#2c2925] text-white"
                    : "border-[#2c2925]/15 bg-white"
                }`}
              >
                {allVisibleSelected && (
                  <Check
                    size={10}
                    weight="bold"
                  />
                )}
              </span>

              {allVisibleSelected
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </button>
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
                className="flex items-center gap-1"
              >
                <span className="mr-2 px-2 text-[11px] text-[#2c2925]/45">
                  {selectedIds.length} selecionado
                  {selectedIds.length > 1
                    ? "s"
                    : ""}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteBulkOpen(true)
                  }
                  className="flex h-10 items-center gap-2 rounded-full px-3 text-[11px] font-medium text-red-800 transition hover:bg-red-50"
                >
                  <Trash size={15} />
                  Excluir
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        <section className="overflow-hidden rounded-[28px] border border-[#2c2925]/7 bg-white/60">
          {isLoading ? (
            <MessagesSkeleton />
          ) : isError ? (
            <MessagesError
              onRetry={() =>
                messagesQuery.refetch()
              }
            />
          ) : filteredMessages.length > 0 ? (
            <div>
              {filteredMessages.map(
                (message, index) => {
                  const selected =
                    selectedIds.includes(
                      message.id,
                    );

                  return (
                    <motion.div
                      key={message.id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.025,
                      }}
                      className={`group border-b border-[#2c2925]/6 px-4 py-4 last:border-0 sm:px-5 ${
                        selected
                          ? "bg-[#d9b982]/10"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleSelected(
                              message.id,
                            )
                          }
                          aria-label={
                            selected
                              ? "Desmarcar recado"
                              : "Selecionar recado"
                          }
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            selected
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

                        {/* Avatar */}
                        <button
                          type="button"
                          onClick={() =>
                            openMessage(message)
                          }
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d9b982]/20 font-serif text-lg text-[#6e4c12]"
                        >
                          {message.name
                            .charAt(0)
                            .toUpperCase()}
                        </button>

                        {/* Content */}
                        <button
                          type="button"
                          onClick={() =>
                            openMessage(message)
                          }
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span className="truncate text-sm font-medium text-[#2c2925]/75">
                              {message.name}
                            </span>

                            <span className="shrink-0 text-[10px] text-[#2c2925]/30">
                              {formatDate(
                                message.createdAt,
                              )}
                            </span>
                          </div>

                          <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-[#2c2925]/45">
                            {message.message}
                          </p>
                        </button>

                        {/* Actions */}
                        <div className="flex shrink-0 items-start gap-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                message,
                              )
                            }
                            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#2c2925]/20 transition hover:bg-red-50 hover:text-red-700 sm:flex"
                            aria-label="Excluir"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2c2925]/5 text-[#2c2925]/35">
                <EnvelopeSimple size={23} />
              </div>

              <h3 className="font-serif text-2xl text-[#2c2925]">
                Nenhum recado encontrado
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#2c2925]/40">
                {search
                  ? "Não encontramos mensagens para o termo utilizado."
                  : "Ainda não existem recados enviados pelos convidados."}
              </p>
            </div>
          )}
        </section>

        <p className="flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.18em] text-[#2c2925]/25">
          <PaperPlaneTilt size={12} />
          Cada recado fica guardado na história do casamento
        </p>
      </div>

      {/* Message modal */}
      <AnimatePresence>
        {selectedMessage && (
          <MessageModal
            message={
              messages.find(
                (message) =>
                  message.id ===
                  selectedMessage.id,
              ) ?? selectedMessage
            }
            onClose={() =>
              setSelectedMessage(null)
            }
            onDelete={() =>
              openDeleteModal(selectedMessage)
            }
          />
        )}
      </AnimatePresence>

      {/* Delete single */}
      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        title="Excluir recado?"
        description={
          deleteTarget
            ? `O recado de ${deleteTarget.name} será excluído permanentemente.`
            : ""
        }
        onConfirm={handleDelete}
        onClose={closeDeleteModal}
        isLoading={deleteMutation.isPending}
      />

      {/* Delete bulk */}
      <ConfirmDeleteModal
        open={deleteBulkOpen}
        title="Excluir recados?"
        description={`Você está prestes a excluir ${selectedIds.length} recado${
          selectedIds.length > 1 ? "s" : ""
        } permanentemente.`}
        onConfirm={handleBulkDelete}
        onClose={() =>
          setDeleteBulkOpen(false)
        }
        isLoading={false}
      />
    </AdminShell>
  );
}

function MessageStat({
  label,
  value,
  detail,
  icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 ${
        highlight
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
        {detail}
      </p>
    </div>
  );
}

function MessageModal({
  message,
  onClose,
  onDelete,
}: {
  message: AdminMessage;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#2c2925]/35 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <motion.div
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
        className="w-full max-w-xl overflow-hidden rounded-[28px] bg-[#f7f4ef] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2c2925]/7 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9b982]/20 font-serif text-lg text-[#6e4c12]">
              {message.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-medium text-[#2c2925]">
                {message.name}
              </p>

              <p className="mt-0.5 text-[10px] text-[#2c2925]/35">
                {formatDate(
                  message.createdAt,
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c2925]/5 text-[#2c2925]/45 transition hover:bg-[#2c2925]/10 hover:text-[#2c2925]"
            aria-label="Fechar"
          >
            <X size={17} />
          </button>
        </div>

        {/* Message */}
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-5 text-[#6e4c12]/40">
            <PaperPlaneTilt size={19} />
          </div>

          <p className="font-serif text-2xl leading-[1.35] tracking-[-0.02em] text-[#2c2925] sm:text-[27px]">
            {message.message}
          </p>

          <div className="mt-8 flex items-center gap-2">
            <span className="h-px w-8 bg-[#d9b982]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2c2925]/30">
              Mariana & Henrique
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end border-t border-[#2c2925]/7 px-6 py-5 sm:px-7">
          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 items-center gap-2 rounded-full px-4 text-[11px] font-medium text-red-800 transition hover:bg-red-50"
          >
            <Trash size={15} />
            Excluir recado
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MessagesSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex gap-3 border-b border-[#2c2925]/6 px-4 py-4 last:border-0 sm:gap-4 sm:px-5"
          >
            <div className="mt-1 h-5 w-5 shrink-0 animate-pulse rounded-md bg-[#2c2925]/5" />

            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#2c2925]/5" />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-36 animate-pulse rounded-full bg-[#2c2925]/5" />

              <div className="mt-3 h-3 w-full max-w-2xl animate-pulse rounded-full bg-[#2c2925]/5" />

              <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[#2c2925]/5" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function MessagesError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-700">
        <EnvelopeSimple size={23} />
      </div>

      <h3 className="font-serif text-2xl text-[#2c2925]">
        Não foi possível carregar os recados
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-[#2c2925]/40">
        Ocorreu um erro ao buscar as mensagens.
        Tente novamente.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#2c2925] px-5 py-2.5 text-[11px] font-medium text-white transition hover:bg-[#2c2925]/90"
      >
        Tentar novamente
      </button>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data desconhecida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(".", "");
}

function formatRelativeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}
"use client";

import { useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ClipboardText,
  Copy,
  EnvelopeSimple,
  LinkSimple,
  PencilSimple,
  Trash,
  User,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AddGuestModal } from "@/src/components/admin/AddGuestModal";
import { EditFamilyModal } from "@/src/components/admin/EditFamilyModal";
import { EditGuestModal } from "@/src/components/admin/EditGuestModal";
import { ConfirmDeleteModal } from "@/src/components/admin/ConfirmDeleteModal";

import type {
  AdminRSVPFamilyGuest,
  RSVPGuestStatus,
} from "@/src/services/admin-rsvp-family";

import {
  createAdminRSVPFamilyMember,
  getAdminRSVPFamily,
  updateAdminRSVPFamily,
  deleteAdminRSVPFamily,
  deleteAdminRSVPFamilyMember,
  updateAdminRSVPFamilyMember,
} from "@/src/services/admin-rsvp-family";

const statusConfig: Record<
  RSVPGuestStatus,
  {
    label: string;
    className: string;
    icon: typeof Check;
  }
> = {
  confirmed: {
    label: "Confirmado",
    className: "bg-[#6e4c12]/8 text-[#6e4c12]",
    icon: Check,
  },
  pending: {
    label: "Pendente",
    className: "bg-[#2c2925]/6 text-[#2c2925]/55",
    icon: ClipboardText,
  },
  declined: {
    label: "Recusado",
    className: "bg-[#8d4b42]/8 text-[#8d4b42]",
    icon: X,
  },
};

function StatusBadge({ status }: { status: RSVPGuestStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${config.className}`}
    >
      <Icon size={11} weight="bold" />
      {config.label}
    </span>
  );
}

export default function RSVPFamilyPage() {
  const [copied, setCopied] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isEditFamilyOpen, setIsEditFamilyOpen] = useState(false);
  const [editingGuest, setEditingGuest] =
    useState<AdminRSVPFamilyGuest | null>(null);
  const [deletingGuest, setDeletingGuest] =
    useState<AdminRSVPFamilyGuest | null>(null);
  const [isDeleteFamilyOpen, setIsDeleteFamilyOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const familyId = String(params.familyId);

  const {
    data: family,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-rsvp-family", familyId],
    queryFn: () => getAdminRSVPFamily(familyId),
    enabled: Boolean(familyId),
  });

  const queryClient = useQueryClient();

  const addGuestMutation = useMutation({
    mutationFn: (name: string) =>
      createAdminRSVPFamilyMember(familyId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-family", familyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-families"],
      });

      setIsAddGuestOpen(false);
    },
  });

  const editFamilyMutation = useMutation({
    mutationFn: (name: string) =>
      updateAdminRSVPFamily(familyId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-family", familyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-families"],
      });

      setIsEditFamilyOpen(false);
    },
  });

  const editGuestMutation = useMutation({
    mutationFn: ({
      memberId,
      name,
      status,
    }: {
      memberId: string;
      name: string;
      status: RSVPGuestStatus;
    }) =>
      updateAdminRSVPFamilyMember(
        familyId,
        memberId,
        {
          name,
          status,
        },
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-family", familyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-families"],
      });

      setEditingGuest(null);
    },
  });

  const deleteGuestMutation = useMutation({
    mutationFn: (memberId: string) =>
      deleteAdminRSVPFamilyMember(
        familyId,
        memberId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-family", familyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-families"],
      });

      setDeletingGuest(null);
    },
  });

  const deleteFamilyMutation = useMutation({
    mutationFn: () =>
      deleteAdminRSVPFamily(familyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-families"],
      });

      queryClient.removeQueries({
        queryKey: ["admin-rsvp-family", familyId],
      });

      setIsDeleteFamilyOpen(false);

      router.replace("/admin/rsvp");
    },
  });

  function formatDateTime(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  }

  if (isLoading) {
    return (
      <AdminShell>
        <div className="pb-10">
          <div className="mb-8">
            <div className="h-4 w-24 animate-pulse rounded bg-[#2c2925]/5" />

            <div className="mt-5 h-12 w-72 animate-pulse rounded-xl bg-[#2c2925]/5" />

            <div className="mt-4 h-6 w-48 animate-pulse rounded-full bg-[#2c2925]/5" />
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-[22px] bg-[#2c2925]/5"
              />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="h-[420px] animate-pulse rounded-[26px] bg-[#2c2925]/5" />

            <div className="space-y-5">
              <div className="h-72 animate-pulse rounded-[26px] bg-[#2c2925]/5" />
              <div className="h-64 animate-pulse rounded-[26px] bg-[#2c2925]/5" />
            </div>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (isError || !family) {
    return (
      <AdminShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2c2925]/5">
            <UsersThree
              size={24}
              className="text-[#2c2925]/40"
            />
          </div>

          <h1 className="font-serif text-3xl text-[#2c2925]">
            Família não encontrada
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#2c2925]/45">
            A família que você tentou acessar não existe ou não está mais
            disponível.
          </p>

          <button
            type="button"
            onClick={() => router.push("/admin/rsvp")}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#2c2925] px-5 text-xs font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={14} />
            Voltar para convidados
          </button>
        </div>
      </AdminShell>
    );
  }

  const confirmed = family.guests.filter(
    (guest) => guest.status === "confirmed",
  ).length;

  const pending = family.guests.filter(
    (guest) => guest.status === "pending",
  ).length;

  const declined = family.guests.filter(
    (guest) => guest.status === "declined",
  ).length;

  const total = family.guests.length;

  const familyStatus =
    total > 0 && confirmed === total
      ? "Todos confirmados"
      : total > 0 &&
          confirmed === 0 &&
          declined === total
        ? "Recusado"
        : "Resposta parcial";

  async function handleCopyCode() {
    if (!family) return;

    await navigator.clipboard.writeText(family.code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  async function handleCopyLink() {
    if (!family) return;

    const url = `${window.location.origin}/rsvp/${family.code}`;

    await navigator.clipboard.writeText(url);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  async function handleCopyInvite() {
    if (!family) return;

    const url = `${window.location.origin}/rsvp/${family.code}`;

    const message = `Olá, ${family.name}! 💛

É com muito carinho que queremos compartilhar com vocês um momento muito especial das nossas vidas.

Estamos preparando tudo com muito amor para celebrar o nosso casamento e seria uma alegria enorme ter vocês conosco nesse dia. ✨

Para confirmar a presença, acesse o nosso site:

${url}

O código de confirmação da família é: ${family.code}

Esperamos celebrar esse momento tão especial ao lado de vocês! 🥂

Com carinho,
Mariana & Henrique 🤍`;

    await navigator.clipboard.writeText(message);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <AdminShell>
      <div className="pb-10">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/admin/rsvp")}
            className="group mb-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2c2925]/45 transition-colors hover:text-[#6e4c12]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Convidados
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6e4c12]">
                  Grupo familiar
                </span>

                <span className="h-1 w-1 rounded-full bg-[#6e4c12]/40" />

                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#2c2925]/35">
                  {family.code}
                </span>
              </div>

              <h1 className="font-serif text-4xl leading-none tracking-[-0.045em] text-[#2c2925] sm:text-5xl">
                {family.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#6e4c12]/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#6e4c12]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6e4c12]" />
                  {familyStatus}
                </span>

                <span className="text-xs text-[#2c2925]/40">
                  {total} {total === 1 ? "convidado" : "convidados"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyInvite}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#2c2925]/8 bg-white/50 px-4 text-[11px] font-medium text-[#2c2925]/65 transition-all hover:border-[#6e4c12]/20 hover:bg-white"
              >
                {copied ? (
                  <>
                    <Check size={15} weight="bold" />
                    Copiado
                  </>
                ) : (
                  <>
                    <EnvelopeSimple size={15} />
                    Copiar convite
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsEditFamilyOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2c2925] px-4 text-[11px] font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                <PencilSimple size={15} />
                Editar família
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteFamilyOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#8d4b42]/15 bg-[#8d4b42]/[0.06] px-4 text-[11px] font-medium text-[#8d4b42] transition-all hover:border-[#8d4b42]/25 hover:bg-[#8d4b42]/[0.1]"
              >
                <Trash size={15} />
                Excluir família
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            label="Convidados"
            value={total}
            icon={<UsersThree size={17} />}
          />

          <SummaryCard
            label="Confirmados"
            value={confirmed}
            icon={<Check size={17} />}
            accent
          />

          <SummaryCard
            label="Pendentes"
            value={pending}
            icon={<ClipboardText size={17} />}
          />

          <SummaryCard
            label="Recusados"
            value={declined}
            icon={<X size={17} />}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          {/* Guests */}
          <section className="overflow-hidden rounded-[26px] border border-[#2c2925]/7 bg-white/45">
            <div className="flex flex-col gap-4 border-b border-[#2c2925]/7 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6e4c12]">
                  Lista de convidados
                </p>

                <h2 className="mt-1 font-serif text-2xl tracking-[-0.03em] text-[#2c2925]">
                  Pessoas desta família
                </h2>
              </div>

              <button
                onClick={() => setIsAddGuestOpen(true)}
                type="button"
                className="inline-flex h-9 items-center gap-2 self-start rounded-full border border-[#2c2925]/8 px-3.5 text-[10px] font-semibold uppercase tracking-widest text-[#2c2925]/55 transition-colors hover:bg-white"
              >
                <User size={14} />
                Adicionar pessoa
              </button>
            </div>

            <div className="divide-y divide-[#2c2925]/6">
              {family.guests.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.35,
                  }}
                  className="group flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2c2925]/5 text-[#2c2925]/45">
                      <User size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#2c2925]">
                        {guest.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#2c2925]/35">
                        Convidado #{String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <StatusBadge status={guest.status} />

                    <button
                      type="button"
                      onClick={() => setEditingGuest(guest)}
                      aria-label={`Editar ${guest.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#2c2925]/30 transition-colors hover:bg-[#2c2925]/5 hover:text-[#2c2925]"
                    >
                      <PencilSimple size={15} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Excluir ${guest.name}`}
                      onClick={() => setDeletingGuest(guest)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A08D87] transition hover:bg-[#8D4B42]/[0.07] hover:text-[#8D4B42]"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Sidebar information */}
          <aside className="space-y-5">
            {/* RSVP access */}
            <section className="rounded-[26px] border border-[#2c2925]/7 bg-[#2c2925] p-6 text-white">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d9b982]">
                    Acesso RSVP
                  </p>

                  <h2 className="mt-2 font-serif text-2xl tracking-[-0.03em]">
                    Código da família
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8">
                  <LinkSimple
                    size={16}
                    className="text-[#d9b982]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Código
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-sm tracking-[0.08em] text-white/90">
                    {family.code}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    {copied ? (
                      <Check size={14} weight="bold" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Group information */}
            <section className="rounded-[26px] border border-[#2c2925]/7 bg-white/45 p-6">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6e4c12]">
                  Informações
                </p>

                <h2 className="mt-1 font-serif text-2xl tracking-[-0.03em] text-[#2c2925]">
                  Sobre a família
                </h2>
              </div>

              <div className="space-y-4">
                <InfoRow
                  label="Código"
                  value={family.code}
                />

                <InfoRow
                  label="Última atualização"
                  value={formatDateTime(family.updatedAt)}
                />

                <InfoRow
                  label="Família criada"
                  value={formatDateTime(family.createdAt)}
                />

                <InfoRow
                  label="Última resposta"
                  value={
                    pending === 0
                      ? "Todos responderam"
                      : `${pending} pendente${pending > 1 ? "s" : ""}`
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      <AddGuestModal
        open={isAddGuestOpen}
        isLoading={addGuestMutation.isPending}
        onClose={() => {
          if (!addGuestMutation.isPending) {
            setIsAddGuestOpen(false);
          }
        }}
        onSubmit={(name) => {
          addGuestMutation.mutate(name);
        }}
      />

      <EditFamilyModal
        open={isEditFamilyOpen}
        initialName={family.name}
        isLoading={editFamilyMutation.isPending}
        onClose={() => {
          if (!editFamilyMutation.isPending) {
            setIsEditFamilyOpen(false);
          }
        }}
        onSubmit={(name) => {
          editFamilyMutation.mutate(name);
        }}
      />

      <EditGuestModal
        open={Boolean(editingGuest)}
        guest={editingGuest}
        isLoading={editGuestMutation.isPending}
        onClose={() => {
          if (!editGuestMutation.isPending) {
            setEditingGuest(null);
          }
        }}
        onSubmit={(name, status) => {
          if (!editingGuest) return;

          editGuestMutation.mutate({
            memberId: editingGuest.id,
            name,
            status,
          });
        }}
      />

      <ConfirmDeleteModal
        open={Boolean(deletingGuest)}
        title="Excluir convidado?"
        description={
          deletingGuest
            ? `A pessoa "${deletingGuest.name}" será removida desta família. Essa ação não pode ser desfeita.`
            : ""
        }
        isLoading={deleteGuestMutation.isPending}
        onClose={() => {
          if (!deleteGuestMutation.isPending) {
            setDeletingGuest(null);
          }
        }}
        onConfirm={() => {
          if (!deletingGuest) return;

          deleteGuestMutation.mutate(
            deletingGuest.id,
          );
        }}
      />

      <ConfirmDeleteModal
        open={isDeleteFamilyOpen}
        title="Excluir família?"
        description={
          family
            ? `A família "${family.name}" e todos os convidados vinculados a ela serão removidos. Essa ação não pode ser desfeita.`
            : ""
        }
        isLoading={deleteFamilyMutation.isPending}
        onClose={() => {
          if (!deleteFamilyMutation.isPending) {
            setIsDeleteFamilyOpen(false);
          }
        }}
        onConfirm={() => {
          deleteFamilyMutation.mutate();
        }}
      />
    </AdminShell>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-[22px] border border-[#2c2925]/7 bg-white/45 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            accent
              ? "bg-[#6e4c12]/10 text-[#6e4c12]"
              : "bg-[#2c2925]/5 text-[#2c2925]/40"
          }`}
        >
          {icon}
        </div>

        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#2c2925]/30">
          RSVP
        </span>
      </div>

      <p className="mt-5 font-serif text-3xl leading-none tracking-[-0.04em] text-[#2c2925]">
        {value}
      </p>

      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#2c2925]/35">
        {label}
      </p>
    </motion.div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#2c2925]/6 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] font-medium uppercase tracking-widest text-[#2c2925]/35">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-[#2c2925]/70">
        {value}
      </span>
    </div>
  );
}
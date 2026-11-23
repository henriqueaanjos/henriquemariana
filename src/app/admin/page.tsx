"use client";

import {
  ArrowRight,
  Baby,
  Camera,
  Check,
  Clock,
  EnvelopeSimple,
  Heart,
  Images,
  MusicNotes,
  TrendUp,
  UsersThree,
} from "@phosphor-icons/react";

import { motion } from "motion/react";
import Link from "next/link";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboard,
  type AdminDashboardData,
} from "@/src/services/admin-dashboard";

type Stat = {
  label: string;
  value: number;
  detail: string;
  icon: typeof UsersThree;
  href: string;
};

function SectionHeading({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#6e4c12]">
          {eyebrow}
        </p>

         <h2 className="font-serif text-xl break-words tracking-[-0.035em] text-[#2c2925] sm:text-2xl">
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="group flex items-center shrink-0 gap-1.5 text-[11px] font-medium text-[#2c2925]/45 transition-colors hover:text-[#6e4c12]"
        >
          Ver todos
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: Stat;
  index: number;
}) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={stat.href} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-[#2c2925]/7 bg-white/45 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-[0_16px_40px_rgba(44,41,37,0.06)]">
          <div className="flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6e4c12]/8 text-[#6e4c12]">
              <Icon size={17} weight="duotone" />
            </div>

            <ArrowRight
              size={16}
              className="text-[#2c2925]/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#6e4c12]"
            />
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
              {stat.label}
            </p>

            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="font-serif text-4xl leading-none tracking-[-0.045em] text-[#2c2925]">
                {stat.value}
              </p>

              <p className="pb-0.5 text-[10px] text-[#2c2925]/40">
                {stat.detail}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AdminPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<AdminDashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,

    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30_000,
  });

  function formatRelativeDate(date: string) {
    const diff = Date.now() - new Date(date).getTime();

    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 1) return "agora";
    if (minutes < 60) return `há ${minutes} min`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `há ${hours} h`;

    const days = Math.floor(hours / 24);

    if (days === 1) return "ontem";

    return `há ${days} dias`;
  }

  const stats = [
    {
      label: "Convidados",
      value: data?.stats.guests ?? 0,
      detail: `${data?.stats.families ?? 0} famílias`,
      icon: UsersThree,
      href: "/admin/rsvp",
    },
    {
      label: "Crianças",
      value: data?.stats.children ?? 0,
      detail: `${data?.stats.childrenUnder4 ?? 0} com < 4 anos`,
      icon: Baby,
      href: "/admin/rsvp",
    },
    {
      label: "Confirmados",
      value: data?.stats.confirmed ?? 0,
      detail: `${data?.stats.guests
        ? ((data.stats.confirmed / data.stats.guests) * 100).toFixed(1).replace(".", ",")
        : "0"}% da lista`,
      icon: Check,
      href: "/admin/rsvp",
    },
    {
      label: "Fotos",
      value: data?.stats.photos ?? 0,
      detail: "na galeria",
      icon: Camera,
      href: "/admin/photos",
    },
    {
      label: "Recados",
      value: data?.stats.messages ?? 0,
      detail: "recebidos",
      icon: EnvelopeSimple,
      href: "/admin/messages",
    },
  ];

  const rsvpPercentage = data?.rsvp.total
    ? (data.rsvp.confirmed / data.rsvp.total) * 100
    : 0;

  const photos = data?.recent.photos ?? [];
  const playlist = data?.recent.songs ?? [];
  const messages = data?.recent.messages ?? [];


  const activities = [
    ...messages.slice(0, 5).map((message) => ({
      createdAt: message.createdAt,
      time: formatRelativeDate(message.createdAt),
      title: "Novo recado recebido",
      description: message.message,
    })),

    ...photos.slice(0, 5).map((photo) => ({
      createdAt: photo.createdAt,
      time: formatRelativeDate(photo.createdAt),
      title: "Nova foto adicionada",
      description: `${photo.userName} adicionou uma nova foto`,
    })),

    ...playlist.slice(0, 5).map((song) => ({
      createdAt: song.createdAt,
      time: formatRelativeDate(song.createdAt),
      title: "Nova música na playlist",
      description: `${song.title} · ${song.artist}`,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const weddingDate = new Date("2027-01-09T00:00:00");

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (weddingDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
    ),
  );

  if (isError) {
    return (
      <AdminShell>
        <AdminPageHeader
          eyebrow="Visão geral"
          title="Olá, Mariana & Henrique."
          description="Tudo que vocês precisam acompanhar para manter o grande dia organizado."
        />

        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#2c2925]/7 bg-white/45 p-10 text-center">
          <p className="font-serif text-xl text-[#2c2925]">
            Não foi possível carregar o painel.
          </p>

          <p className="max-w-sm text-xs text-[#2c2925]/45">
            Verifique sua conexão e tente novamente.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-[#2c2925] px-5 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </AdminShell>
    );
  }

  if (isLoading) {
    return (
      <AdminShell>
        <AdminPageHeader
          eyebrow="Visão geral"
          title="Olá, Mariana & Henrique."
          description="Tudo que vocês precisam acompanhar para manter o grande dia organizado."
        />

        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-[28px] bg-[#2c2925]/5" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-[#2c2925]/5"
              />
            ))}
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Visão geral"
        title="Olá, Mariana & Henrique."
        description="Tudo que você precisa acompanhar para manter o grande dia de vocês organizado."
      />

      {/* Hero */}
      <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#2c2925] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9b982]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45">
                O grande dia
              </span>
            </div>

            <p className="font-serif text-5xl tracking-tighter sm:text-7xl">
              {daysRemaining}
            </p>

            <p className="mt-2 text-sm text-white/45">
              dias para o casamento
            </p>
          </div>

          <div className="sm:text-right">
            <p className="font-serif text-3xl tracking-[-0.04em] text-[#d9b982] sm:text-4xl">
              09 · 01 · 2027
            </p>

            <p className="mt-2 text-[11px] text-white/40">
              Mariana & Henrique
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5 mb-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      {/* RSVP + Activity */}
      <section className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        {/* RSVP */}
        <div className="rounded-3xl border border-[#2c2925]/7 bg-white/45 p-6 sm:p-7">
          <SectionHeading
            eyebrow="Convidados"
            title="Confirmações"
            href="/admin/rsvp"
          />

          <div className="grid gap-8 sm:grid-cols-[180px_1fr] sm:items-center lg:grid-cols-1 lg:items-start xl:grid-cols-[180px_1fr] xl:items-center">
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 160 160"
              >
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-[#2c2925]/7"
                />

                <motion.circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={427}
                  initial={{ strokeDashoffset: 427 }}
                  animate={{
                    strokeDashoffset: 427 - (427 * rsvpPercentage) / 100,
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-[#6e4c12]"
                />
              </svg>

              <div className="relative text-center">
                <p className="font-serif text-3xl tracking-[-0.04em]">
                  {rsvpPercentage.toFixed(1).replace(".", ",")}%
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#2c2925]/35">
                  confirmados
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-[#2c2925]/55">
                    Confirmados
                  </span>

                  <span className="text-xs font-medium">
                    {data?.rsvp.confirmed ?? 0}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[#2c2925]/7">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rsvpPercentage}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-[#6e4c12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#2c2925]/[0.035] p-4">
                  <p className="text-2xl font-serif tracking-[-0.03em]">
                    {data?.rsvp.pending ?? 0}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#2c2925]/35">
                    Pendentes
                  </p>
                </div>

                <div className="rounded-xl bg-[#2c2925]/[0.035] p-4">
                  <p className="text-2xl font-serif tracking-[-0.03em]">
                    {data?.rsvp.declined ?? 0}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#2c2925]/35">
                    Recusados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-3xl border border-[#2c2925]/7 bg-white/45 p-6 sm:p-7">
          <SectionHeading eyebrow="Agora" title="Atividade recente" />

          <div className="divide-y divide-[#2c2925]/7">
            {activities.map((activity) => (
              <div
                key={`${activity.time}-${activity.title}-${activity.createdAt}`}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="w-10 shrink-0 pt-0.5 text-[10px] font-medium text-[#2c2925]/30">
                  {activity.time}
                </span>

                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#2c2925]">
                    {activity.title}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-[#2c2925]/40">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photos + Playlist */}
      <section className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        {/* Photos */}
        <div className="rounded-3xl border border-[#2c2925]/7 bg-white/45 p-6 sm:p-7">
          <SectionHeading
            eyebrow="Galeria"
            title="Fotos recentes"
            href="/admin/photos"
          />

         {photos.length === 0 ? (
            <div className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#2c2925]/10 text-[#2c2925]/35">
              <Camera size={28} />
              <p className="font-lora text-xs">Nenhuma foto enviada ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.slice(0, 3).map((photo, index) => (
                <div
                  key={photo.id}
                  className={[
                    "group relative overflow-hidden rounded-2xl bg-[#2c2925]/5",
                    index === 0
                      ? "col-span-2 aspect-video sm:col-span-1 sm:aspect-4/3"
                      : "aspect-square sm:aspect-4/3",
                  ].join(" ")}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-[#2c2925]/40">
              {data?.stats.photos ?? 0} fotos na galeria
            </p>

            <Link
              href="/admin/photos"
              className="flex items-center gap-1 text-[11px] font-medium text-[#6e4c12]"
            >
              Gerenciar
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Playlist */}
        <div className="rounded-3xl border border-[#2c2925]/7 bg-white/45 p-6 sm:p-7">
          <SectionHeading
            eyebrow="Música"
            title="Nossa playlist"
            href="/admin/playlist"
          />

          <div className="mb-5 flex items-center gap-4 rounded-2xl bg-[#2c2925] p-4 text-white">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d9b982]/15 text-[#d9b982]">
              <MusicNotes size={20} weight="duotone" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {data?.stats.songs ?? 0} músicas
              </p>

              <p className="mt-1 text-[10px] text-white/40">
                Playlist do casamento
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {playlist.slice(0, 3).map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#2c2925]/[0.035]"
              >
                <span className="w-4 text-center text-[9px] text-[#2c2925]/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium">
                    {song.title}
                  </p>

                  <p className="truncate text-[9px] text-[#2c2925]/35">
                    {song.artist}
                  </p>
                </div>

                <MusicNotes
                  size={14}
                  className="text-[#2c2925]/20 transition-colors group-hover:text-[#6e4c12]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Messages + Milestone */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* Milestone */}
        <div className="relative overflow-hidden rounded-3xl bg-[#d9b982] p-7 sm:p-8">
          <Heart
            size={170}
            weight="thin"
            className="absolute -bottom-14 -right-12 text-[#6e4c12]/10"
          />

          <div className="relative">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#6e4c12]/60">
              Próximo marco
            </p>

            <p className="mt-8 font-serif text-5xl tracking-tighter text-[#2c2925]">
              09
            </p>

            <p className="font-serif text-2xl tracking-[-0.03em] text-[#2c2925]/75">
              Janeiro · 2027
            </p>

            <div className="mt-7 flex items-center gap-2 text-[10px] text-[#2c2925]/50">
              <Clock size={14} />

              <span>O grande dia está chegando</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-3xl border border-[#2c2925]/7 bg-white/45 p-6 sm:p-7">
          <SectionHeading
            eyebrow="Carinho"
            title="Últimos recados"
            href="/admin/messages"
          />

          <div className="divide-y divide-[#2c2925]/7">
            {messages.slice(0, 3).map((message) => (
              <div
                key={message.id}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6e4c12]/8 text-[10px] font-semibold text-[#6e4c12]">
                  {message.name
                    .split(" ")
                    .slice(0, 2)
                    .map((name) => name[0])
                    .join("")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium">
                      {message.name}
                    </p>

                    <span className="shrink-0 text-[9px] text-[#2c2925]/30">
                      {formatRelativeDate(message.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[10px] text-[#2c2925]/45">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
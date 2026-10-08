"use client";

import {
  Check,
  Clock,
  MagnifyingGlass,
  Plus,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminPageHeader } from "@/src/components/admin/AdminPageHeader";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { RSVPFamilyCard } from "@/src/components/admin/RSVPFamilyCard";
import { CreateFamilyModal } from "@/src/components/admin/CreateFamilyModal";

import {
  createAdminFamily,
  getAdminRSVPFamilies,
  type AdminRSVPFamily,
} from "@/src/services/admin-rsvp";

const filters = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "confirmed",
    label: "Confirmados",
  },
  {
    id: "pending",
    label: "Pendentes",
  },
  {
    id: "declined",
    label: "Recusados",
  },
];

function getFamilyStatus(family: AdminRSVPFamily) {
  const confirmed = family.guests.filter(
    (guest) => guest.status === "confirmed",
  ).length;

  if (confirmed === family.guests.length) {
    return "confirmed";
  }

  if (
    family.guests.length > 0 &&
    family.guests.every((guest) => guest.status === "declined")
  ) {
    return "declined";
  }

  return "pending";
}

function RSVPStat({
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

      <p
        className={`font-serif text-3xl tracking-[-0.04em] ${
          highlight ? "text-[#2c2925]" : "text-[#2c2925]"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 truncate text-[11px] text-[#2c2925]/35">
        {detail}
      </p>
    </div>
  );
}

export default function RSVPPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isCreateFamilyOpen, setIsCreateFamilyOpen] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: families = [],
    isLoading,
    isError,
  } = useQuery<AdminRSVPFamily[]>({
    queryKey: ["admin-rsvp-families"],
    queryFn: getAdminRSVPFamilies,
  });

  const createFamilyMutation = useMutation({
    mutationFn: createAdminFamily,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-rsvp-families"],
      });

      setIsCreateFamilyOpen(false);
    },
  });

  const filteredFamilies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return families.filter((family) => {
      const matchesSearch =
        !normalizedSearch ||
        family.name.toLowerCase().includes(normalizedSearch) ||
        family.code.toLowerCase().includes(normalizedSearch) ||
        family.guests.some((guest) =>
          guest.name.toLowerCase().includes(normalizedSearch),
        );

      const status = getFamilyStatus(family);

      const matchesFilter =
        activeFilter === "all" || status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [families, search, activeFilter]);

  const totalGuests = families.reduce(
    (total, family) => total + family.guests.length,
    0,
  );

  const confirmedGuests = families.reduce(
    (total, family) =>
      total +
      family.guests.filter(
        (guest) => guest.status === "confirmed",
      ).length,
    0,
  );

  const pendingGuests = families.reduce(
    (total, family) =>
      total +
      family.guests.filter(
        (guest) => guest.status === "pending",
      ).length,
    0,
  );

  const declinedGuests = families.reduce(
    (total, family) =>
      total +
      family.guests.filter(
        (guest) => guest.status === "declined",
      ).length,
    0,
  );

  if (isLoading) {
    return (
      <AdminShell>
        <AdminPageHeader
          eyebrow="RSVP"
          title="Convidados"
          description="Acompanhe as confirmações e organize as famílias convidadas."
          action={{
            label: "Adicionar família",
            onClick: () => setIsCreateFamilyOpen(true),
          }}
        />

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-34 animate-pulse rounded-[22px] border border-[#2c2925]/7 bg-white/45"
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="h-11 w-full max-w-md animate-pulse rounded-full bg-[#2c2925]/5" />

            <div className="h-11 w-full max-w-90 animate-pulse rounded-full bg-[#2c2925]/5" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[22px] bg-[#2c2925]/5"
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
        eyebrow="RSVP"
        title="Convidados"
        description="Acompanhe as confirmações e organize as famílias convidadas."
        action={{
          label: "Adicionar família",
          onClick: () => setIsCreateFamilyOpen(true),
        }}
      />

      {/* Stats */}
      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <RSVPStat
          icon={<UsersThree size={19} />}
          label="Convidados"
          value={totalGuests}
          detail="convidados cadastrados"
          highlight
        />

        <RSVPStat
          icon={<Check size={19} weight="bold" />}
          label="Confirmados"
          value={confirmedGuests}
          detail="presenças confirmadas"
        />

        <RSVPStat
          icon={<Clock size={19} />}
          label="Pendentes"
          value={pendingGuests}
          detail="aguardando confirmação"
        />

        <RSVPStat
          icon={<X size={19} weight="bold" />}
          label="Recusados"
          value={declinedGuests}
          detail="presenças recusadas"
        />
      </section>

      {/* Toolbar */}
      <section className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative w-full flex-1">
            <MagnifyingGlass
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2c2925]/35"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou família..."
              className="h-11 w-full rounded-full border border-[#2c2925]/8 bg-white/65 pl-11 pr-10 text-sm text-[#2c2925] outline-none transition placeholder:text-[#2c2925]/30 focus:border-[#6e4c12]/30 focus:bg-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#2c2925]/30 transition hover:bg-[#2c2925]/5 hover:text-[#2c2925]/50"
                aria-label="Limpar busca"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-[#2c2925]/8 bg-white/55 p-1">
            {filters.map((filter) => {
              const active = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className="relative shrink-0 rounded-full px-4 py-2 text-[10px] font-medium"
                >
                  {active && (
                    <motion.div
                      layoutId="rsvp-filter"
                      className="absolute inset-0 rounded-full bg-[#2c2925]"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  <span
                    className={[
                      "relative z-10 transition-colors",
                      active
                        ? "text-white"
                        : "text-[#2c2925]/45",
                    ].join(" ")}
                  >
                    {filter.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#2c2925]/30">
            {filteredFamilies.length}{" "}
            {filteredFamilies.length === 1
              ? "família encontrada"
              : "famílias encontradas"}
          </p>

          <p className="hidden text-[10px] text-[#2c2925]/30 sm:block">
            Organizado por confirmação
          </p>
        </div>

        {isError ? (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-[28px] border border-dashed border-[#2c2925]/10 bg-white/20 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9a625c]/8">
              <X
                size={20}
                weight="bold"
                className="text-[#9a625c]"
              />
            </div>

            <h3 className="mt-4 font-serif text-xl tracking-[-0.03em] text-[#2c2925]">
              Não foi possível carregar os convidados
            </h3>

            <p className="mt-2 max-w-sm text-[11px] leading-5 text-[#2c2925]/40">
              Houve um problema ao buscar os dados. Tente
              novamente em alguns instantes.
            </p>
          </div>
        ) : filteredFamilies.length > 0 ? (
          <motion.div
            layout
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredFamilies.map((family) => (
              <RSVPFamilyCard
                key={family.id}
                family={family}
                onOpen={(family) =>
                  router.push(`/admin/rsvp/${family.id}`)
                }
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-[28px] border border-dashed border-[#2c2925]/10 bg-white/20 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2925]/5">
              <UsersThree
                size={20}
                className="text-[#2c2925]/30"
              />
            </div>

            <h3 className="mt-4 font-serif text-xl tracking-[-0.03em] text-[#2c2925]">
              Nenhuma família encontrada
            </h3>

            <p className="mt-2 max-w-xs text-[11px] leading-5 text-[#2c2925]/40">
              Tente alterar sua busca ou selecionar outro
              filtro.
            </p>

            {(search || activeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-5 text-[10px] font-medium text-[#6e4c12] transition-opacity hover:opacity-70"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </section>

      <CreateFamilyModal
        open={isCreateFamilyOpen}
        isLoading={createFamilyMutation.isPending}
        onClose={() => {
          if (!createFamilyMutation.isPending) {
            setIsCreateFamilyOpen(false);
          }
        }}
        onSubmit={(name) => {
          createFamilyMutation.mutate(name);
        }}
      />
    </AdminShell>
  );
}
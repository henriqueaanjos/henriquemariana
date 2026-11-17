"use client";

import {
  Baby,
  Check,
  Clock,
  MagnifyingGlass,
  Person,
  Plus,
  UsersThree,
  FilePdfIcon,
  X,
} from "@phosphor-icons/react";

import jsPDF from "jspdf";
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

      <p
        className={`font-serif text-3xl tracking-[-0.04em] ${highlight ? "text-[#2c2925]" : "text-[#2c2925]"
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

  const checkedInGuests = families.reduce(
    (total, family) =>
      total +
      family.guests.filter(
        (guest) =>
          guest.status === "confirmed" && Boolean(guest.checkedInAt),
      ).length,
    0,
  );

   const childrenUnder4 = families.reduce(
    (total, family) =>
      total +
      family.guests.filter(
        (guest) => guest.ageGroup === "CHILD_UNDER_4",
      ).length,
    0,
  );

  const children4To7 = families.reduce(
    (total, family) =>
      total +
      family.guests.filter(
        (guest) => guest.ageGroup === "CHILD_4_7",
      ).length,
    0,
  );


  const handleExportPDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 8;
    const contentWidth = pageWidth - margin * 2;
    const footerHeight = 8;
    const bottomLimit = pageHeight - margin - footerHeight;

    let y = 10;

    const formatStatus = (
      guest: AdminRSVPFamily["guests"][number],
    ) => {
      if (guest.status === "declined") return "Nao confirmado";
      if (guest.status === "pending") return "Pendente";
      if (guest.checkedInAt) return "Entrada registrada";

      return "Confirmado";
    };

    const formatCheckInDate = (date: string) =>
      new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

    const addPage = () => {
      pdf.addPage();
      y = 10;
    };

    const checkPageBreak = (requiredSpace: number) => {
      if (y + requiredSpace > bottomLimit) {
        addPage();
        return true;
      }

      return false;
    };

    // Cabeçalho compacto
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(44, 41, 37);
    pdf.text("Relatorio de convidados", margin, y);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(120);

    pdf.text(
      `Mariana & Henrique | ${new Date().toLocaleString("pt-BR")}`,
      pageWidth - margin,
      y,
      { align: "right" },
    );

    y += 6;

    // Resumo em uma única linha
    pdf.setFillColor(245, 242, 236);
    pdf.roundedRect(margin, y - 3.5, contentWidth, 8, 1, 1, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(55, 51, 45);

    pdf.text(
      `Familias: ${families.length}    Convidados: ${totalGuests}    Confirmados: ${confirmedGuests}    Criancas <4: ${childrenUnder4}    Criancas 4-7: ${children4To7}    Entradas: ${checkedInGuests}`,
      margin + 3,
      y + 1.5,
    );

    y += 9;

    // Cabeçalho das colunas
    const drawTableHeader = () => {
      pdf.setFillColor(235, 232, 226);
      pdf.rect(margin, y - 3, contentWidth, 6, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(80, 75, 68);

      pdf.text("CONVIDADO / FAMILIA", margin + 2, y + 0.8);
      pdf.text("STATUS", pageWidth - margin - 48, y + 0.8);
      pdf.text("ENTRADA", pageWidth - margin - 2, y + 0.8, {
        align: "right",
      });

      y += 6;
    };

    drawTableHeader();

    families.forEach((family) => {
      const familyLabel =
        family.guests.length === 1
          ? family.name
          : `Familia ${family.name}`;

      // Verifica espaço para o título da família
      checkPageBreak(7);

      // Identificação discreta da família
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 75, 40);

      pdf.text(familyLabel, margin + 2, y + 1);

      y += 4;

      family.guests.forEach((guest) => {
        const status = formatStatus(guest);
        const checkInDate = guest.checkedInAt
          ? formatCheckInDate(guest.checkedInAt)
          : "—";

        const guestName = pdf.splitTextToSize(
          guest.name,
          contentWidth - 85,
        );

        const rowHeight = Math.max(5, guestName.length * 3.5 + 1);

        checkPageBreak(rowHeight + 1);

        // Linha do convidado
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(65, 65, 65);

        pdf.text(guestName, margin + 4, y + 2);

        pdf.setFontSize(7);
        pdf.text(status, pageWidth - margin - 48, y + 2);

        pdf.text(checkInDate, pageWidth - margin - 2, y + 2, {
          align: "right",
        });

        // Divisor sutil
        pdf.setDrawColor(235, 232, 226);
        pdf.setLineWidth(0.15);
        pdf.line(margin + 2, y + rowHeight, pageWidth - margin - 2, y + rowHeight);

        y += rowHeight;
      });

      y += 1;
    });

    // Rodapé com paginação
    const totalPages = pdf.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      pdf.setPage(page);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(150);

      pdf.text(
        `Mariana & Henrique | Pagina ${page} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 4,
        { align: "center" },
      );
    }

    pdf.save(
      `Relatorio-RSVP-${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  };


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
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, index) => (
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
      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
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
        <RSVPStat
          icon={<Check size={19} weight="bold" />}
          label="Entradas"
          value={checkedInGuests}
          detail="entradas registradas"
        />
         <RSVPStat
          icon={<Baby size={19} />}
          label="Crianças < 4"
          value={childrenUnder4}
          detail="menos de 4 anos"
        />

        <RSVPStat
          icon={<Person size={19} />}
          label="Crianças 4–7"
          value={children4To7}
          detail="entre 4 e 7 anos"
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
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={families.length === 0}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#d9b982]/40 bg-[#d9b982]/10 px-5 text-[10px] font-semibold text-[#6e4c12] transition hover:bg-[#d9b982]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FilePdfIcon size={16} />
          Exportar PDF
        </button>
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
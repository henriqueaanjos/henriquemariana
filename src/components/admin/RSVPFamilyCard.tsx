
"use client";

import {
  ArrowRight,
  Check,
  Copy,
  DotsThree,
  UsersThree,
  Clock,
} from "@phosphor-icons/react";
import { motion } from "motion/react";

import {
  getAgeGroupLabel,
  type AgeGroup,
} from "@/src/libs/age-group";

export type RSVPGuestStatus =
  | "confirmed"
  | "pending"
  | "declined";

export interface RSVPGuest {
  id: string;
  name: string;
  status: RSVPGuestStatus;
   ageGroup: AgeGroup;
  checkedInAt: string | null;
}

export interface RSVPFamily {
  id: string;
  name: string;
  code: string;
  guests: RSVPGuest[];
}

interface FamilyCardProps {
  family: RSVPFamily;
  onOpen?: (family: RSVPFamily) => void;
}

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    className: "text-[#5c765b]",
    dotClassName: "bg-[#5c765b]",
  },
  pending: {
    label: "Pendente",
    className: "text-[#9a7945]",
    dotClassName: "bg-[#9a7945]",
  },
  declined: {
    label: "Recusado",
    className: "text-[#9a625c]",
    dotClassName: "bg-[#9a625c]",
  },
  checkedIn: {
    label: "Entrada registrada",
    className: "text-[#477b75]",
    dotClassName: "bg-[#477b75]",
  },
};

function formatCheckInDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data indisponível";
  }

  return parsedDate.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RSVPFamilyCard({
  family,
  onOpen,
}: FamilyCardProps) {
  const confirmed = family.guests.filter(
    (guest) => guest.status === "confirmed",
  ).length;

  const checkedIn = family.guests.filter(
    (guest) =>
      guest.status === "confirmed" && Boolean(guest.checkedInAt),
  ).length;

  const total = family.guests.length;

  const familyStatus =
    total > 0 && confirmed === total
      ? "confirmed"
      : confirmed > 0
        ? "pending"
        : total > 0 && family.guests.every(
              (guest) => guest.status === "declined",
            )
          ? "declined"
          : "pending";

  const status = statusConfig[familyStatus];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(family.code);
    } catch {
      // Clipboard pode não estar disponível em alguns ambientes.
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group cursor-pointer rounded-[22px] border border-[#2c2925]/7 bg-white/45 p-5 transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(44,41,37,0.06)] sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-serif text-[22px] tracking-[-0.035em] text-[#2c2925]">
              {family.name}
            </h3>

            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                familyStatus === "confirmed"
                  ? "bg-[#5c765b]/10"
                  : familyStatus === "declined"
                    ? "bg-[#9a625c]/10"
                    : "bg-[#9a7945]/10"
              }`}
            >
              {familyStatus === "confirmed" ? (
                <Check
                  size={11}
                  weight="bold"
                  className={status.className}
                />
              ) : (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                />
              )}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#2c2925]/40">
            <UsersThree size={13} />

            <span>
              {total} {total === 1 ? "convidado" : "convidados"}
            </span>

            <span className="text-[#2c2925]/15">·</span>

            <span>{confirmed} confirmados</span>

            {checkedIn > 0 && (
              <>
                <span className="text-[#2c2925]/15">·</span>
                <span className="text-[#477b75]">
                  {checkedIn} entradas registradas
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={`Mais opções para ${family.name}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#2c2925]/25 transition-colors hover:bg-[#2c2925]/5 hover:text-[#2c2925]/60"
        >
          <DotsThree size={18} />
        </button>
      </div>

      {/* Guests */}
      <div className="mt-5 divide-y divide-[#2c2925]/6 rounded-xl bg-[#2c2925]/2.5 px-3">
        {family.guests.map((guest) => {
          const guestStatus =
            guest.status === "confirmed" && guest.checkedInAt
              ? statusConfig.checkedIn
              : statusConfig[guest.status];

          return (
            <div
              key={guest.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-medium text-[#2c2925]/50 shadow-sm">
                  {guest.name
                    .split(" ")
                    .slice(0, 2)
                    .map((name) => name[0])
                    .join("")}
                </span>

                <div className="flex min-w-0 flex-col">
                   <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-[11px] font-medium text-[#2c2925]/75">
                      {guest.name}
                    </span>

                    {guest.ageGroup !== "ADULT" && (
                      <span className="shrink-0 rounded-full bg-[#6e4c12]/8 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#6e4c12]">
                        {getAgeGroupLabel(
                          guest.ageGroup,
                          true,
                        )}
                      </span>
                    )}
                  </div>

                  {guest.status === "confirmed" &&
                    guest.checkedInAt && (
                      <span className="mt-1 flex items-center gap-1 text-[9px] text-[#477b75]/75">
                        <Clock size={10} />
                        {formatCheckInDate(guest.checkedInAt)}
                      </span>
                    )}
                </div>
              </div>

              <span
                className={`flex shrink-0 items-center gap-1.5 text-[9px] font-medium ${guestStatus.className}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${guestStatus.dotClassName}`}
                />

                {guestStatus.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#2c2925]/7 pt-4">
        <button
          type="button"
          onClick={handleCopyCode}
          className="group/code flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#2c2925]/35 transition-colors hover:text-[#6e4c12]"
        >
          <span>Código {family.code}</span>

          <Copy
            size={12}
            className="transition-transform group-hover/code:scale-110"
          />
        </button>

        <button
          type="button"
          onClick={() => onOpen?.(family)}
          className="group/open flex items-center gap-1.5 text-[10px] font-medium text-[#2c2925]/45 transition-colors hover:text-[#6e4c12]"
        >
          Ver grupo

          <ArrowRight
            size={13}
            className="transition-transform group-hover/open:translate-x-0.5"
          />
        </button>
      </div>
    </motion.article>
  );
}

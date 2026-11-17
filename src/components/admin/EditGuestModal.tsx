
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Clock,
  X,
  XCircle,
} from "@phosphor-icons/react";

import {
  AGE_GROUP_OPTIONS,
  type AgeGroup,
} from "@/src/libs/age-group";

import type {
  AdminRSVPFamilyGuest,
  RSVPGuestStatus,
} from "@/src/services/admin-rsvp-family";

interface EditGuestModalProps {
  open: boolean;
  guest: AdminRSVPFamilyGuest | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    status: RSVPGuestStatus,
    phone: string,
    ageGroup: AgeGroup,
  ) => void;
}

const statusOptions: {
  value: RSVPGuestStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
    {
      value: "confirmed",
      label: "Confirmado",
      description: "Presença confirmada",
      icon: <Check size={18} weight="bold" />,
    },
    {
      value: "pending",
      label: "Pendente",
      description: "Ainda não respondeu",
      icon: <Clock size={18} weight="bold" />,
    },
    {
      value: "declined",
      label: "Recusado",
      description: "Não poderá comparecer",
      icon: <XCircle size={18} weight="bold" />,
    },
  ];

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 2) {
    return numbers.length ? `(${numbers}` : "";
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

export function EditGuestModal({
  open,
  guest,
  isLoading = false,
  onClose,
  onSubmit,
}: EditGuestModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] =
    useState<RSVPGuestStatus>("pending");
  const [ageGroup, setAgeGroup] =
    useState<AgeGroup>("ADULT");

  useEffect(() => {
    if (!guest) return;

    setName(guest.name);
    setPhone(formatPhone(guest.phone ?? ""));
    setStatus(guest.status);
    setAgeGroup(guest.ageGroup);
  }, [guest]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName || isLoading) return;

    onSubmit(
      normalizedName,
      status,
      phone.replace(/\D/g, ""),
      ageGroup,
    );
  }

  return (
    <AnimatePresence>
      {open && guest && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[3px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              role="dialog"
              aria-modal="true"
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-black/6 bg-[#FCFBF8] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-black/6 px-6 py-5">
                <div>
                  <h2 className="text-[17px] font-medium tracking-[-0.02em] text-[#292722]">
                    Editar convidado
                  </h2>

                  <p className="mt-1 text-[13px] text-[#8A867D]">
                    Atualize os dados e o RSVP.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  aria-label="Fechar"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#8A867D] transition hover:bg-black/4 hover:text-[#292722] disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6"
              >
                <div>
                  <label
                    htmlFor="guest-name"
                    className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A867D]"
                  >
                    Nome
                  </label>

                  <input
                    id="guest-name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    autoFocus
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl border border-black/8 bg-white px-4 text-[14px] text-[#292722] outline-none transition placeholder:text-[#B0ACA3] focus:border-[#9B8055]/50 focus:ring-2 focus:ring-[#9B8055]/10 disabled:opacity-60"
                    placeholder="Nome do convidado"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-guest-phone"
                    className="mb-2 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A867D]"
                  >
                    WhatsApp
                    <span className="ml-1 font-normal normal-case tracking-normal text-[#A6A197]">
                      (opcional)
                    </span>
                  </label>

                  <input
                    id="edit-guest-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(event) =>
                      setPhone(formatPhone(event.target.value))
                    }
                    placeholder="(67) 99999-9999"
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl border border-black/8 bg-white px-4 text-[14px] text-[#292722] outline-none transition placeholder:text-[#B0ACA3] focus:border-[#9B8055]/50 focus:ring-2 focus:ring-[#9B8055]/10 disabled:opacity-60"
                  />

                  <p className="mt-2 text-[11px] text-[#9A968D]">
                    Deixe vazio caso não tenha o contato.
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A867D]">
                    Status do RSVP
                  </label>

                  <div className="space-y-2">
                    {statusOptions.map((option) => {
                      const selected =
                        status === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            setStatus(option.value)
                          }
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected
                            ? "border-[#9B8055]/40 bg-[#9B8055]/[0.07]"
                            : "border-black/6 bg-white hover:border-black/12 hover:bg-black/1.5"
                            } disabled:opacity-60`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected
                              ? "bg-[#9B8055]/10 text-[#80663E]"
                              : "bg-black/[0.035] text-[#8A867D]"
                              }`}
                          >
                            {option.icon}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-medium text-[#292722]">
                              {option.label}
                            </span>

                            <span className="mt-0.5 block text-[12px] text-[#9A968D]">
                              {option.description}
                            </span>
                          </span>

                          {selected && (
                            <Check
                              size={17}
                              weight="bold"
                              className="text-[#80663E]"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A867D]">
                    Classificação por idade
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {AGE_GROUP_OPTIONS.map((option) => {
                      const selected =
                        ageGroup === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            setAgeGroup(option.value)
                          }
                          className={`rounded-xl border px-2 py-3 text-center text-[12px] font-medium leading-tight transition ${selected
                              ? "border-[#9B8055]/40 bg-[#9B8055]/[0.07] text-[#80663E]"
                              : "border-black/6 bg-white text-[#77736B] hover:border-black/12"
                            } disabled:opacity-60`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="h-10 rounded-xl px-4 text-[13px] font-medium text-[#77736B] transition hover:bg-black/4 disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className="h-10 rounded-xl bg-[#292722] px-5 text-[13px] font-medium text-white transition hover:bg-[#1E1D1A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading
                      ? "Salvando..."
                      : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


"use client";

import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface AddGuestModalProps {
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
}

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

export function AddGuestModal({
  open,
  isLoading = false,
  onClose,
  onSubmit,
}: AddGuestModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setPhone("");
    }
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || isLoading) return;

    onSubmit(trimmedName, phone.replace(/\D/g, ""));
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#2c2925]/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-md rounded-[28px] border border-[#2c2925]/8 bg-[#f7f4ef] p-6 shadow-[0_30px_80px_rgba(44,41,37,0.15)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6e4c12]">
                    Convidado
                  </p>

                  <h2 className="mt-2 font-serif text-[28px] tracking-[-0.04em] text-[#2c2925]">
                    Adicionar pessoa
                  </h2>

                  <p className="mt-2 text-[12px] leading-5 text-[#2c2925]/50">
                    Adicione uma nova pessoa a esta família.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  aria-label="Fechar"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#2c2925]/35 transition-colors hover:bg-[#2c2925]/5 hover:text-[#2c2925]/70 disabled:pointer-events-none disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7"
              >
                <div>
                  <label
                    htmlFor="guest-name"
                    className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#2c2925]/45"
                  >
                    Nome completo
                  </label>

                  <input
                    id="guest-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ex.: Mariana Oliveira"
                    autoFocus
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-[#2c2925]/8 bg-white/70 px-4 text-sm text-[#2c2925] outline-none transition-all placeholder:text-[#2c2925]/25 focus:border-[#6e4c12]/30 focus:bg-white focus:ring-4 focus:ring-[#6e4c12]/5 disabled:opacity-50"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="guest-phone"
                    className="mb-2 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#2c2925]/45"
                  >
                    WhatsApp
                    <span className="ml-1 normal-case tracking-normal text-[#2c2925]/35">
                      (opcional)
                    </span>
                  </label>

                  <input
                    id="guest-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(event) =>
                      setPhone(formatPhone(event.target.value))
                    }
                    placeholder="(67) 99999-9999"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-[#2c2925]/8 bg-white/70 px-4 text-sm text-[#2c2925] outline-none transition-all placeholder:text-[#2c2925]/25 focus:border-[#6e4c12]/30 focus:bg-white focus:ring-4 focus:ring-[#6e4c12]/5 disabled:opacity-50"
                  />

                  <p className="mt-2 text-[11px] text-[#2c2925]/40">
                    Informe o número com DDD para enviar o convite individual.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="h-11 rounded-xl px-4 text-[11px] font-medium text-[#2c2925]/50 transition-colors hover:bg-[#2c2925]/5 hover:text-[#2c2925]/80 disabled:opacity-40"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={!name.trim() || isLoading}
                    className="h-11 rounded-xl bg-[#2c2925] px-5 text-[11px] font-medium text-white transition-all hover:bg-[#6e4c12] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isLoading ? "Adicionando..." : "Adicionar pessoa"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

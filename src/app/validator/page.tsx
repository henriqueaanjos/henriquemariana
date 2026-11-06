"use client";

import { useCallback, useState } from "react";
import axios from "axios";

import {
  Camera,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  QrCode,
  User,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";

import { QRScanner } from "@/src/components/validator/QRScanner";
import {
  useCheckInGuest,
  useValidatorFamily,
} from "@/src/hooks/useValidator";

function extractFamilyCode(value: string) {
  const input = value.trim();

  try {
    const url = new URL(input, "https://validator.local");

    const match = url.pathname.match(/^\/rsvp\/([^/]+)\/?$/i);

    if (match) {
      return decodeURIComponent(match[1]).toUpperCase();
    }
  } catch {
    // Continua para validar como código simples.
  }

  if (/^[A-Z0-9]{4,20}$/i.test(input)) {
    return input.toUpperCase();
  }

  return null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ValidatorPage() {
  const [code, setCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const familyQuery = useValidatorFamily(code);
  const checkInMutation = useCheckInGuest(code);

  const family = familyQuery.data;

  const confirmedGuests =
    family?.members.filter(
      (member) => member.status === "CONFIRMED",
    ) ?? [];

  const checkedInGuests =
    confirmedGuests.filter(
      (member) => Boolean(member.checkedInAt),
    );

  const handleCodeDetected = useCallback((value: string) => {
    const familyCode = extractFamilyCode(value);

    setScannerOpen(false);
    setLocalError("");

    if (!familyCode) {
      setLocalError("QR Code inválido. Verifique o convite.");
      return;
    }

    setManualCode(familyCode);
    setCode(familyCode);
  }, []);

  function handleManualSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const familyCode = extractFamilyCode(manualCode);

    if (!familyCode) {
      setLocalError("Informe um código ou URL de convite válido.");
      return;
    }

    setLocalError("");
    setCode(familyCode);
    setScannerOpen(false);
  }

  async function handleCheckIn(guestId: string) {
    setLocalError("");

    try {
      await checkInMutation.mutateAsync(guestId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLocalError(
          error.response?.data?.error ??
            "Não foi possível registrar a entrada.",
        );
        return;
      }

      setLocalError("Ocorreu um erro ao registrar a entrada.");
    }
  }

  function handleNewScan() {
    setCode("");
    setManualCode("");
    setLocalError("");
    setScannerOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF6E6]">
              <QrCode size={30} className="text-[#6E4C12]" />
            </div>
          </div>

          <h1 className="font-cormorant text-4xl font-medium text-[#6E4C12] sm:text-5xl">
            Validação de Convites
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Controle de entrada dos convidados
          </p>
        </header>

        {/* Scanner */}
        {!family && (
          <section className="rounded-2xl border border-[#E9E2D5] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 text-center">
              <h2 className="font-cormorant text-2xl text-[#6E4C12]">
                Localizar convite
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Escaneie o QR Code ou informe o código da família.
              </p>
            </div>

            {scannerOpen ? (
              <div className="space-y-4">
                <QRScanner onCodeDetected={handleCodeDetected} />

                <button
                  type="button"
                  onClick={() => setScannerOpen(false)}
                  className="w-full rounded-xl border border-neutral-200 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
                >
                  Fechar câmera
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLocalError("");
                  setScannerOpen(true);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#6E4C12] px-5 py-4 text-white transition hover:bg-[#573C0E]"
              >
                <Camera size={23} />
                <span className="font-medium">
                  Abrir câmera
                </span>
              </button>
            )}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs text-neutral-400">OU</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <form onSubmit={handleManualSearch} className="space-y-3">
              <label
                htmlFor="family-code"
                className="block text-sm font-medium text-neutral-700"
              >
                Código ou URL do convite
              </label>

              <input
                id="family-code"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="Ex.: ABCD1234"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D9B982] focus:ring-2 focus:ring-[#D9B982]/20"
              />

              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9B982] py-3 text-sm font-medium text-[#6E4C12] transition hover:bg-[#FFF6E6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MagnifyingGlass size={19} />
                Buscar convite
              </button>
            </form>
          </section>
        )}

        {/* Loading */}
        {familyQuery.isFetching && code && (
          <div className="rounded-2xl border border-[#E9E2D5] bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#D9B982] border-t-transparent" />
            <p className="text-sm text-neutral-500">
              Consultando convite...
            </p>
          </div>
        )}

        {/* Error */}
        {familyQuery.isError && !familyQuery.isFetching && (
          <section className="rounded-2xl border border-red-200 bg-white p-6 text-center">
            <XCircle size={32} className="mx-auto mb-2 text-red-500" />

            <p className="font-medium text-neutral-800">
              Convite não encontrado
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Verifique o código e tente novamente.
            </p>

            <button
              onClick={handleNewScan}
              className="mt-5 rounded-xl bg-[#6E4C12] px-5 py-3 text-sm font-medium text-white"
            >
              Tentar novamente
            </button>
          </section>
        )}

        {/* Family */}
        {family && !familyQuery.isFetching && (
          <section className="space-y-5">

            {/* Family information */}
            <div className="rounded-2xl border border-[#E9E2D5] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-neutral-400">
                    Convite localizado
                  </p>

                  <h2 className="font-cormorant text-3xl text-[#6E4C12]">
                    {family.name}
                  </h2>

                  <p className="mt-1 text-xs text-neutral-400">
                    Código: {family.code}
                  </p>
                </div>

                <div className="rounded-full bg-[#FFF6E6] p-3">
                  <User size={24} className="text-[#6E4C12]" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-500">
                    Confirmados
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-neutral-800">
                    {confirmedGuests.length}
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-500">
                    Entradas registradas
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#6E4C12]">
                    {checkedInGuests.length}
                    <span className="ml-1 text-sm font-normal text-neutral-400">
                      / {confirmedGuests.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="rounded-2xl border border-[#E9E2D5] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-cormorant text-2xl text-[#6E4C12]">
                  Lista de convidados
                </h3>

                <span className="text-xs text-neutral-400">
                  {family.members.length} pessoas
                </span>
              </div>

              <div className="space-y-3">
                {family.members.map((guest) => {
                  const declined = guest.status === "DECLINED";
                  const pending = guest.status === "PENDING";
                  const checkedIn = Boolean(guest.checkedInAt);

                  return (
                    <div
                      key={guest.id}
                      className={`rounded-xl border p-4 transition ${
                        declined
                          ? "border-neutral-100 bg-neutral-50 opacity-45"
                          : "border-[#EEE9E0] bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-800">
                            {guest.name}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            {declined ? (
                              <span className="text-xs text-neutral-400">
                                Recusou o convite
                              </span>
                            ) : pending ? (
                              <span className="text-xs text-amber-600">
                                Aguardando confirmação
                              </span>
                            ) : (
                              <span className="text-xs text-emerald-700">
                                Confirmado
                              </span>
                            )}
                          </div>

                          {checkedIn && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                              <Clock size={14} />
                              Entrada: {formatDate(guest.checkedInAt!)}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0">
                          {checkedIn ? (
                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                              <CheckCircle size={19} weight="fill" />
                              Entrada registrada
                            </div>
                          ) : declined ? (
                            <span className="text-xs text-neutral-400">
                              Recusado
                            </span>
                          ) : pending ? (
                            <span className="text-xs text-amber-600">
                              Pendente
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={checkInMutation.isPending}
                              onClick={() => handleCheckIn(guest.id)}
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6E4C12] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#573C0E] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                              <CheckCircle size={17} />
                              Registrar entrada
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <button
              type="button"
              onClick={handleNewScan}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9B982] bg-white py-4 text-sm font-medium text-[#6E4C12] transition hover:bg-[#FFF6E6]"
            >
              <QrCode size={19} />
              Ler outro convite
            </button>
          </section>
        )}

        {/* Local errors */}
        {localError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {localError}
          </div>
        )}

      </div>
    </main>
  );
}
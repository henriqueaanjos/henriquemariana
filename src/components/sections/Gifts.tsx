"use client";

import {
  ArrowLeftIcon,
  CreditCardIcon,
  GiftIcon,
  MoneyIcon,
  QrCodeIcon,
  SpinnerIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { useState } from "react";
import { createGiftCheckout } from "@/src/services/gifts";

import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { CardGifts } from "../CardGifts";
import { Modal } from "../Modal";
import { QRCodeSVG } from "qrcode.react";

const PIX_KEY = "marifeitosa99@gmail.com";

const PIX_COPY_PASTE =
  "00020126450014BR.GOV.BCB.PIX0123marifeitosa99@gmail.com5204000053039865802BR5925MARIANA DE ARAUJO FEITOSA6009SAO PAULO622605224Up7iLbjO8K3sAHwKMDlHx63045612";

type SelectedOption = "none" | "gift" | "money";

function PixModal() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  async function handleCopy(
    value: string,
    type: "key" | "code",
  ) {
    try {
      await navigator.clipboard.writeText(value);

      if (type === "key") {
        setCopiedKey(true);

        window.setTimeout(() => {
          setCopiedKey(false);
        }, 1800);

        return;
      }

      setCopiedCode(true);

      window.setTimeout(() => {
        setCopiedCode(false);
      }, 1800);
    } catch (error) {
      console.error("Erro ao copiar Pix:", error);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-6">
      {/* ÍCONE */}

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <QrCodeIcon
          size={28}
          className="text-primary-dark"
        />
      </div>

      {/* TÍTULO */}

      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="border-b-2 border-primary px-2 pb-1">
          <h2 className="font-cormorant text-2xl uppercase text-primary-light">
            Pix
          </h2>
        </div>

        <p className="max-w-xs text-center font-lora text-sm font-light leading-relaxed text-primary-light/60">
          Se desejar nos presentear via Pix, você pode utilizar
          o QR Code abaixo ou copiar nossa chave.
        </p>
      </div>

      {/* QR CODE */}

      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <QRCodeSVG
          value={PIX_COPY_PASTE}
          size={150}
          level="H"
          marginSize={2}
        />
      </div>

      {/* DADOS */}

      <div className="mb-4 flex flex-col items-center gap-1">
        <p className="text-center font-lora text-sm font-bold text-primary-light/70">
          Mariana de Araújo Feitosa
        </p>

        <p className="text-center font-lora text-sm font-bold text-primary-light/70">
          Banco Itaú
        </p>
      </div>

      {/* CHAVE PIX */}

      <div className="w-full max-w-xs">
        <label
          htmlFor="pix-key"
          className="mb-2 block text-center font-lora text-[11px] uppercase tracking-[0.14em] text-primary-light/50"
        >
          Chave Pix
        </label>

        <div className="flex items-center gap-2 rounded-2xl border border-primary-light/10 bg-primary-light/5 p-2">
          <div className="min-w-0 flex-1 px-3">
            <p
              id="pix-key"
              className="truncate text-center font-lora text-xs text-primary-light/70"
            >
              {PIX_KEY}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(PIX_KEY, "key")}
            className="shrink-0 rounded-xl bg-primary-dark/80 px-4 py-2 font-lora text-[10px] uppercase tracking-[0.08em] text-primary-light transition-all hover:bg-primary-dark"
          >
            {copiedKey ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
      </div>

      {/* PIX COPIA E COLA */}

      <div className="w-full max-w-xs">
        <label
          htmlFor="pix-copy-paste"
          className="mb-2 block text-center font-lora text-[11px] uppercase tracking-[0.14em] text-primary-light/50"
        >
          Pix Copia e Cola
        </label>

        <div className="flex items-center gap-2 rounded-2xl border border-primary-light/10 bg-primary-light/5 p-2">
          <div className="min-w-0 flex-1 px-3">
            <p
              id="pix-copy-paste"
              className="truncate font-mono text-[9px] text-primary-light/50"
            >
              {PIX_COPY_PASTE}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              handleCopy(PIX_COPY_PASTE, "code")
            }
            className="shrink-0 rounded-xl bg-primary-dark/80 px-4 py-2 font-lora text-[10px] uppercase tracking-[0.08em] text-primary-light transition-all hover:bg-primary-dark"
          >
            {copiedCode ? "Copiado ✓" : "Copiar"}
          </button>
        </div>
      </div>

      {/* INFORMAÇÃO */}

      <p className="max-w-xs text-center font-lora text-[10px] leading-relaxed text-primary-light/40">
        Obrigado por fazer parte desse momento tão especial
        para nós. 🤍
      </p>
    </div>
  );
}

export function Gifts() {
  const [isPixOpen, setIsPixOpen] = useState(false);
  const [isCreditCardOpen, setIsCreditCardOpen] =
    useState(false);

  const [selectedOption, setSelectedOption] =
    useState<SelectedOption>("none");

  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleOpenPixModal() {
    setIsPixOpen(true);
  }

  function handleClosePixModal() {
    setIsPixOpen(false);
  }

  function handleOpenCreditCardModal() {
    setAmount("");
    setError("");
    setIsCreditCardOpen(true);
  }

  function handleCloseCreditCardModal() {
    if (isLoading) return;

    setIsCreditCardOpen(false);
    setAmount("");
    setError("");
  }

  function formatCurrency(value: string) {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      return "";
    }

    const cents = Number(numericValue);

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  }

  function getAmountValue() {
    const numericValue = amount.replace(/\D/g, "");

    if (!numericValue) {
      return 0;
    }

    return Number(numericValue) / 100;
  }

  async function handleCreditCardCheckout() {
    const value = getAmountValue();

    if (!value || value <= 0) {
      setError("Digite um valor para o presente.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { checkoutUrl } =
        await createGiftCheckout(value);

      if (!checkoutUrl) {
        throw new Error("Checkout não encontrado.");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(
        "Erro ao criar checkout:",
        error,
      );

      setError(
        "Não foi possível iniciar o pagamento. Tente novamente em alguns instantes.",
      );

      setIsLoading(false);
    }
  }

  return (
    <section
      id="gifts"
      className="relative flex h-screen w-screen snap-start flex-col items-center bg-[url(/AYM_8552.jpeg)] bg-cover bg-top bg-no-repeat px-8 pt-36 pb-14"
    >
      <div className="absolute inset-0 z-0 bg-linear-to-t from-olive-900/90 to-olive-900/10 to-65%" />

      <div className="z-1 flex w-full flex-col items-center">
        <div className="border-b-2 border-primary px-2 pb-1">
          <h1 className="font-cormorant text-3xl font-bold uppercase text-primary-dark">
            Listas de Presentes
          </h1>
        </div>

        <h5 className="mt-2 text-center font-lora text-sm uppercase text-primary-dark">
          Sua presença já é um presente pra nós. Mas se desejar, reunimos algumas opções de presentes
        </h5>
      </div>

      <div className="relative mt-7 flex h-full w-full grow flex-col items-start">
        {/* ============================================================
            MENU PRINCIPAL
            ============================================================ */}

        {selectedOption === "none" && (
          <div className="flex h-full w-[40%] grow flex-col items-start justify-center gap-6 p-4">
            <LiquidGlassWrapper className="w-full flex-1 cursor-pointer rounded-3xl bg-black/20 transition-all duration-500 hover:scale-105">
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-4"
                onClick={() =>
                  setSelectedOption("gift")
                }
              >
                <GiftIcon
                  size={32}
                  className="text-primary-light"
                />

                <div className="border-b-2 border-primary px-2 pb-1">
                  <h1 className="font-cormorant text-base uppercase text-primary-light">
                    Lista de Presentes
                  </h1>
                </div>

                <p className="font-lora text-sm font-light text-primary-light/70">
                  Para o nosso novo lar, com carinho
                </p>
              </div>
            </LiquidGlassWrapper>

            <LiquidGlassWrapper className="w-full flex-1 cursor-pointer rounded-3xl bg-black/20 transition-all duration-500 hover:scale-105">
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-4"
                onClick={() =>
                  setSelectedOption("money")
                }
              >
                <MoneyIcon
                  size={32}
                  className="text-primary-light"
                />

                <div className="border-b-2 border-primary px-2 pb-1">
                  <h1 className="font-cormorant text-base uppercase text-primary-light">
                    Presentes em Dinheiro
                  </h1>
                </div>

                <p className="font-lora text-sm font-light text-primary-light/70">
                  Para os sonhos que estamos construindo juntos.
                </p>
              </div>
            </LiquidGlassWrapper>
          </div>
        )}

        {/* ============================================================
            LISTA DE PRESENTES
            ============================================================ */}

        {selectedOption === "gift" && (
          <>
            <LiquidGlassWrapper className="relative ml-6 rounded-lg bg-primary-light/40">
              <button
                type="button"
                className="z-10 flex h-full w-full grow cursor-pointer flex-row items-center justify-center gap-2 px-3 py-2"
                onClick={() =>
                  setSelectedOption("none")
                }
              >
                <ArrowLeftIcon
                  size={20}
                  className="text-primary-dark"
                />

                <p className="font-lora text-sm uppercase text-primary-dark">
                  Voltar
                </p>
              </button>
            </LiquidGlassWrapper>

            <div className="flex h-full w-full grow flex-row items-center justify-center gap-6 p-4 pb-8">
              <CardGifts
                href="https://www.finalfeliz.de/henriqueemari"
                imageSrc="/magalu.webp"
                imageAlt="Magalu"
                description="Eletrodomésticos e itens para o nosso lar."
              />
              <CardGifts
                href="https://wa.me/message/TEOO4FZFVCRCH1"
                imageSrc="/sotto_logo.png"
                imageAlt={"Sotto Design"}
                description={"Móveis e detalhes para o nosso cantinho."}
              />
              <CardGifts
                href=""
                imageSrc="/Havan_logo.svg"
                imageAlt={"Havan"}
                description={"Utensílios e detalhes para a nossa casa."}
              />
              <CardGifts
                href=""
                imageSrc="/mmartan-seeklogo.svg"
                imageAlt={"Mmartan"}
                description={"Conforto e aconchego para o nosso lar."}
              />
            </div>
          </>
        )}

        {/* ============================================================
            PRESENTES EM DINHEIRO
            ============================================================ */}

        {selectedOption === "money" && (
          <>
            <LiquidGlassWrapper className="relative ml-6 rounded-lg bg-primary-light/40">
              <button
                type="button"
                className="z-10 flex h-full w-full grow cursor-pointer flex-row items-center justify-center gap-2 px-3 py-2"
                onClick={() =>
                  setSelectedOption("none")
                }
              >
                <ArrowLeftIcon
                  size={20}
                  className="text-primary-dark"
                />

                <p className="font-lora text-sm uppercase text-primary-dark">
                  Voltar
                </p>
              </button>
            </LiquidGlassWrapper>

            <div className="flex h-full w-full grow flex-row items-center justify-center gap-6 p-4 pb-8">
              {/* PIX */}

              <LiquidGlassWrapper className="h-1/2 w-full flex-1 cursor-pointer rounded-3xl bg-black/20 transition-all duration-500 hover:scale-105">
                <button
                  type="button"
                  className="flex h-full w-full flex-col items-center justify-center gap-4"
                  onClick={handleOpenPixModal}
                >
                  <QrCodeIcon
                    size={32}
                    className="text-primary-light"
                  />

                  <div className="border-b-2 border-primary px-2 pb-1">
                    <h1 className="font-cormorant text-base uppercase text-primary-light">
                      Pix
                    </h1>
                  </div>
                </button>
              </LiquidGlassWrapper>

              {/* CARTÃO */}

              <LiquidGlassWrapper className="h-1/2 w-full flex-1 cursor-pointer rounded-3xl bg-black/20 transition-all duration-500 hover:scale-105">
                <button
                  type="button"
                  className="flex h-full w-full flex-col items-center justify-center gap-4"
                  // onClick={
                  //   handleOpenCreditCardModal
                  // }
                >
                  <CreditCardIcon
                    size={32}
                    className="text-primary-light"
                  />

                  <div className="border-b-2 border-primary px-2 pb-1">
                    <h1 className="font-cormorant text-base uppercase text-primary-light">
                      Cartão de Crédito
                    </h1>
                  </div>
                </button>
              </LiquidGlassWrapper>
            </div>
          </>
        )}
      </div>

      {/* ============================================================
          MODAL PIX
          ============================================================ */}

      <Modal
        isOpen={isPixOpen}
        onClose={handleClosePixModal}
      >
        <PixModal />
      </Modal>

      {/* ============================================================
          MODAL CARTÃO
          ============================================================ */}

      <Modal
        isOpen={isCreditCardOpen}
        onClose={handleCloseCreditCardModal}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
          {/* ÍCONE */}

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CreditCardIcon
              size={28}
              className="text-primary-dark"
            />
          </div>

          {/* TÍTULO */}

          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="border-b-2 border-primary px-2 pb-1">
              <h2 className="font-cormorant text-2xl uppercase text-primary-light">
                Cartão de Crédito
              </h2>
            </div>

            <p className="max-w-xs text-center font-lora text-sm font-light leading-relaxed text-primary-light/60">
              Se desejar nos presentear via Cartão de Crédito,
              você pode utilizar o formulário abaixo.
            </p>
          </div>

          {/* VALOR */}

          <div className="w-full max-w-xs">
            <label
              htmlFor="gift-amount"
              className="mb-2 block text-center font-lora text-[11px] uppercase tracking-[0.14em] text-primary-light/50"
            >
              Valor do presente
            </label>

            <input
              id="gift-amount"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={formatCurrency(amount)}
              onChange={(event) => {
                const numericValue =
                  event.target.value.replace(
                    /\D/g,
                    "",
                  );

                setAmount(numericValue);
                setError("");
              }}
              placeholder="R$ 0,00"
              disabled={isLoading}
              className="h-14 w-full rounded-2xl border border-primary-light/10 bg-primary-light/5 px-5 text-center font-lora text-xl text-primary-light outline-none transition-all placeholder:text-primary-light/20 focus:border-primary/50 focus:bg-white/50 disabled:opacity-50"
            />

            {error && (
              <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-red-700/80">
                <WarningCircleIcon
                  size={15}
                  weight="fill"
                />

                <span>{error}</span>
              </div>
            )}
          </div>

          {/* BOTÃO */}

          <button
            type="button"
            disabled={isLoading}
            onClick={handleCreditCardCheckout}
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-primary-dark/40 px-5 font-lora text-xs uppercase tracking-[0.08em] text-primary-light transition-all hover:bg-primary-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <SpinnerIcon
                  size={18}
                  className="animate-spin"
                />

                <span>
                  Abrindo pagamento...
                </span>
              </>
            ) : (
              <>
                <CreditCardIcon size={18} />

                <span>
                  Continuar para pagamento
                </span>
              </>
            )}
          </button>

          {/* INFORMAÇÃO */}

          <p className="max-w-xs text-center font-lora text-[10px] leading-relaxed text-primary-light/40">
            O pagamento será realizado com segurança
            através do Asaas. Os dados do cartão não são
            armazenados em nosso site.
          </p>
        </div>
      </Modal>
    </section>
  );
}
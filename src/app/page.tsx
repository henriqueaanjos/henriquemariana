"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckIcon,
  GiftIcon,
  HeartIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

import { Hero } from "../components/sections/Hero";
import { Story } from "../components/sections/Story";
import { Header } from "../components/Header";
import Dates from "../components/sections/Dates";
import { Gallery } from "../components/sections/Gallery";
import { Playlist } from "../components/sections/Playlist";
import { RSVP } from "../components/sections/RSVP";
import { Recado } from "../components/sections/Recado";
import { Information } from "../components/sections/Informations";
import { Gifts } from "../components/sections/Gifts";
import { Modal } from "../components/Modal";

type GiftStatus = "success" | "cancel" | "expired" | null;

function GiftStatusModal({
  status,
}: {
  status: Exclude<GiftStatus, null>;
}) {
  const content = {
    success: {
      icon: CheckIcon,
      title: "Muito obrigado!",
      message:
        "Seu carinho significa muito para nós e ficamos muito felizes por você fazer parte desse momento tão especial.",
      secondary:
        "Esperamos celebrar esse dia ao lado de pessoas tão especiais como você.",
      iconClass: "text-primary-dark",
      iconBackground: "bg-primary/10",
    },

    cancel: {
      icon: XIcon,
      title: "Pagamento cancelado",
      message:
        "O pagamento não foi concluído. Mas não se preocupe, nenhuma cobrança foi realizada.",
      secondary:
        "Se desejar, você pode tentar novamente quando quiser.",
      iconClass: "text-primary-dark",
      iconBackground: "bg-primary/10",
    },

    expired: {
      icon: WarningCircleIcon,
      title: "Checkout expirado",
      message:
        "O tempo para concluir esse pagamento terminou e o checkout foi encerrado.",
      secondary:
        "Se ainda quiser nos presentear, você pode iniciar um novo pagamento.",
      iconClass: "text-primary-dark",
      iconBackground: "bg-primary/10",
    },
  }[status];

  const Icon = content.icon;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      {/* ÍCONE */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${content.iconBackground}`}
      >
        <Icon
          size={28}
          weight={status === "success" ? "regular" : "regular"}
          className={content.iconClass}
        />
      </div>

      {/* TÍTULO */}
      <div className="flex flex-col items-center gap-2">
        <div className="border-b-2 border-primary px-2 pb-1">
          <h2 className="font-cormorant text-2xl uppercase text-primary-light">
            {content.title}
          </h2>
        </div>

        <p className="max-w-xs text-center font-lora text-sm font-light leading-relaxed text-primary-light/60">
          {content.message}
        </p>
      </div>

      {/* CONTEÚDO */}
      <div className="flex flex-col items-center gap-3">
        {status === "success" ? (
          <HeartIcon
            size={28}
            weight="fill"
            className="text-primary"
          />
        ) : (
          <GiftIcon
            size={28}
            className="text-primary"
          />
        )}

        <p className="max-w-xs text-center font-lora text-xs leading-relaxed text-primary-light/45">
          {content.secondary}
        </p>
      </div>

      {/* ASSINATURA */}
      <p className="font-cormorant text-xl text-primary-light/70">
        Mariana & Henrique
      </p>
    </div>
  );
}

export default function Home() {
  const searchParams = useSearchParams();

  const [giftStatus, setGiftStatus] =
    useState<GiftStatus>(null);

  useEffect(() => {
    const success = searchParams.get("gift");
    const status = searchParams.get("gifts");

    if (success === "success") {
      setGiftStatus("success");
      return;
    }

    if (status === "cancel") {
      setGiftStatus("cancel");
      return;
    }

    if (status === "expired") {
      setGiftStatus("expired");
    }
  }, [searchParams]);

  function handleCloseGiftStatus() {
    setGiftStatus(null);

    // Remove os parâmetros da URL sem recarregar a página.
    const url = new URL(window.location.href);

    url.searchParams.delete("gift");
    url.searchParams.delete("gifts");

    window.history.replaceState({}, "", url.toString());
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />

          <div className="snap-y snap-mandatory">
            <div className="snap-none lg:snap-start">
              <Hero />
            </div>

            <div className="snap-none lg:snap-start">
              <Story />
            </div>

            <div className="snap-none lg:snap-start">
              <Dates />
            </div>

            <div className="snap-none lg:snap-start">
              <Information />
            </div>

            <div className="snap-none lg:snap-start">
              <Gifts />
            </div>

            <div className="snap-none lg:snap-start">
              <Gallery />
            </div>

            <div className="snap-none lg:snap-start">
              <Playlist />
            </div>

            <div className="snap-none lg:snap-start">
              <RSVP />
            </div>

            <div className="snap-none lg:snap-start">
              <Recado />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ============================================================
          MODAL DE STATUS DO PAGAMENTO
          ============================================================ */}

      <Modal
        isOpen={giftStatus !== null}
        onClose={handleCloseGiftStatus}
      >
        {giftStatus && (
          <GiftStatusModal status={giftStatus} />
        )}
      </Modal>
    </>
  );
}
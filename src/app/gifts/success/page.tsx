"use client";

import { CheckIcon, HeartIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { LiquidGlassWrapper } from "@/src/components/LiquidGlassWrapper";

export default function GiftSuccessPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[url(/AYM_8544-3.jpeg)] bg-cover bg-center px-6">
      <div className="absolute inset-0 bg-olive-900/70" />
      <div className="absolute inset-0 bg-linear-to-t from-olive-900/90 via-olive-900/40 to-olive-900/20" />

      <div className="relative z-10 w-full max-w-md">
        <LiquidGlassWrapper className="rounded-3xl bg-black/30">
          <div className="flex flex-col items-center px-8 py-10 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <CheckIcon
                size={30}
                weight="regular"
                className="text-primary"
              />
            </div>

            <div className="border-b-2 border-primary px-2 pb-1">
              <h1 className="font-cormorant text-3xl font-bold uppercase text-primary-light">
                Presente recebido
              </h1>
            </div>

            <p className="mt-5 font-lora text-sm leading-relaxed text-primary-light/75">
              Muito obrigado por fazer parte desse momento tão especial das
              nossas vidas.
            </p>

            <HeartIcon
              size={22}
              weight="fill"
              className="my-6 text-primary"
            />

            <p className="font-lora text-xs leading-relaxed text-primary-light/55">
              Seu carinho e sua presença tornam esse momento ainda mais
              especial para nós.
            </p>

            <Link
              href="/"
              className="mt-8 flex h-11 w-full items-center justify-center rounded-2xl bg-primary-dark/70 px-5 font-lora text-xs uppercase tracking-[0.08em] text-primary-light transition-all hover:bg-primary-dark"
            >
              Voltar para o site
            </Link>

            <p className="mt-6 font-cormorant text-lg text-primary-light/70">
              Mariana & Henrique
            </p>
          </div>
        </LiquidGlassWrapper>
      </div>
    </main>
  );
}
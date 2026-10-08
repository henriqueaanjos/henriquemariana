"use client";

import { ArrowClockwiseIcon, HeartIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { LiquidGlassWrapper } from "@/src/components/LiquidGlassWrapper";

export default function GiftExpiredPage() {
  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[url(/AYM_8544-3.jpeg)] bg-cover bg-center px-6">
      <div className="absolute inset-0 bg-olive-900/70" />
      <div className="absolute inset-0 bg-linear-to-t from-olive-900/90 via-olive-900/40 to-olive-900/20" />

      <div className="relative z-10 w-full max-w-md">
        <LiquidGlassWrapper className="rounded-3xl bg-black/30">
          <div className="flex flex-col items-center px-8 py-10 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <ArrowClockwiseIcon
                size={30}
                className="text-primary"
              />
            </div>

            <div className="border-b-2 border-primary px-2 pb-1">
              <h1 className="font-cormorant text-3xl font-bold uppercase text-primary-light">
                Checkout expirado
              </h1>
            </div>

            <p className="mt-5 font-lora text-sm leading-relaxed text-primary-light/75">
              Este checkout não está mais disponível.
            </p>

            <p className="mt-3 font-lora text-xs leading-relaxed text-primary-light/55">
              Se você ainda deseja nos presentear, basta iniciar uma nova
              contribuição.
            </p>

            <Link
              href="/#gifts"
              className="mt-8 flex h-11 w-full items-center justify-center rounded-2xl bg-primary-dark/70 px-5 font-lora text-xs uppercase tracking-[0.08em] text-primary-light transition-all hover:bg-primary-dark"
            >
              Fazer uma nova contribuição
            </Link>

            <HeartIcon
              size={20}
              weight="fill"
              className="mt-7 text-primary/60"
            />

            <p className="mt-3 font-cormorant text-lg text-primary-light/70">
              Mariana & Henrique
            </p>
          </div>
        </LiquidGlassWrapper>
      </div>
    </main>
  );
}
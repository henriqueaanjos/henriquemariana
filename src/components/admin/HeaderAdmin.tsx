"use client";

import {
  Bell,
  List,
} from "@phosphor-icons/react";
import { motion } from "motion/react";

interface HeaderAdminProps {
  onMenuClick: () => void;
}

export function HeaderAdmin({
  onMenuClick,
}: HeaderAdminProps) {
  return (
    <header className="sticky top-0 z-30 h-19 border-b border-[#2c2925]/7 bg-[#f7f4ef]/85 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Mobile */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2c2925]/8 bg-white/40 text-[#2c2925]/65 transition-all hover:bg-white/70 hover:text-[#2c2925] lg:hidden"
        >
          <List size={20} />
        </button>

        {/* Desktop context */}
        <div className="hidden lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2c2925]/35">
            Administration
          </p>

          <p className="mt-1 text-[13px] text-[#2c2925]/55">
            Gerencie os detalhes do seu casamento
          </p>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#2c2925]/8 bg-white/40 text-[#2c2925]/55 transition-colors hover:bg-white/70 hover:text-[#2c2925]"
            aria-label="Notificações"
          >
            <Bell size={18} />

            <span className="absolute right-2.25 top-2 h-1.5 w-1.5 rounded-full bg-[#6e4c12]" />
          </motion.button>

          <div className="ml-2 flex items-center gap-3 border-l border-[#2c2925]/8 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-[12px] font-medium text-[#2c2925]">
                Henrique
              </p>

              <p className="text-[10px] text-[#2c2925]/40">
                Administrador
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6e4c12] text-[11px] font-medium text-white">
              HA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
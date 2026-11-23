
"use client";

import { ReactNode, useState } from "react";
import { List } from "@phosphor-icons/react";
import { motion } from "motion/react";

import { SidebarAdmin } from "./SidebarAdmin";
import { FooterAdmin } from "./Footer";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#2c2925]">
      <SidebarAdmin
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Conteúdo principal */}
      <div className="min-h-screen lg:pl-72">
        {/* Barra superior mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#2c2925]/8 bg-[#f7f4ef]/90 px-5 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#2c2925] transition-colors hover:bg-black/5 active:scale-95"
          >
            <List size={24} weight="regular" />
          </button>

          <span className="font-serif text-lg tracking-tight text-[#6e4c12]">
            Administração
          </span>

          {/* Mantém o título centralizado */}
          <div className="h-10 w-10" aria-hidden="true" />
        </header>

        <main className="min-h-[calc(100vh-140px)] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto w-full max-w-[1600px]"
          >
            {children}
          </motion.div>
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
}

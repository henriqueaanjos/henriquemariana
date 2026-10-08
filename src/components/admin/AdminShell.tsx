"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SidebarAdmin } from "./SidebarAdmin";
import { HeaderAdmin } from "./HeaderAdmin";
import { FooterAdmin } from "./Footer";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#2c2925]">
      <SidebarAdmin
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-70">
        {/* <HeaderAdmin onMenuClick={() => setSidebarOpen(true)} /> */}

        <main className="min-h-[calc(100vh-140px)] px-5 py-8 sm:px-8 lg:px-10">
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

      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
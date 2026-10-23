
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Camera,
  ChartBar,
  EnvelopeSimple,
  MusicNotes,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { motion } from "motion/react";

interface SidebarAdminProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  {
    label: "Visão geral",
    href: "/admin",
    icon: ChartBar,
  },
  {
    label: "Convidados",
    href: "/admin/rsvp",
    icon: UsersThree,
  },
  {
    label: "Fotos",
    href: "/admin/photos",
    icon: Camera,
  },
  {
    label: "Playlist",
    href: "/admin/playlist",
    icon: MusicNotes,
  },
  {
    label: "Recados",
    href: "/admin/messages",
    icon: EnvelopeSimple,
  },
];

export function SidebarAdmin({
  open,
  onClose,
}: SidebarAdminProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-[#2c2925]/35 backdrop-blur-[2px]",
          "transition-opacity duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Sidebar / menu mobile */}
      <aside
        id="admin-sidebar"
        aria-label="Menu de administração"
        aria-hidden={!open}
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col",
          "border-r border-[#2c2925]/8 bg-[#f7f4ef]",
          "transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex min-h-28 items-center justify-between px-5 pt-4 sm:px-7">
          <Link
            href="/admin"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="group flex min-w-0 flex-1 flex-col items-center justify-center gap-1"
          >
            <Image
              src="/monograma_2.svg"
              alt="Monograma do casamento"
              width={40}
              height={40}
              priority
            />

            <span className="font-bickham-script-pro-regular text-3xl text-primary-dark sm:text-4xl">
              Mariana & Henrique
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#2c2925]/45 transition-colors hover:bg-black/5 hover:text-[#2c2925] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2c2925]/35">
            Gerenciamento
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  className="group relative block"
                >
                  {active && (
                    <motion.div
                      layoutId="admin-sidebar-active"
                      className="absolute inset-0 rounded-xl bg-[#6e4c12]/8"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}

                  <div
                    className={[
                      "relative flex h-12 items-center gap-3 rounded-xl px-3",
                      "transition-colors duration-200",
                      active
                        ? "text-[#6e4c12]"
                        : "text-[#2c2925]/55 hover:bg-black/5 hover:text-[#2c2925]",
                    ].join(" ")}
                  >
                    <Icon
                      size={20}
                      weight={active ? "duotone" : "regular"}
                    />

                    <span className="text-sm font-medium">
                      {item.label}
                    </span>

                    {active && (
                      <motion.span
                        layoutId="admin-sidebar-indicator"
                        className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#6e4c12]"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#2c2925]/8 p-5">
          <div className="rounded-2xl bg-white/45 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2c2925]/35">
              Save the Date
            </p>

            <p className="mt-2 font-serif text-lg tracking-[-0.03em] text-[#2c2925]">
              09 · 01 · 2027
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

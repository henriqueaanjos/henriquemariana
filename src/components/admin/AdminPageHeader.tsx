"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { ReactNode } from "react";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children?: ReactNode;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  children,
}: AdminPageHeaderProps) {
  const actionClassName =
    "group flex h-10 items-center gap-2 rounded-full bg-[#2c2925] px-4 text-[12px] font-medium text-white";

  const actionContent = (
    <>
      {action?.label}

      <ArrowUpRight
        size={15}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  );

  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-[#2c2925]/7 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6e4c12]">
            {eyebrow}
          </p>
        )}

        <h1 className="font-serif text-4xl leading-none tracking-[-0.045em] text-[#2c2925] sm:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#2c2925]/50">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {children}

        {action?.href && (
          <Link href={action.href}>
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className={actionClassName}
            >
              {actionContent}
            </motion.div>
          </Link>
        )}

        {action?.onClick && (
          <motion.button
            type="button"
            onClick={action.onClick}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={actionClassName}
          >
            {actionContent}
          </motion.button>
        )}
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";

const navigation = [
  { id: "story", label: "Nossa História" },
  { id: "dates", label: "Datas Marcantes" },
  { id: "info", label: "Informações" },
  { id: "gifts", label: "Lista de Presentes" },
  { id: "gallery", label: "Galeria" },
  { id: "playlist", label: "Playlist" },
  { id: "rsvp", label: "RSVP" },
  { id: "message", label: "Recado" },
];

const sectionThemes = {
  hero: "dark",
  story: "dark",
  dates: "dark",
  info: "dark",
  gifts: "dark",
  gallery: "light",
  playlist: "light",
  rsvp: "dark",
  message: "light",
} as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const [textTheme, setTextTheme] = useState<"light" | "dark">("dark");
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (id: string) => {
    const section = document.getElementById(id);

    if (!section) return;

    setIsMenuOpen(false);

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsSnapped(false);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsSnapped(true);
      }, 150);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          setActiveSection(id);

          const theme =
            sectionThemes[id as keyof typeof sectionThemes];

          if (theme) {
            setTextTheme(theme);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-10% 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const themeClasses =
    textTheme === "light"
      ? "text-primary-light border-b-primary-light"
      : "text-primary-dark border-b-primary-dark";

      const backgroundClasses =
      textTheme === "light"
        ? "bg-primary-dark/50 "
        : "bg-background/70 ";

  return (
    <header
      className={`
        fixed top-6 left-1/2 z-50
        -translate-x-1/2
        origin-top
        transition-transform duration-500 ease-out
        w-[calc(100%-2rem)] sm:w-auto
        ${
          isScrolled
            ? "lg:scale-75 scale-100"
            : "scale-100"
        }
      `}
    >
      <LiquidGlassWrapper
        className={`
          w-full transition-all duration-500
          p-4 px-4 sm:px-8 lg:px-16
          rounded-3xl lg:rounded-full
          ${
            isMenuOpen
              ? backgroundClasses
              : ""
          }
          lg:bg-transparent lg:backdrop-blur-none
          lg:border-transparent lg:shadow-none
        `}
        isGlassEffect={isMenuOpen || (isScrolled && !isSnapped)}
      >
        <div className="flex w-full flex-col items-center gap-4">
          <div className="relative flex w-full items-center justify-center lg:w-auto">
            <Image
              src="/monograma_2.svg"
              alt="Monograma Mariana e Henrique"
              width={62}
              height={67}
              priority
              className="h-auto w-[46px] cursor-pointer sm:w-[54px] lg:w-[62px]"
              onClick={() => handleNavigation("hero")}
            />

            <button
              type="button"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="header-mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`
                absolute right-0
                flex h-10 w-10 items-center justify-center
                rounded-full
                transition-colors duration-300
                lg:hidden
                ${themeClasses}
              `}
            >
              {isMenuOpen ? (
                <X size={24} weight="light" />
              ) : (
                <List size={24} weight="light" />
              )}
            </button>
          </div>

          <nav
            aria-label="Navegação principal"
            className="
              hidden lg:flex
              z-10 flex-row items-center gap-12
              border-b-2 border-b-primary
              px-2 pb-2 font-lora
            "
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                aria-current={
                  activeSection === item.id ? "location" : undefined
                }
                className={`
                  cursor-pointer uppercase text-sm
                  hover:font-bold hover:scale-110
                  transition-all duration-500 text-center
                  whitespace-nowrap
                  ${themeClasses}
                  ${
                    activeSection === item.id
                      ? "font-black scale-105 border-b-4"
                      : ""
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div
            id="header-mobile-navigation"
            className={`
              w-full overflow-hidden
              transition-all duration-300 ease-in-out
              lg:hidden
              ${
                isMenuOpen
                  ? "max-h-[520px] opacity-100 pointer-events-auto"
                  : "max-h-0 opacity-0 pointer-events-none"
              }
            `}
            aria-hidden={!isMenuOpen}
            inert={!isMenuOpen}
          >
            <nav
              aria-label="Navegação mobile"
              className="flex flex-col items-center gap-1 pb-2 pt-3 font-lora"
            >
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  aria-current={
                    activeSection === item.id ? "location" : undefined
                  }
                  tabIndex={isMenuOpen ? 0 : -1}
                  className={`
                    w-full rounded-xl px-3 py-3
                    text-center text-xs uppercase tracking-wider
                    transition-colors duration-300
                    hover:bg-black/5
                    ${themeClasses}
                    ${
                      activeSection === item.id
                        ? "font-bold"
                        : "font-normal"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </LiquidGlassWrapper>
    </header>
  );
}
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";

const navigation = [
    {
        id: "story",
        label: "Nossa História",
    },
    {
        id: "dates",
        label: "Datas Marcantes",
    },
    {
        id: 'info',
        label: 'Informações',
    },
    {
        id: "gifts",
        label: "Lista de Presentes",
    },
    {
        id: "gallery",
        label: "Galeria",
    },
    {
        id: "playlist",
        label: "Playlist",
    },
    {
        id: "rsvp",
        label: "RSVP",
    },
    {
        id: "message",
        label: "Recado",
    },
];

const sectionThemes = {
    hero: "dark",
    story: "dark",
    dates: "dark",
    info: 'dark',
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

    const handleNavigation = (id: string) => {
        const section = document.getElementById(id);

        if (!section) return;

        section.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };


    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            setIsSnapped(false);

            clearTimeout(timeout);

            timeout = setTimeout(() => {
                setIsSnapped(true);
            }, 150);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

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

                    const theme = sectionThemes[
                        id as keyof typeof sectionThemes
                    ];

                    if (theme) {
                        console.log("Setting theme to", theme);
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
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed top-6 left-1/2 z-50
                -translate-x-1/2
                origin-top
                transition-transform duration-500 ease-out
                ${isScrolled ? "scale-75" : "scale-100"}
            `}
        >
            <LiquidGlassWrapper
                className={`w-full transition-all duration-500 p-4 px-16 rounded-full`}
                isGlassEffect={isScrolled && !isSnapped}
            >
                <div className="w-full flex flex-col items-center gap-4">
                    <Image src='monograma_2.svg'
                        alt='Monograma'
                        width={62}
                        height={67}
                        className="cursor-pointer"
                        onClick={() => handleNavigation("hero")}
                    />
                    <div className="z-10 flex flex-row items-center gap-12 px-2 pb-2 border-b-2 border-b-primary font-lora">
                        {navigation.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`cursor-pointer uppercase text-sm hover:font-bold hover:scale-110 transition-all duration-500 text-center whitespace-nowrap
                                    ${textTheme === "light"
                                        ? "text-primary-light border-b-primary-light"
                                        : "text-primary-dark border-b-primary-dark"
                                    }
                                    ${activeSection === item.id ? "font-black scale-105 border-b-4" : ""}
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </LiquidGlassWrapper>
        </header >
    )
}
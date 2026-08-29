'use client'

import { Hero } from "../components/sections/Hero";
import { Story } from "../components/sections/Story";
import { Header } from "../components/Header";
import Dates from "../components/sections/Dates";
import { Gallery } from "../components/sections/Gallery";
import { Playlist } from "../components/sections/Playlist";
import { RSVP } from "../components/sections/RSVP";
import { Recado } from "../components/sections/Recado";
import { AnimatePresence, motion } from "motion/react";
import { Information } from "../components/sections/Informations";
import { Gifts } from "../components/sections/Gifts";

export default function Home() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <div className="snap-y snap-mandatory">
          <div className="snap-start">
            <Hero />
          </div>
          <div className="snap-start">
            <Story />
          </div>
          <div className="snap-start">
            <Dates />
          </div>
          <div className="snap-start">
            <Information />
          </div>
          <div className="snap-start">
            <Gifts />
          </div>
          <div className="snap-start">
            <Gallery />
          </div>
          <div className="snap-start">
            <Playlist />
          </div>
          <div className="snap-start">
            <RSVP />
          </div>
          <div className="snap-start">
            <Recado />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

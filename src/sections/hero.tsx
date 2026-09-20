import { motion, useReducedMotion } from "motion/react";

import { Badge } from "../components/badge";
import { SessionReplay } from "../components/session-replay";
import { images } from "../lib/images";
import { SPRING, rise, stagger } from "../lib/motion";

export function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pt-32 pb-4 md:px-8 lg:pt-40"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden="true"
        className="bloom -z-20 top-[-260px] left-1/2 h-[820px] w-[1180px] -translate-x-1/2"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="shown"
        className="mx-auto flex max-w-[860px] flex-col items-center text-center"
      >
        <motion.div variants={rise}>
          <Badge tag="Kairox">Not open yet</Badge>
        </motion.div>

        <motion.h1 id="hero-heading" variants={rise} className="t-display t-wash mt-8 text-balance">
          Give the agent a real machine, <span className="tail">not a chat box</span>
        </motion.h1>

        <motion.p variants={rise} className="t-lead text-ink-muted measure mt-7 text-balance">
          Kairox is a cloud coding agent. Every session gets a container and a branch of its own.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative isolate mx-auto mt-16 max-w-[1240px] lg:mt-20"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: reduced ? 0 : 0.28 }}
      >
        <div className="frame overflow-hidden">
          <div className="rounded-card relative isolate overflow-hidden">
            <img
              src={images.heroTerminal.src}
              width={images.heroTerminal.width}
              height={images.heroTerminal.height}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-b from-[#08080b]/55 via-[#08080b]/25 to-[#08080b]/80"
            />
            <div className="p-4 sm:p-8 lg:p-12">
              <div className="mx-auto max-w-[1000px]">
                <SessionReplay />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

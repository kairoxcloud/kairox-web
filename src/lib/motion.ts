import { useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

export const SPRING: Transition = { type: "spring", stiffness: 240, damping: 28, mass: 0.9 };
export const SPRING_SNAP: Transition = { type: "spring", stiffness: 420, damping: 36 };

const viewportOnce = { once: true, amount: 0.15 } as const;

export const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: SPRING },
};

export const riseSmall: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: SPRING_SNAP },
};

/** A reduced-motion reader gets the content outright rather than a viewport trigger, which
    also removes any chance of a reveal stranding at opacity 0 when the page is scrolled
    past faster than the observer samples. */
export function useReveal() {
  const reduced = useReducedMotion() ?? false;
  return reduced
    ? ({ initial: "shown", animate: "shown" } as const)
    : ({ initial: "hidden", whileInView: "shown", viewport: viewportOnce } as const);
}

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { rise, useReveal } from "../lib/motion";

/** A single block arriving on scroll. Groups use the `stagger` variants directly so their
    children can be sequenced; this is for standalone blocks. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={rise} {...useReveal()}>
      {children}
    </motion.div>
  );
}

import { motion } from "motion/react";
import type { ComponentProps } from "react";

import { SPRING_SNAP } from "../lib/motion";

type Variant = "primary" | "quiet";

export interface ButtonProps extends ComponentProps<typeof motion.button> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "from-accent-bright to-accent-deep shadow-accent hover:shadow-accent-hover border border-white/14 bg-gradient-to-b text-white",
  quiet:
    "border-line-strong bg-raised text-ink hover:border-accent-line hover:bg-surface border shadow-[0_1px_0_rgb(255_255_255/0.05)_inset]",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -1, scale: 1.015 }}
      whileTap={{ scale: 0.975, y: 0 }}
      transition={SPRING_SNAP}
      className={`t-label rounded-pill inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-3 whitespace-nowrap transition-[box-shadow,border-color,background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

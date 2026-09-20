import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";

export interface SectionHeadProps {
  id: string;
  icon: Icon;
  eyebrow: string;
  children: ReactNode;
  lead?: ReactNode;
  tone?: "page" | "photo";
}

export function SectionHead({
  id,
  icon,
  eyebrow,
  children,
  lead,
  tone = "page",
}: SectionHeadProps) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={`t-h2 mt-5 max-w-[19ch] text-balance ${tone === "photo" ? "text-white" : "t-wash"}`}
      >
        {children}
      </h2>
      {lead ? (
        <p
          className={`t-lead measure mt-5 text-balance ${tone === "photo" ? "text-white/72" : "text-ink-muted"}`}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

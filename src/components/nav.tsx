import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { Button } from "./button";
import { LogoMark } from "./logo";
import { SPRING_SNAP } from "../lib/motion";

const LINKS = [
  { id: "top", label: "Home" },
  { id: "problem", label: "Why" },
  { id: "run", label: "A run" },
  { id: "system", label: "System" },
];

export function scrollToWaitlist() {
  const target = document.getElementById("waitlist");
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
}

function useActiveSection() {
  const [active, setActive] = useState(LINKS[0].id);

  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function Nav() {
  const active = useActiveSection();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
      <div className="rounded-pill flex items-center gap-3 overflow-hidden border border-white/8 bg-[#0b0b11]/88 p-1.5 pl-2.5 shadow-[0_18px_44px_-14px_rgb(0_0_0/0.85)] backdrop-blur-xl sm:gap-4 sm:pl-3.5">
        <a
          href="#top"
          className="text-ink flex shrink-0 items-center gap-2.5 pl-1"
          aria-label="Kairox, back to top"
        >
          <LogoMark size={17} accent="var(--color-accent-bright)" />
          <span className="t-label font-semibold tracking-[-0.015em]">Kairox</span>
        </a>

        <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-white/10 md:block" />

        <ul className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((link) => {
            const isActive = link.id === active;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`t-small ease-page rounded-pill relative block px-3.5 py-2 transition-colors duration-200 ${
                    isActive ? "text-ink font-medium" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      transition={SPRING_SNAP}
                      aria-hidden="true"
                      className="rounded-pill absolute inset-0 bg-white/8"
                    />
                  ) : null}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <Button onClick={scrollToWaitlist} className="px-5 py-2.5 text-[13px]">
          Join the waitlist
        </Button>
      </div>
    </nav>
  );
}

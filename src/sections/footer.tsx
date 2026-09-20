import { GithubLogo } from "@phosphor-icons/react";

import { LogoMark } from "../components/logo";

const GITHUB = "https://github.com/prawesh-12";

export function Footer() {
  return (
    <footer
      className="relative isolate overflow-x-clip px-5 pt-14 pb-6 md:px-8"
      aria-label="Kairox"
    >
      <div className="slab overflow-hidden px-6 pt-24 pb-6 sm:px-10 lg:pt-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(58%_96%_at_56%_112%,rgb(155_133_255/0.9),rgb(124_92_255/0.45)_38%,rgb(98_66_224/0.14)_66%,transparent_88%)]"
        />

        <div className="@container">
          <div className="flex items-end gap-[0.08em] text-[24cqw] leading-[0.74]">
            <LogoMark
              className="text-ink h-[0.72em] w-auto shrink-0"
              accent="var(--color-accent-bright)"
            />
            <span className="signoff">Kairox</span>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-6">
          <p className="t-mono text-ink-dim text-[13.5px]">&copy; 2026 Kairox</p>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Kairox on GitHub"
            className="text-ink-dim hover:text-ink hover:border-accent-line ease-page rounded-pill inline-flex size-12 items-center justify-center border border-white/10 bg-white/5 transition-colors duration-200"
          >
            <GithubLogo size={24} weight="fill" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

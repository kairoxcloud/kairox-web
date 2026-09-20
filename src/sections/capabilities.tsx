import { CheckCircle, Cube, FolderOpen, GitBranch, Terminal } from "@phosphor-icons/react";

import { motion } from "motion/react";

import { SectionHead } from "../components/section-head";
import { rise, stagger, useReveal } from "../lib/motion";

const ITEMS = [
  {
    Icon: Terminal,
    label: "A real shell",
    body: "Installs packages and runs builds, with the output coming back into context.",
    line: "$ pnpm install && pnpm build",
  },
  {
    Icon: FolderOpen,
    label: "A real file system",
    body: "Edits, creates and moves files the same way you would in a checkout.",
    line: "src/server/routes.ts  +48 -12",
  },
  {
    Icon: GitBranch,
    label: "Its own branch",
    body: "Work lands on a branch of its own and merges back when you approve it.",
    line: "kairox/session-4f2a -> main",
  },
  {
    Icon: CheckCircle,
    label: "Your test suite",
    body: "The real suite against the real workspace, not a simulation of it.",
    line: "142 passed, 0 failed",
  },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="shell section-pad" aria-labelledby="capabilities-heading">
      <SectionHead
        id="capabilities-heading"
        icon={Cube}
        eyebrow="Inside a session"
        lead="A container comes up before the first token, and everything the agent does happens in it."
      >
        What the agent gets <span className="tail">the moment a run starts</span>
      </SectionHead>

      <motion.ul
        variants={stagger}
        {...useReveal()}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {ITEMS.map(({ Icon, label, body, line }) => (
          <motion.li key={label} variants={rise} className="card card-lit flex h-full flex-col p-6">
            <span className="chip size-9">
              <Icon size={18} weight="regular" aria-hidden="true" />
            </span>
            <h3 className="t-h3 mt-5">{label}</h3>
            <p className="t-body text-ink-muted mt-2 flex-1">{body}</p>
            <p className="t-mono-sm text-ink-dim border-line bg-void/50 rounded-chip mt-5 truncate border px-2.5 py-2">
              {line}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

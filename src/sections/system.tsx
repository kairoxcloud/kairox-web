import { Stack } from "@phosphor-icons/react";

import { motion } from "motion/react";

import { SectionHead } from "../components/section-head";
import { rise, stagger, useReveal } from "../lib/motion";
import { images } from "../lib/images";

const SIDE = [
  {
    image: images.lineGit,
    alt: "Line drawing of a branch splitting from a trunk and merging back into it",
    title: "A branch, never a copy",
    body: "Sessions live on their own branch, so nothing you have not reviewed reaches your default branch.",
  },
  {
    image: images.lineEventlog,
    alt: "Line drawing of stacked event records written one on top of another",
    title: "A log that outlives the run",
    body: "Every message, command and edit is appended to an event log. A killed run rebuilds itself from it.",
  },
];

export function System() {
  return (
    <section id="system" className="shell section-pad" aria-labelledby="system-heading">
      <SectionHead
        id="system-heading"
        icon={Stack}
        eyebrow="The system"
        lead="Three things hold a session together, and all three outlive the process that made them."
      >
        A machine, a branch, <span className="tail">and a log</span>
      </SectionHead>

      <motion.div
        variants={stagger}
        {...useReveal()}
        className="mt-14 grid gap-4 lg:mt-18 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      >
        <motion.article
          variants={rise}
          className="card card-lit flex h-full flex-col lg:row-span-2"
        >
          <div className="flex flex-1 items-center justify-center px-8 pt-10 pb-4">
            <img
              src={images.lineSandbox.src}
              width={images.lineSandbox.width}
              height={images.lineSandbox.height}
              alt="Line drawing of a session container with its parts suspended around it"
              loading="lazy"
              decoding="async"
              className="line-art max-h-[320px] w-full max-w-[420px] object-contain"
            />
          </div>
          <div className="border-line bg-void/40 border-t px-7 py-7">
            <h3 className="t-h3">A container of its own</h3>
            <p className="t-body text-ink-muted measure mt-2">
              A real shell and a real file system, reachable only on an internal Docker network. The
              browser never talks to it.
            </p>
          </div>
        </motion.article>

        {SIDE.map((card) => (
          <motion.article
            key={card.title}
            variants={rise}
            className="card card-lit flex h-full items-start gap-5 px-6 py-6"
          >
            <img
              src={card.image.src}
              width={card.image.width}
              height={card.image.height}
              alt={card.alt}
              loading="lazy"
              decoding="async"
              className="line-art h-24 w-24 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <h3 className="t-h3">{card.title}</h3>
              <p className="t-body text-ink-muted measure mt-2">{card.body}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

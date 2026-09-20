import { ArrowsClockwise } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Note, Outcome, PlanList, ToolChip, UserMessage } from "../components/replay-parts";
import { SectionHead } from "../components/section-head";
import { StateSquare } from "../components/state-square";
import { images } from "../lib/images";
import { SPRING_SNAP, riseSmall } from "../lib/motion";
import { replay, type ReplayEvent } from "../lib/replay";
import { QUEUED_COMMAND, STAGES, stageEvents, terminalThrough } from "../lib/stages";

const ADVANCE_MS = 1900;
const RESUME_MS = 9000;

const TONES: Record<string, string> = {
  command: "text-terminal-ink",
  output: "text-terminal-ink/75",
  exit: "text-terminal-ink/45",
  failed: "text-terminal-ink font-medium",
};

function row(event: ReplayEvent) {
  switch (event.kind) {
    case "message.user":
      return <UserMessage>{event.text}</UserMessage>;
    case "note":
      return <Note>{event.text}</Note>;
    case "plan":
      return <PlanList steps={event.steps.map((s) => ({ ...s, state: "idle" as const }))} />;
    case "tool.read":
      return <ToolChip verb="read" subject={event.path} />;
    case "tool.edit":
      return (
        <ToolChip verb="edit" subject={event.path} added={event.added} removed={event.removed} />
      );
    case "cmd.start":
      return <ToolChip verb="run" subject={event.command} />;
    case "outcome":
      return <Outcome state={event.state} summary={event.summary} />;
    default:
      return null;
  }
}

/** Direction travels with the index so the panel slides the way the loop is moving. */
function useLoopCursor(count: number, reduced: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ index: 0, direction: 1 });
  const [pausedAt, setPausedAt] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pausedAt) return;
    const timer = window.setTimeout(() => setPausedAt(0), RESUME_MS);
    return () => window.clearTimeout(timer);
  }, [pausedAt]);

  useEffect(() => {
    if (reduced || pausedAt || !inView) return;
    const timer = window.setInterval(
      () => setCursor((c) => ({ index: (c.index + 1) % count, direction: 1 })),
      ADVANCE_MS,
    );
    return () => window.clearInterval(timer);
  }, [reduced, pausedAt, inView, count]);

  return {
    ref,
    active: cursor.index,
    direction: cursor.direction,
    select: (i: number) => {
      setPausedAt(Date.now());
      setCursor((c) => ({ index: i, direction: i >= c.index ? 1 : -1 }));
    },
  };
}

export function Run() {
  const reduced = useReducedMotion() ?? false;
  const { ref, active, direction, select } = useLoopCursor(STAGES.length, reduced);
  const rail = useRef<HTMLOListElement>(null);

  // The rail scrolls sideways below lg, so an auto-advance can walk the active stage
  // out of view. Centre it instead of letting it disappear.
  useEffect(() => {
    const list = rail.current;
    const button = list?.children[active]?.querySelector("button");
    if (!list || !button) return;
    if (list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: button.offsetLeft - list.clientWidth / 2 + button.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, reduced]);

  const stage = STAGES[active];
  const events = stageEvents(stage);
  const lines = terminalThrough(stage);
  const shift = 18 * direction;

  return (
    <section
      id="run"
      className="shell section-pad relative isolate overflow-x-clip"
      aria-labelledby="run-heading"
    >
      <div
        aria-hidden="true"
        className="bloom -z-20 top-40 left-1/2 h-[640px] w-[980px] -translate-x-1/2 opacity-70"
      />

      <SectionHead
        id="run-heading"
        icon={ArrowsClockwise}
        eyebrow="A run"
        lead="Every pass changes the workspace, runs your checks, and reads what came back before deciding what to do next."
      >
        One task, <span className="tail">around the loop</span>
      </SectionHead>

      <div ref={ref} className="mt-14 lg:mt-18">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute top-[5px] right-[7%] left-[7%] hidden lg:block"
          >
            <div className="bg-line h-px" />
            <motion.div
              className="from-accent-deep to-accent-bright absolute inset-0 h-px origin-left bg-gradient-to-r"
              initial={false}
              animate={{ scaleX: active / (STAGES.length - 1) }}
              transition={SPRING_SNAP}
            />
          </div>

          <ol
            ref={rail}
            className="flex snap-x snap-mandatory gap-1 overflow-x-auto pb-4 lg:grid lg:grid-cols-7 lg:gap-0 lg:overflow-visible lg:pb-0"
          >
            {STAGES.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.label} className="shrink-0 snap-start lg:shrink">
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={isActive ? "step" : undefined}
                    className="group flex w-[9.5rem] cursor-pointer flex-col items-start gap-3.5 pr-5 text-left lg:w-full"
                  >
                    <span aria-hidden="true" className="relative block">
                      {isActive ? (
                        <motion.span
                          layoutId="stage-node"
                          transition={SPRING_SNAP}
                          className="bg-accent/25 ring-accent-bright/60 rounded-pill absolute -inset-[5px] ring-1"
                        />
                      ) : null}
                      <motion.span
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={SPRING_SNAP}
                        className={`rounded-pill ease-page relative block size-2.5 border-2 transition-colors duration-300 ${
                          isActive
                            ? "border-accent-bright bg-accent"
                            : i < active
                              ? "border-accent-line bg-accent-line"
                              : "border-line-strong bg-void group-hover:border-ink-muted"
                        }`}
                      />
                    </span>
                    <span
                      className={`t-h3 ease-page block transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-ink-dim group-hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="frame mt-8">
          <div className="card grid min-h-[23rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="border-line relative isolate overflow-hidden border-b lg:border-r lg:border-b-0">
              <img
                src={images.lineLoop.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="line-art pointer-events-none absolute -right-20 -bottom-24 -z-10 w-[22rem] max-w-none opacity-[0.13]"
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.label}
                  variants={{
                    hidden: { opacity: 0, x: shift },
                    shown: {
                      opacity: 1,
                      x: 0,
                      transition: { ...SPRING_SNAP, staggerChildren: 0.035, delayChildren: 0.02 },
                    },
                  }}
                  initial="hidden"
                  animate="shown"
                  exit={{ opacity: 0, x: -shift, transition: { duration: 0.12 } }}
                  className="px-6 py-6 lg:px-7"
                >
                  <motion.h3 variants={riseSmall} className="t-h3 text-accent-bright">
                    {stage.label}
                  </motion.h3>
                  <motion.p variants={riseSmall} className="t-body text-ink-muted measure mt-2">
                    {stage.body}
                  </motion.p>
                  <div className="mt-7 flex flex-col items-start gap-3">
                    {events.map((event, i) => (
                      <motion.div key={i} variants={riseSmall} className="max-w-full">
                        {row(event)}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-terminal flex min-h-[15rem] flex-col">
              <div className="flex items-center gap-4 border-b border-white/8 px-5 py-3">
                <span className="t-mono-sm text-terminal-ink whitespace-nowrap">
                  {replay?.project}
                  <span className="text-terminal-ink/45"> / </span>
                  {replay?.branch}
                </span>
                <span className="t-mono-sm text-terminal-ink/55 flex items-center gap-2 whitespace-nowrap">
                  <StateSquare state={active === STAGES.length - 1 ? "done" : "running"} />
                  {active === STAGES.length - 1 ? "done" : "running"}
                </span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.pre
                  key={stage.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: SPRING_SNAP }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className={`t-mono flex flex-1 flex-col overflow-hidden px-5 py-5 whitespace-pre-wrap ${
                    lines.length === 0 ? "justify-start" : "justify-end"
                  }`}
                  aria-label="Terminal output so far"
                >
                  {lines.length === 0 ? (
                    <span className="text-terminal-ink/55">
                      {QUEUED_COMMAND ? `$ ${QUEUED_COMMAND}\n` : ""}
                      <span className="caret" />
                    </span>
                  ) : (
                    lines.slice(-14).map((line, i) => (
                      <span key={i} className={TONES[line.tone]}>
                        {line.text}
                        {"\n"}
                      </span>
                    ))
                  )}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { Note, Outcome, PlanList, ToolChip, UserMessage } from "./replay-parts";
import { StateSquare, type MarkerState } from "./state-square";
import { DURATION, HOLD_MS, TYPE_RATE, replay, type ReplayEvent } from "../lib/replay";
import "./session-replay.css";

type Phase = "idle" | "playing" | "paused" | "finished";

type Item =
  | { k: "user"; id: number; text: string }
  | { k: "plan"; id: number; steps: { label: string; state: MarkerState }[] }
  | { k: "note"; id: number; text: string }
  | { k: "chip"; id: number; verb: string; subject: string; added?: number; removed?: number }
  | { k: "outcome"; id: number; state: string; summary: string };

const EVENTS: ReplayEvent[] = replay?.events ?? [];

const TERMINAL = EVENTS.filter(
  (e) => e.kind === "cmd.start" || e.kind === "cmd.output" || e.kind === "cmd.exit",
);

// Index of the first terminal event. The idle poster stays up until real
// output actually paints, so the pane is never an empty void mid-run.
const FIRST_TERM_AT = EVENTS.findIndex(
  (e) => e.kind === "cmd.start" || e.kind === "cmd.output" || e.kind === "cmd.exit",
);

const FIRST_COMMAND = TERMINAL.find(
  (e): e is Extract<ReplayEvent, { kind: "cmd.start" }> => e.kind === "cmd.start",
)?.command;

// The idle poster shows the run's actual task alongside its first command.
const FIRST_TASK = EVENTS.find(
  (e): e is Extract<ReplayEvent, { kind: "message.user" }> => e.kind === "message.user",
)?.text;

function countApplied(now: number) {
  let n = 0;
  while (n < EVENTS.length && EVENTS[n].t <= now) n += 1;
  return n;
}

function costAt(now: number) {
  let cost = 0;
  for (const e of EVENTS) {
    if (e.t > now) break;
    if (e.kind === "usage") cost = e.cost;
  }
  return cost;
}

function buildItems(applied: number): Item[] {
  const items: Item[] = [];
  let planAt = -1;
  let steps: { label: string; state: MarkerState }[] = [];

  for (let i = 0; i < applied; i++) {
    const e = EVENTS[i];
    switch (e.kind) {
      case "message.user":
        items.push({ k: "user", id: i, text: e.text });
        break;
      case "plan":
        steps = e.steps.map((s) => ({ label: s.label, state: "idle" as MarkerState }));
        planAt = items.length;
        items.push({ k: "plan", id: i, steps });
        break;
      case "step.state":
        if (planAt >= 0 && steps[e.index]) {
          steps = steps.map((s, n) => (n === e.index ? { ...s, state: e.state } : s));
          items[planAt] = { k: "plan", id: items[planAt].id, steps };
        }
        break;
      case "note":
        items.push({ k: "note", id: i, text: e.text });
        break;
      case "tool.read":
        items.push({ k: "chip", id: i, verb: "read", subject: e.path });
        break;
      case "tool.edit":
        items.push({
          k: "chip",
          id: i,
          verb: "edit",
          subject: e.path,
          added: e.added,
          removed: e.removed,
        });
        break;
      case "cmd.start":
        items.push({ k: "chip", id: i, verb: "run", subject: e.command });
        break;
      case "outcome":
        items.push({ k: "outcome", id: i, state: e.state, summary: e.summary });
        break;
    }
  }
  return items;
}

export function SessionReplay() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>(() => (reduced ? "finished" : "idle"));
  const [applied, setApplied] = useState(() => (reduced ? EVENTS.length : 0));
  const [promoted, setPromoted] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const termRef = useRef<HTMLPreElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const costRef = useRef<HTMLSpanElement>(null);

  const elapsed = useRef(0);
  const appliedRef = useRef(0);
  const builtRef = useRef(0);
  const typingRef = useRef<{ node: HTMLSpanElement; text: string; t: number } | null>(null);
  const costRefValue = useRef(0);
  const followTimeline = useRef(true);
  const followTerminal = useRef(true);

  // A runtime flip to reduced motion jumps straight to the finished run.
  const shown = reduced ? EVENTS.length : applied;
  const items = useMemo(() => buildItems(shown), [shown]);

  const writeCost = useCallback((value: number) => {
    costRefValue.current = value;
    if (costRef.current) costRef.current.textContent = `$${value.toFixed(2)}`;
  }, []);

  // The terminal is built and updated straight on the DOM. Output arrives every frame while a line
  // types, and routing that through React would re-render the timeline 60 times a second.
  const paintTerminal = useCallback((now: number) => {
    const el = termRef.current;
    if (!el) return;

    while (builtRef.current < TERMINAL.length) {
      const e = TERMINAL[builtRef.current];
      if (e.t > now) break;

      const pending = typingRef.current;
      if (pending) {
        pending.node.textContent = pending.text;
        typingRef.current = null;
      }

      const node = document.createElement("span");
      if (e.kind === "cmd.start") {
        node.textContent = `$ ${e.command}\n`;
        node.className = "text-terminal-ink";
      } else if (e.kind === "cmd.exit") {
        node.textContent = `exit ${e.code}\n\n`;
        // Theme carries no green/amber, so exit status is carried by emphasis only.
        node.className = e.code === 0 ? "text-terminal-ink/45" : "text-terminal-ink font-medium";
      } else {
        node.textContent = "";
        node.className = "text-terminal-ink/80";
        typingRef.current = { node, text: e.text, t: e.t };
      }
      el.appendChild(node);
      builtRef.current += 1;
    }

    const typing = typingRef.current;
    if (typing) {
      const shown = Math.min(
        typing.text.length,
        Math.max(0, Math.floor((now - typing.t) * TYPE_RATE)),
      );
      if ((typing.node.textContent?.length ?? 0) !== shown) {
        typing.node.textContent = typing.text.slice(0, shown);
      }
      if (shown >= typing.text.length) typingRef.current = null;
    }

    if (followTerminal.current) el.scrollTop = el.scrollHeight;
  }, []);

  const reset = useCallback(() => {
    elapsed.current = 0;
    appliedRef.current = 0;
    builtRef.current = 0;
    typingRef.current = null;
    followTimeline.current = true;
    followTerminal.current = true;
    if (termRef.current) termRef.current.textContent = "";
    setApplied(0);
    setPromoted(false);
    writeCost(0);
  }, [writeCost]);

  /** Paints the finished run straight onto the DOM. Holds no React state of its own. */
  const paintFinished = useCallback(() => {
    elapsed.current = DURATION;
    appliedRef.current = EVENTS.length;
    builtRef.current = 0;
    typingRef.current = null;
    if (termRef.current) termRef.current.textContent = "";
    paintTerminal(Number.POSITIVE_INFINITY);
    writeCost(costAt(DURATION));
  }, [paintTerminal, writeCost]);

  const restart = useCallback(() => {
    reset();
    if (reduced) {
      paintFinished();
      setApplied(EVENTS.length);
      setPhase("finished");
      return;
    }
    setPhase("playing");
  }, [paintFinished, reduced, reset]);

  // Reduced motion never animates. Only the DOM is touched here; the state it pairs with is the
  // initial state above, so this does not cascade a render.
  useEffect(() => {
    if (reduced) paintFinished();
  }, [reduced, paintFinished]);

  // Starts once, at 25% in view, and never when it is off screen.
  useEffect(() => {
    if (reduced || phase !== "idle") return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setPhase("playing");
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, reduced]);

  useEffect(() => {
    if (reduced || phase !== "playing") return;
    let frame = 0;
    let last = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min(64, ts - last);
      last = ts;
      elapsed.current += dt;
      const now = elapsed.current;

      paintTerminal(now);

      const target = costAt(now);
      const next = costRefValue.current + (target - costRefValue.current) * Math.min(1, dt / 260);
      writeCost(Math.abs(target - next) < 0.001 ? target : next);

      const count = countApplied(now);
      if (count !== appliedRef.current) {
        appliedRef.current = count;
        setApplied(count);
      }

      if (now >= DURATION) {
        paintTerminal(Number.POSITIVE_INFINITY);
        writeCost(costAt(DURATION));
        setPhase("finished");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, reduced, paintTerminal, writeCost]);

  useEffect(() => {
    if (phase !== "finished") return;
    const timer = window.setTimeout(() => setPromoted(true), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (followTimeline.current && timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [shown]);

  if (!replay) return null;

  const outcome = EVENTS.find((e) => e.kind === "outcome");
  const runState: MarkerState =
    phase === "finished" ? "done" : phase === "idle" ? "idle" : "running";
  const runLabel =
    phase === "finished"
      ? outcome && outcome.kind === "outcome"
        ? outcome.state
        : "done"
      : phase === "paused"
        ? "paused"
        : phase === "idle"
          ? "ready"
          : "running";

  const onTimelineScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    followTimeline.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  const onTerminalScroll = (event: React.UIEvent<HTMLPreElement>) => {
    const el = event.currentTarget;
    followTerminal.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  return (
    <section
      ref={rootRef}
      className="card shadow-lifted min-w-0 max-w-full overflow-hidden"
      aria-label="A session replay"
    >
      <div className="border-line bg-void/40 flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
          <span className="t-mono-sm text-ink whitespace-nowrap">
            {replay.project}
            <span className="text-ink-muted"> / </span>
            {replay.branch}
          </span>
          <span className="t-mono-sm text-ink-dim flex items-center gap-2 whitespace-nowrap">
            <StateSquare state={runState} />
            {runLabel}
          </span>
          <span className="t-mono-sm text-ink-muted hidden whitespace-nowrap sm:inline">
            {replay.model}
          </span>
          <span ref={costRef} className="t-mono-sm text-ink-muted whitespace-nowrap tabular-nums">
            $0.00
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 self-end sm:ml-auto sm:self-auto">
          <button
            type="button"
            onClick={() => setPhase(phase === "playing" ? "paused" : "playing")}
            disabled={reduced || phase === "finished"}
            className="t-small text-ink-muted hover:text-ink hover:bg-raised ease-page inline-flex min-h-[32px] cursor-pointer items-center rounded-pill px-3 transition-colors duration-150 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === "playing" ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={restart}
            className={`t-small ease-page inline-flex min-h-[32px] cursor-pointer items-center rounded-pill px-3 transition-colors duration-150 motion-reduce:transition-none ${
              promoted
                ? "bg-accent text-white hover:bg-accent-bright"
                : "text-ink-dim hover:text-ink hover:bg-raised"
            }`}
          >
            Replay
          </button>
        </span>
      </div>

      <div className="grid h-[420px] min-w-0 grid-rows-[minmax(0,190px)_minmax(0,1fr)] min-[900px]:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] min-[900px]:grid-rows-1">
        <div
          ref={timelineRef}
          onScroll={onTimelineScroll}
          tabIndex={0}
          role="region"
          aria-label="Session steps"
          className="replay-pane border-line order-2 min-h-0 min-w-0 overflow-auto border-t px-4 py-4 min-[900px]:order-1 min-[900px]:border-t-0 min-[900px]:border-r"
        >
          <ol className="flex min-w-0 flex-col gap-3">
            {phase === "idle" && items.length === 0 && FIRST_TASK ? (
              <li>
                <UserMessage>{FIRST_TASK}</UserMessage>
              </li>
            ) : null}
            {items.map((item) => (
              <li key={item.id} className="min-w-0">
                {renderItem(item)}
              </li>
            ))}
          </ol>
        </div>

        <div className="relative order-1 min-h-0 min-w-0 min-[900px]:order-2">
          <pre
            ref={termRef}
            onScroll={onTerminalScroll}
            tabIndex={0}
            role="region"
            aria-label="Session terminal output"
            className="replay-pane replay-pane-dark t-mono bg-terminal text-terminal-ink h-full min-h-0 w-full min-w-0 overflow-auto px-4 py-4 whitespace-pre"
          />
          {FIRST_TERM_AT >= 0 && shown <= FIRST_TERM_AT && FIRST_COMMAND ? (
            <div
              aria-hidden="true"
              className="t-mono text-terminal-ink/60 pointer-events-none absolute inset-0 overflow-hidden px-4 py-4 whitespace-pre"
            >
              {`$ ${FIRST_COMMAND}\n`}
              <span className="caret" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function renderItem(item: Item) {
  switch (item.k) {
    case "user":
      return <UserMessage>{item.text}</UserMessage>;
    case "plan":
      return <PlanList steps={item.steps} />;
    case "note":
      return <Note>{item.text}</Note>;
    case "chip":
      return (
        <ToolChip
          verb={item.verb}
          subject={item.subject}
          added={item.added}
          removed={item.removed}
        />
      );
    case "outcome":
      return <Outcome state={item.state} summary={item.summary} />;
  }
}

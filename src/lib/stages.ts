import { replay, type ReplayEvent } from "./replay";

export interface Stage {
  label: string;
  body: string;
  /** Inclusive event range in the bundled run that illustrates this stage. */
  from: number;
  to: number;
}

/** The loop is the idea; the ranges are moments from the sample run that show it.
    A run does not visit the stages once in order, so these are picked, not a partition. */
export const STAGES: Stage[] = [
  { label: "Task", body: "You describe the outcome, not the steps.", from: 0, to: 0 },
  { label: "Understand", body: "Reads the code it is about to change.", from: 1, to: 5 },
  { label: "Plan", body: "Writes the steps down before touching anything.", from: 7, to: 7 },
  { label: "Execute", body: "Edits files and runs commands in the container.", from: 23, to: 27 },
  { label: "Test", body: "Runs your test suite against the change.", from: 29, to: 35 },
  {
    label: "Observe",
    body: "Failures, logs and stack traces come back into context.",
    from: 36,
    to: 41,
  },
  { label: "Iterate", body: "Goes again, until it is done or it needs you.", from: 42, to: 49 },
];

/** The ranges are indices into the bundled sample. A dropped-in real run is played by the
    hero replay instead, and the loop walkthrough falls back to its captions. */
export const WALKTHROUGH = replay?.sample === true ? replay.events : undefined;

export function stageEvents(stage: Stage): ReplayEvent[] {
  if (!WALKTHROUGH) return [];
  return WALKTHROUGH.slice(stage.from, stage.to + 1);
}

export interface TerminalLine {
  text: string;
  tone: "command" | "output" | "exit" | "failed";
}

/** The terminal is cumulative: walking the loop shows everything the run has printed so far. */
export function terminalThrough(stage: Stage): TerminalLine[] {
  if (!WALKTHROUGH) return [];
  const lines: TerminalLine[] = [];
  for (const event of WALKTHROUGH.slice(0, stage.to + 1)) {
    if (event.kind === "cmd.start") lines.push({ text: `$ ${event.command}`, tone: "command" });
    if (event.kind === "cmd.output")
      lines.push({ text: event.text.replace(/\n$/, ""), tone: "output" });
    if (event.kind === "cmd.exit") {
      lines.push({ text: `exit ${event.code}`, tone: event.code === 0 ? "exit" : "failed" });
    }
  }
  return lines;
}

export const QUEUED_COMMAND = WALKTHROUGH?.find(
  (event): event is Extract<ReplayEvent, { kind: "cmd.start" }> => event.kind === "cmd.start",
)?.command;

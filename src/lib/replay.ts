export type ReplayEvent =
  | { t: number; kind: "message.user"; text: string }
  | { t: number; kind: "plan"; steps: { label: string }[] }
  | { t: number; kind: "step.state"; index: number; state: "running" | "done" | "failed" }
  | { t: number; kind: "note"; text: string }
  | { t: number; kind: "tool.read"; path: string }
  | { t: number; kind: "tool.edit"; path: string; added: number; removed: number }
  | { t: number; kind: "cmd.start"; command: string }
  | { t: number; kind: "cmd.output"; text: string }
  | { t: number; kind: "cmd.exit"; code: number }
  | { t: number; kind: "usage"; cost: number }
  | { t: number; kind: "outcome"; state: "done" | "blocked" | "failed"; summary: string };

export interface Replay {
  sample?: boolean;
  project: string;
  branch: string;
  model: string;
  events: ReplayEvent[];
}

// A real exported run takes precedence. Until one is dropped in, the sample renders instead and the
// component labels itself. Both are globbed so the build works with either file missing.
type JsonModule = Replay & { default?: Replay };

const real = import.meta.glob("../content/replay.json", { eager: true }) as Record<
  string,
  JsonModule | undefined
>;
const sample = import.meta.glob("../content/replay.sample.json", { eager: true }) as Record<
  string,
  JsonModule | undefined
>;

function pick(mod: Record<string, JsonModule | undefined>): Replay | undefined {
  // The glob is empty when the file is absent, and a JSON module arrives under `default`.
  const value = Object.values(mod)[0];
  const found = value?.default ?? value;
  return found?.events?.length ? found : undefined;
}

export const replay = pick(real) ?? pick(sample);

export const DURATION = replay ? replay.events[replay.events.length - 1].t : 0;

/** Characters revealed per millisecond in the terminal pane. */
export const TYPE_RATE = 0.8;

/** How long the finished state is held before REPLAY is promoted. */
export const HOLD_MS = 4000;

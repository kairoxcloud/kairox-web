export type MarkerState = "idle" | "running" | "done" | "failed";

/** Run state, carried by fill. The accent marks a finished step and nothing else. */
export function StateSquare({ state, size = 9 }: { state: MarkerState; size?: number }) {
  const tone =
    state === "done"
      ? "border-accent bg-accent"
      : state === "failed"
        ? "border-ink-muted bg-ink-muted"
        : state === "running"
          ? "border-accent-bright bg-accent/40"
          : "border-line-strong bg-transparent";
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-[3px] border ${tone}`}
      style={{ width: size, height: size }}
    />
  );
}

import { StateSquare, type MarkerState } from "./state-square";

/** Shared so the hero replay and the loop walkthrough draw the same event the same way. */

export function UserMessage({ children }: { children: string }) {
  return (
    <p className="t-small text-ink border-line bg-raised rounded-input max-w-full min-w-0 border px-3.5 py-3 break-words">
      {children}
    </p>
  );
}

export function Note({ children }: { children: string }) {
  return <p className="t-small text-ink-dim max-w-full break-words">{children}</p>;
}

export function PlanList({ steps }: { steps: { label: string; state: MarkerState }[] }) {
  return (
    <ol className="flex min-w-0 flex-col gap-2.5 py-1">
      {steps.map((step) => (
        <li key={step.label} className="flex min-w-0 items-center gap-2.5">
          <StateSquare state={step.state} />
          <span
            className={`t-small min-w-0 break-words ${step.state === "idle" ? "text-ink-muted" : "text-ink"} ${
              step.state === "failed" ? "line-through" : ""
            }`}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ToolChip({
  verb,
  subject,
  added,
  removed,
}: {
  verb: string;
  subject: string;
  added?: number;
  removed?: number;
}) {
  return (
    <p className="t-mono-sm bg-raised border-line rounded-chip flex w-max max-w-full items-baseline gap-x-3 border px-2.5 py-1.5 whitespace-nowrap">
      <span className="text-ink-muted shrink-0">{verb}</span>
      <span className="text-ink min-w-0 truncate">{subject}</span>
      {added !== undefined ? (
        <span className="shrink-0 whitespace-nowrap tabular-nums">
          <span className="text-accent-bright font-medium">+{added}</span>{" "}
          <span className="text-ink-muted">-{removed}</span>
        </span>
      ) : null}
    </p>
  );
}

export function Outcome({ state, summary }: { state: string; summary: string }) {
  return (
    <div className="border-accent-line bg-accent-soft rounded-input max-w-full border px-3.5 py-3">
      <p className="t-h3 text-ink flex items-center gap-2">
        <StateSquare state="done" />
        {state}
      </p>
      <p className="t-small text-ink-dim mt-1.5 break-words">{summary}</p>
    </div>
  );
}

import { Cube } from "@phosphor-icons/react";

import { Badge } from "./badge";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";
import { Nav } from "./nav";
import { SessionReplay } from "./session-replay";
import { StateSquare } from "./state-square";
import { WaitlistForm } from "./waitlist-form";

/** Dev-only gallery: `pnpm dev` then open `/?scratch`. Not reachable in a build. */
export function Scratch() {
  return (
    <div className="pb-24">
      <Nav />
      <div className="shell space-y-12 pt-32">
        <div className="flex flex-wrap items-center gap-4">
          <Badge tag="Kairox">The coding agent that gets its own machine</Badge>
          <Eyebrow icon={Cube}>Inside a session</Eyebrow>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Join the waitlist</Button>
          <Button variant="quiet">Quiet action</Button>
        </div>
        <div className="max-w-[32rem]">
          <WaitlistForm />
        </div>
        <div className="flex items-center gap-6">
          {(["idle", "running", "done", "failed"] as const).map((state) => (
            <span key={state} className="t-small text-ink flex items-center gap-2">
              <StateSquare state={state} />
              {state}
            </span>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card card-lit p-6">
            <h3 className="t-h3">Lit card</h3>
            <p className="t-body text-ink-muted mt-2">Panel with the accent bloom behind it.</p>
          </div>
          <div className="frame">
            <div className="card p-6">
              <h3 className="t-h3">Framed card</h3>
              <p className="t-body text-ink-muted mt-2">Outer bracket with an inner panel.</p>
            </div>
          </div>
        </div>
        <SessionReplay />
      </div>
    </div>
  );
}

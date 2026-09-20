import { MotionConfig } from "motion/react";

import { Nav } from "./components/nav";
import { Capabilities } from "./sections/capabilities";
import { Closing } from "./sections/closing";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { Problem } from "./sections/problem";
import { Run } from "./sections/run";
import { System } from "./sections/system";

export function App() {
  return (
    // `reducedMotion="user"` drops transforms and layout animation for anyone who asks
    // for it, so individual components only guard behaviour, not styling.
    <MotionConfig reducedMotion="user">
      <Nav />
      {/* `isolate` keeps the ground inside main, otherwise a negative z-index layer paints
          before body's own background and disappears under it. */}
      <main className="relative isolate">
        <div aria-hidden="true" className="ground absolute inset-0 -z-10" />
        <Hero />
        <Capabilities />
        <Problem />
        <Run />
        <System />
        <Closing />
      </main>
      <Footer />
    </MotionConfig>
  );
}

import type { Icon } from "@phosphor-icons/react";

export function Eyebrow({ icon: Glyph, children }: { icon: Icon; children: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="chip size-6">
        <Glyph size={13} weight="bold" aria-hidden="true" />
      </span>
      <span className="t-small text-accent-bright font-medium">{children}</span>
    </span>
  );
}

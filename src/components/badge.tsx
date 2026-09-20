export function Badge({ tag, children }: { tag: string; children: string }) {
  return (
    <span className="border-line-strong bg-raised/80 rounded-pill inline-flex items-center gap-2.5 border py-1 pr-4 pl-1 backdrop-blur-sm">
      <span className="chip t-mono-sm rounded-pill px-2.5 py-1 font-medium tracking-wide uppercase">
        {tag}
      </span>
      <span className="t-small text-ink-dim">{children}</span>
    </span>
  );
}

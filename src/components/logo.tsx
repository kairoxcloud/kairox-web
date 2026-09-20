/** Traced from ../../../assets/kairox_cloud_org_main_logo.png. Body inherits `currentColor`; the
    streak and the dot take `accent`, which defaults to the body colour so the mark stays
    readable at chip size. viewBox is the tight ink box, so no padding to compensate for. */
const BODY = [
  "M59.59 0.00L87.58 0.00L92.10 1.81L103.16 11.29L103.61 11.29L104.51 12.42L104.97 12.42L105.87 13.54L106.32 13.54L107.22 14.67L107.67 14.67L108.58 15.80L109.03 15.80L109.93 16.93L110.38 16.93L111.29 18.06L111.74 18.06L112.64 19.19L113.09 19.19L114.00 20.32L116.93 22.35L118.06 23.70L118.51 23.70L120.54 25.73L120.99 25.73L128.89 32.28L129.57 33.63L129.57 35.67L127.77 39.95L127.31 40.18L125.96 39.73L119.86 37.02L118.51 36.79L117.61 36.12L111.29 33.86L110.38 33.18L102.93 30.47L102.03 29.80L80.81 21.22L77.88 19.19L59.82 0.68Z",
  "M86.91 27.99L88.26 28.22L105.19 35.44L111.51 37.70L114.00 39.05L121.90 41.99L124.15 43.12L124.83 44.24L124.83 46.05L123.25 49.21L122.57 51.69L121.67 53.50L119.64 55.53L87.36 73.14L86.91 73.14L86.91 72.69L90.07 69.30L96.39 60.05L100.45 52.60L100.90 52.37L101.58 49.66L99.10 44.92L93.45 36.34L89.16 31.15L89.16 30.70L86.91 28.44Z",
  "M142.21 37.02L143.79 37.02L145.15 37.92L150.11 45.82L149.89 47.63L146.95 50.79L143.79 55.30L142.44 56.43L127.99 60.27L127.54 59.82L127.54 58.69L133.63 39.05L134.76 38.15Z",
  "M120.99 58.92L121.90 58.92L122.80 62.98L123.02 64.79L122.35 66.59L115.58 75.62L113.32 77.88L113.32 78.33L110.84 80.59L110.84 81.04L108.80 82.84L108.80 83.30L95.26 97.97L90.52 100.00L62.98 100.00L62.98 99.55L72.69 88.94L72.69 88.49L75.62 85.55L75.62 85.10L79.68 81.26Z",
];

const STREAK =
  "M88.26 44.24L90.97 44.47L93.23 45.60L94.81 47.40L95.49 49.21L95.49 51.92L94.58 53.95L93.00 55.53L91.20 56.43L73.36 58.01L50.56 60.72L28.89 63.88L0.00 69.07L0.23 68.62L4.51 67.72L8.13 66.37L55.08 53.05Z";

export const LOGO_RATIO = 1.7088;

export function LogoMark({
  size = 16,
  className,
  accent = "currentColor",
}: {
  size?: number;
  className?: string;
  accent?: string;
}) {
  return (
    <svg
      className={className}
      width={size * LOGO_RATIO}
      height={size}
      viewBox="0 0 170.88 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {BODY.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
      <path d={STREAK} fill={accent} />
      <circle cx="161.85" cy="30.02" r="9.03" fill={accent} />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="chip size-7">
        <LogoMark size={13} />
      </span>
      <span className="t-label font-semibold tracking-[-0.015em]">Kairox</span>
    </span>
  );
}

import { useId, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";

type Status = "idle" | "submitting" | "success" | "invalid" | "failed";

const MESSAGES: Partial<Record<Status, string>> = {
  success: "You are on the list. We will mail you when the first sessions open.",
  invalid: "That address does not look right.",
  failed: "Something went wrong. Try again in a minute.",
};

const CLOSED = "Waitlist opens shortly.";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** With no endpoint configured the form renders disabled, and the page hides its fine print. */
export const WAITLIST_OPEN = Boolean(import.meta.env.VITE_WAITLIST_ENDPOINT);

export function WaitlistForm({ id }: { id?: string }) {
  const inputId = useId();
  const helpId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT;
  const open = WAITLIST_OPEN;
  const message = open ? MESSAGES[status] : CLOSED;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint || status === "submitting") return;
    if (!EMAIL.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(response.ok ? "success" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "success") {
    return (
      <div id={id} className="@container w-full">
        <p
          className="t-small border-accent-line bg-accent-soft/80 text-ink rounded-input flex items-center gap-2.5 border px-4 py-3.5 backdrop-blur-sm"
          aria-live="polite"
        >
          <CheckCircle
            size={18}
            weight="regular"
            className="text-accent-bright shrink-0"
            aria-hidden="true"
          />
          {MESSAGES.success}
        </p>
      </div>
    );
  }

  return (
    <div id={id} className="@container w-full">
      <label htmlFor={inputId} className="sr-only">
        Work email
      </label>
      <form
        onSubmit={submit}
        noValidate
        className="border-line-strong bg-void/70 focus-within:border-accent-line rounded-pill ease-page flex flex-col gap-2 border p-1.5 backdrop-blur-sm transition-colors duration-200 @min-[26rem]:flex-row @min-[26rem]:items-center"
      >
        <input
          id={inputId}
          type="email"
          required
          disabled={!open}
          autoComplete="email"
          placeholder="you@company.com"
          aria-describedby={helpId}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="t-small text-ink placeholder:text-ink-muted min-w-0 flex-1 bg-transparent px-4 py-2.5 outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!open || status === "submitting"}
          className={`t-label ease-page rounded-pill shrink-0 cursor-pointer px-5 py-3 whitespace-nowrap transition-[box-shadow,background-color,transform] duration-200 active:translate-y-px disabled:cursor-not-allowed ${
            open
              ? "from-accent-bright to-accent-deep shadow-accent hover:shadow-accent-hover border border-white/14 bg-gradient-to-b text-white"
              : "border-accent-line text-ink-dim border"
          }`}
        >
          {status === "submitting" ? "Sending" : "Join the waitlist"}
        </button>
      </form>
      <p
        id={helpId}
        className="t-small text-ink-muted mt-3 min-h-[1.55em] text-center"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}

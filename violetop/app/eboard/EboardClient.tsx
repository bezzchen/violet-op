"use client";

import type { CSSProperties, FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import EventList from "../components/EventList";
import PageShell from "../components/PageShell";
import { eboardContent } from "../data/siteContent";
import type { CalendarEvent } from "../lib/ical";

// Remembering the PIN for the tab keeps navigation from re-prompting. The
// server still re-checks it on every request, so this is convenience only.
const PIN_STORAGE_KEY = "vop-eboard-pin";

const revealDelay = (index: number) =>
  ({ "--reveal-delay": `${index * 90}ms` }) as CSSProperties;

type Status = "locked" | "checking" | "unlocked";

type UnlockResult =
  | { ok: true; events: CalendarEvent[]; error: string | null }
  | { ok: false; message: string };

async function requestEvents(candidate: string): Promise<UnlockResult> {
  try {
    const response = await fetch(
      `/api/eboard-events?pin=${encodeURIComponent(candidate)}`,
    );

    if (!response.ok) {
      return { ok: false, message: "That PIN did not work. Try again." };
    }

    const payload = (await response.json()) as {
      events: CalendarEvent[];
      error: string | null;
    };

    return { ok: true, events: payload.events, error: payload.error };
  } catch {
    return { ok: false, message: "Could not reach the server. Try again." };
  }
}

export default function EboardClient() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<Status>("locked");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const applyResult = useCallback((candidate: string, result: UnlockResult) => {
    if (!result.ok) {
      sessionStorage.removeItem(PIN_STORAGE_KEY);
      setStatus("locked");
      setPinError(result.message);
      return;
    }

    sessionStorage.setItem(PIN_STORAGE_KEY, candidate);
    setEvents(result.events);
    setFeedError(result.error);
    setStatus("unlocked");
  }, []);

  // Re-verify a PIN remembered from an earlier page in this tab.
  useEffect(() => {
    const stored = sessionStorage.getItem(PIN_STORAGE_KEY);
    if (!stored) return;

    let active = true;
    void requestEvents(stored).then((result) => {
      if (active) applyResult(stored, result);
    });

    return () => {
      active = false;
    };
  }, [applyResult]);

  // Re-runs after unlocking so the event rows added to the DOM get observed too.
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-up:not(.is-visible)"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [status, events]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const candidate = pin.trim();
    if (!candidate) return;

    setStatus("checking");
    setPinError(null);
    void requestEvents(candidate).then((result) =>
      applyResult(candidate, result),
    );
  };

  return (
    <PageShell scrollContainerRef={scrollRef}>
      <section className="wide-page-shell relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-10 px-4 pb-12 pt-28 md:px-grid-margin">
        <div
          className="reveal-up glass-panel section-text-panel op-clip border-l-4 border-l-tertiary p-6 md:p-stack-xl"
          style={revealDelay(0)}
        >
          <span className="font-label-caps text-label-caps uppercase text-tertiary">
            Members Only
          </span>
          <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
            {eboardContent.title}
          </h1>
        </div>

        {status === "unlocked" ? (
          <section className="grid gap-6">
            <EventList
              emptyMessage={eboardContent.emptyMessage}
              error={feedError}
              events={events}
              startDelayIndex={1}
            />
          </section>
        ) : (
          <form
            className="reveal-up glass-panel event-row-panel mx-auto flex w-full max-w-md flex-col gap-5 rounded-lg px-6 py-8 md:px-8"
            onSubmit={handleSubmit}
            style={revealDelay(1)}
          >
            <label
              className="font-body-md text-body-md text-on-surface-variant/80"
              htmlFor="eboard-pin"
            >
              {eboardContent.intro}
            </label>

            <input
              autoComplete="off"
              className="w-full rounded border border-outline-variant bg-surface-container-lowest px-4 py-3 text-center font-label-caps text-headline-md tracking-[0.5em] text-white outline-none transition-colors focus:border-primary"
              disabled={status === "checking"}
              id="eboard-pin"
              inputMode="numeric"
              maxLength={8}
              onChange={(event) => setPin(event.target.value)}
              placeholder="••••"
              type="password"
              value={pin}
            />

            {pinError ? (
              <p className="font-body-md text-body-md text-error" role="alert">
                {pinError}
              </p>
            ) : null}

            <button
              className="op-clip bg-primary-container px-6 py-3 font-label-caps text-label-nav text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
              disabled={status === "checking" || !pin.trim()}
              type="submit"
            >
              {status === "checking" ? "Checking…" : "Unlock"}
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}

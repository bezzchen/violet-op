"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Clip = {
  id: string;
  title: string;
  url: string;
};

type YTPlayer = {
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  playVideo: () => void;
  getIframe: () => HTMLIFrameElement;
  destroy: () => void;
};

type YTPlayerEvent = { target: YTPlayer; data: number };

type YTPlayerOptions = {
  videoId: string;
  host?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onStateChange?: (event: YTPlayerEvent) => void;
  };
};

type YTNamespace = {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YouTube serves maxresdefault for HD uploads but not every video; fall back to
// hqdefault (always present) if the high-res poster is missing.
const getThumbnailUrl = (id: string, quality: "maxresdefault" | "hqdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

let youtubeApiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API unavailable on the server"));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<YTNamespace>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) {
        resolve(window.YT);
      }
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });

  return youtubeApiPromise;
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
      {muted ? (
        <>
          <line x1="22" x2="16" y1="9" y2="15" />
          <line x1="16" x2="22" y1="9" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      )}
    </svg>
  );
}

export default function FeaturedPlayer({
  clip,
  revealDelay = 0,
}: {
  clip: Clip;
  revealDelay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [thumbSrc, setThumbSrc] = useState(
    getThumbnailUrl(clip.id, "maxresdefault"),
  );

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !container) {
          return;
        }

        // The API replaces the passed node with its <iframe>, so hand it a
        // throwaway child rather than our React-managed container.
        const host = document.createElement("div");
        container.appendChild(host);

        playerRef.current = new YT.Player(host, {
          videoId: clip.id,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              // Pin the API-injected iframe to fill the cinematic frame.
              const frame = event.target.getIframe();
              if (frame) {
                frame.style.position = "absolute";
                frame.style.inset = "0";
                frame.style.width = "100%";
                frame.style.height = "100%";
              }
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event) => {
              // 1 === playing: swap out the poster once frames are showing.
              if (event.data === 1) {
                setReady(true);
              }
            },
          },
        });
      })
      .catch(() => {
        // API blocked or offline: the poster stays visible as a graceful fallback.
      });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore teardown errors from a half-initialized player
      }
      playerRef.current = null;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [clip.id]);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    if (muted) {
      player.unMute();
      player.setVolume(100);
      // Unmuting is a user gesture, so also (re)start playback in case the
      // browser blocked muted autoplay.
      player.playVideo();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  const revealStyle = { "--team-delay": `${revealDelay}ms` } as CSSProperties;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
      <div className="highlight-feature-glow team-reveal" style={revealStyle}>
        <div className="featured-player relative aspect-video w-full overflow-hidden rounded-xl border border-primary/30 bg-black shadow-[0_0_90px_-18px_rgba(209,76,255,0.6)]">
          <div className="absolute inset-0 h-full w-full" ref={containerRef} />

          {/* Transparent guard: suppresses YouTube's hover chrome and click-to-pause
              so the frame stays clean. Controls live outside the frame. */}
          <div aria-hidden="true" className="absolute inset-0 z-10" />

          {/* Poster shown until the first PLAYING frame, then fades to reveal video. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 z-20 transition-opacity duration-700 ${
              ready ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <Image
              alt=""
              className="object-cover"
              fill
              onError={() =>
                setThumbSrc((current) =>
                  current.includes("maxresdefault")
                    ? getThumbnailUrl(clip.id, "hqdefault")
                    : current,
                )
              }
              preload
              quality={78}
              sizes="(min-width: 1600px) 1600px, 100vw"
              src={thumbSrc}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary">
              Featured
            </span>
            <h2 className="mt-2 font-headline-md text-2xl font-bold uppercase text-white md:text-3xl">
              {clip.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-pressed={!muted}
              className="op-clip inline-flex items-center gap-2 bg-primary px-5 py-3 font-label-caps text-label-caps uppercase text-on-primary transition-all hover:neon-glow-purple"
              onClick={toggleMute}
              type="button"
            >
              <VolumeIcon muted={muted} />
              {muted ? "Unmute" : "Mute"}
            </button>
            <Link
              className="font-label-caps text-label-caps uppercase text-tertiary transition-colors hover:text-white"
              href={clip.url}
              rel="noreferrer"
              target="_blank"
            >
              Watch on YouTube
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

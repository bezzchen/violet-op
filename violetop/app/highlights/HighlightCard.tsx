"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Clip = {
  id: string;
  label: string;
  title: string;
  url: string;
};

const getEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

// YouTube serves maxresdefault for HD uploads but not every video; fall back to
// hqdefault (always present) if the high-res thumbnail is missing.
const getThumbnailUrl = (id: string, quality: "maxresdefault" | "hqdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

export default function HighlightCard({
  clip,
  revealDelay = 0,
}: {
  clip: Clip;
  revealDelay?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(
    getThumbnailUrl(clip.id, "maxresdefault"),
  );

  const revealStyle = { "--team-delay": `${revealDelay}ms` } as CSSProperties;

  return (
    <article
      className="clip-card team-reveal glass-panel overflow-hidden rounded-lg border border-white/10"
      style={revealStyle}
    >
      <div className="relative aspect-video bg-surface-container-lowest">
        {playing ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            referrerPolicy="strict-origin-when-cross-origin"
            src={getEmbedUrl(clip.id)}
            title={clip.title}
          />
        ) : (
          <button
            aria-label={`Play ${clip.title}`}
            className="group/play absolute inset-0 h-full w-full cursor-pointer"
            onClick={() => setPlaying(true)}
            type="button"
          >
            <Image
              alt=""
              className="object-cover transition-transform duration-500 group-hover/play:scale-105"
              fill
              onError={() =>
                setThumbSrc((current) =>
                  current.includes("maxresdefault")
                    ? getThumbnailUrl(clip.id, "hqdefault")
                    : current,
                )
              }
              quality={75}
              sizes="(min-width: 1024px) 45vw, 100vw"
              src={thumbSrc}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-colors duration-300 group-hover/play:from-black/60" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 text-on-primary shadow-lg transition-all duration-300 group-hover/play:scale-110 group-hover/play:neon-glow-purple"
            >
              <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-white/10 p-5">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary">
            {clip.label}
          </span>
          <h3 className="mt-2 font-headline-md text-xl font-bold uppercase text-white">
            {clip.title}
          </h3>
        </div>
        <Link
          className="font-label-caps text-label-caps text-tertiary transition-colors hover:text-white"
          href={clip.url}
          rel="noreferrer"
          target="_blank"
        >
          YouTube
        </Link>
      </div>
    </article>
  );
}

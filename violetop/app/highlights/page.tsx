import type { CSSProperties } from "react";
import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import FeaturedPlayer from "./FeaturedPlayer";
import HighlightCard from "./HighlightCard";
import { highlightsContent, siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `Highlights | ${siteMeta.title}`,
  description: siteMeta.description,
};

const revealStyle = (delay: number) =>
  ({ "--team-delay": `${delay}ms` }) as CSSProperties;

export default function HighlightsPage() {
  const [featuredClip, ...supportClips] = highlightsContent.clips;

  return (
    <PageShell>
      <div className="relative flex min-h-[var(--app-height)] w-full flex-col gap-12 pb-12 pt-28 md:gap-16">
        <header
          className="wide-page-shell team-reveal mx-auto w-full max-w-[1600px] px-4 md:px-8"
          style={revealStyle(0)}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary">
                Highlights
              </span>
              <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
                {highlightsContent.title}
              </h1>
              <p className="mt-4 font-headline-md text-headline-md font-bold uppercase text-tertiary">
                {highlightsContent.subtitle}
              </p>
            </div>
            <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant md:text-right">
              {highlightsContent.intro}
            </p>
          </div>
        </header>

        <FeaturedPlayer clip={featuredClip} revealDelay={90} />

        <section className="wide-page-shell mx-auto grid w-full max-w-7xl gap-6 px-4 md:px-grid-margin">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-tertiary">
                More Plays
              </span>
              <h2 className="mt-3 font-display-xl text-4xl font-extrabold uppercase text-white md:text-[3.25rem]">
              Video Archive
              </h2>
            </div>
            <p className="max-w-xl font-body-md text-body-md text-on-surface-variant/75">
              Explore recorded Violet OP VALORANT matches and team moments.
            </p>
          </div>

          <span
            aria-hidden="true"
            className="h-px w-full bg-gradient-to-r from-primary/70 via-primary/15 to-transparent"
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {supportClips.map((clip, index) => (
              <HighlightCard
                clip={clip}
                key={clip.id}
                revealDelay={180 + index * 90}
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

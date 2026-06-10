import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import { highlightsContent, siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `Highlights | ${siteMeta.title}`,
  description: siteMeta.description,
};

const getEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;

export default function HighlightsPage() {
  const [featuredClip, ...supportClips] = highlightsContent.clips;

  return (
    <PageShell>
      <section className="relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-12 px-4 pb-12 pt-28 md:px-grid-margin">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
          <div className="glass-panel section-text-panel op-clip border-l-4 border-l-primary p-6 md:p-stack-xl">
            <span className="font-label-caps text-label-caps uppercase text-primary">
              Highlights
            </span>
            <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
              {highlightsContent.title}
            </h1>
            <p className="mt-6 font-headline-md text-headline-md font-bold uppercase text-tertiary">
              {highlightsContent.subtitle}
            </p>
            <p className="mt-8 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              {highlightsContent.intro}
            </p>
          </div>

          <article className="glass-panel overflow-hidden rounded-lg border border-white/10 bg-surface-container-lowest shadow-2xl">
            <div className="aspect-video bg-surface-container-lowest">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={getEmbedUrl(featuredClip.id)}
                title={featuredClip.title}
              />
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary">
                  {featuredClip.label}
                </span>
                <h2 className="mt-2 font-headline-md text-2xl font-bold uppercase text-white">
                  {featuredClip.title}
                </h2>
              </div>
              <Link
                className="op-clip bg-primary px-5 py-3 text-center font-label-caps text-label-caps text-on-primary transition-all hover:neon-glow-purple"
                href={featuredClip.url}
                rel="noreferrer"
                target="_blank"
              >
                Watch
              </Link>
            </div>
          </article>
        </div>

        <section className="grid gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-tertiary">
                More Plays
              </span>
              <h2 className="mt-3 font-display-xl text-4xl font-extrabold uppercase text-white md:text-[3.25rem]">
                Clip Archive
              </h2>
            </div>
            <p className="max-w-xl font-body-md text-body-md text-on-surface-variant/75">
              Rewatch the Valorant moments that deserve a second look.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {supportClips.map((clip) => (
              <article
                className="glass-panel overflow-hidden rounded-lg border border-white/10 bg-surface-container-lowest"
                key={clip.id}
              >
                <div className="aspect-video bg-surface-container-lowest">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={getEmbedUrl(clip.id)}
                    title={clip.title}
                  />
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
            ))}
          </div>
        </section>
      </section>
    </PageShell>
  );
}

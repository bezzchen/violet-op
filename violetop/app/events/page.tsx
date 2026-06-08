import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "../components/PageShell";
import { eventsContent, siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `Events | ${siteMeta.title}`,
  description: siteMeta.description,
};

const categoryStyles: Record<string, string> = {
  Music: "bg-[#ece9ff] text-[#514087]",
  Live: "bg-[#dff8f0] text-[#175044]",
  Gaming: "bg-[#fff1eb] text-[#8a3d25]",
  default: "bg-primary-fixed text-on-primary-fixed",
};

export default function EventsPage() {
  return (
    <PageShell>
      <section className="relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-10 px-4 pb-12 pt-28 md:px-grid-margin">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1fr]">
          <div className="relative min-h-80 overflow-hidden rounded border border-white/10 bg-surface-container-lowest shadow-2xl md:min-h-[34rem]">
            <Image
              alt="Violet OP community"
              className="object-cover"
              fill
              preload
              quality={75}
              sizes="(min-width: 1024px) 42vw, 100vw"
              src="/images/groupphoto.avif"
            />
          </div>

          <div className="glass-panel section-text-panel op-clip border-r-4 border-r-tertiary p-6 text-right md:p-stack-xl">
            <span className="font-label-caps text-label-caps uppercase text-tertiary">
              Events
            </span>
            <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
              {eventsContent.title}
            </h1>
            <p className="mt-8 font-headline-md text-headline-md font-bold uppercase text-primary">
              {eventsContent.subtitle}
            </p>
          </div>
        </div>

        <section className="grid gap-6">
          <h2 className="font-display-xl text-4xl font-extrabold uppercase text-white md:text-[3.25rem]">
            {eventsContent.subtitle}
          </h2>
          <div className="grid gap-4">
            {eventsContent.events.map((event) => (
              <article
                className="glass-panel event-row-panel flex flex-col gap-5 rounded-lg px-6 py-6 md:flex-row md:items-center md:gap-8 md:px-8 md:py-7"
                key={`${event.month}-${event.day}-${event.title}`}
              >
                <div className="flex items-center gap-6 md:w-40">
                  <div className="w-16 shrink-0 text-center">
                    <span className="block font-label-caps text-label-caps font-bold uppercase text-primary">
                      {event.month}
                    </span>
                    <span className="block font-headline-lg text-4xl font-bold leading-none text-white">
                      {event.day}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="h-16 w-px shrink-0 bg-white/10"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-headline-md text-2xl font-bold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-1 font-body-md text-body-lg text-on-surface-variant/70">
                    {event.time}
                  </p>
                </div>

                <span
                  className={`inline-flex self-start rounded-full px-4 py-1.5 font-headline-md text-base font-bold md:self-center ${
                    categoryStyles[event.category] ?? categoryStyles.default
                  }`}
                >
                  {event.category}
                </span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PageShell>
  );
}

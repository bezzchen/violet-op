import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import { joinContent, siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `Join Us | ${siteMeta.title}`,
  description: siteMeta.description,
};

export default function JoinUsPage() {
  return (
    <PageShell>
      <section className="relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-12 px-4 pb-12 pt-28 md:px-grid-margin">
        <div className="glass-panel section-text-panel op-clip border-l-4 border-l-primary p-6 md:p-stack-xl">
          <span className="font-label-caps text-label-caps uppercase text-primary">
            Join Us
          </span>
          <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
            {joinContent.title}
          </h1>
          <p className="mt-8 max-w-4xl font-body-lg text-body-lg text-on-surface-variant">
            {joinContent.intro}
          </p>
        </div>

        <section className="grid gap-6">
          <h2 className="font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
            Choose Your Path
          </h2>
          <div className="grid gap-4 lg:grid-cols-5">
            {joinContent.paths.map((path) => (
              <article
                className="glass-panel flex min-h-56 flex-col justify-between rounded border border-white/10 p-5"
                key={path.name}
              >
                <h3 className="font-headline-md text-xl font-bold uppercase text-primary">
                  {path.name}
                </h3>
                {path.details.length > 0 ? (
                  <ul className="mt-5 grid gap-3 font-body-md text-sm text-on-surface-variant">
                    {path.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel section-text-panel op-clip border-r-4 border-r-tertiary p-6 md:p-stack-xl">
            <span className="font-label-caps text-label-caps uppercase text-tertiary">
              Not a Player?
            </span>
            <h2 className="mt-4 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
              Join the Staff
            </h2>
            <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">
              {joinContent.staffIntro}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {joinContent.staffRoles.map((role) => (
              <article
                className="glass-panel rounded border border-white/10 p-5 font-headline-md text-lg font-bold uppercase text-white"
                key={role}
              >
                {role}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
            FAQ
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {joinContent.faqs.map((faq) => (
              <article
                className="glass-panel flex min-h-56 flex-col justify-between rounded border border-white/10 p-5"
                key={faq.question}
              >
                <h3 className="font-headline-md text-xl font-bold text-primary">
                  {faq.question}
                </h3>
                <p className="mt-5 font-body-md text-body-md text-on-surface-variant">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="flex justify-center">
          <Link
            className="op-clip bg-primary px-8 py-4 font-label-caps text-label-caps text-on-primary shadow-xl shadow-primary/20 transition-all hover:neon-glow-purple"
            href="/events"
          >
            Community Events
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

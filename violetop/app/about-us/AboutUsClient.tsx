"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import PageShell from "../components/PageShell";
import { aboutContent } from "../data/siteContent";

type Person = {
  image?: string;
  name: string;
  role: string;
};

const centeredRowPositions: Record<number, string[]> = {
  1: ["md:col-start-3"],
  2: ["md:col-start-2", "md:col-start-4"],
  3: ["md:col-start-1", "md:col-start-3", "md:col-start-5"],
};

const revealDelay = (index: number) =>
  ({ "--reveal-delay": `${index * 90}ms` }) as CSSProperties;

function PersonCard({
  animationIndex,
  gridPosition,
  image,
  name,
  role,
}: Person & {
  animationIndex: number;
  gridPosition: string;
}) {
  return (
    <article
      className={`reveal-up glass-panel flex min-h-80 flex-col justify-between rounded border border-white/10 bg-surface-container-lowest/75 p-5 shadow-2xl md:col-span-2 md:min-h-96 md:p-6 ${gridPosition}`}
      style={revealDelay(animationIndex)}
    >
      {image ? (
        <div className="relative mb-6 h-56 w-full overflow-hidden rounded bg-surface-container md:h-64">
          <Image
            alt={name}
            className="object-cover object-top"
            fill
            quality={65}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 28vw, 100vw"
            src={image}
          />
        </div>
      ) : (
        <div className="mb-6 flex h-56 w-full items-center justify-center rounded bg-primary-container font-display-xl text-5xl font-extrabold text-white md:h-64">
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
      )}

      <div>
        <h3 className="font-headline-md text-2xl font-bold uppercase text-on-surface">
          {name}
        </h3>
        <p className="mt-2 font-label-caps text-label-caps uppercase text-primary">
          {role}
        </p>
      </div>
    </article>
  );
}

function chunkPeople(people: Person[]) {
  const rows: Person[][] = [];

  for (let index = 0; index < people.length; index += 3) {
    rows.push(people.slice(index, index + 3));
  }

  return rows;
}

function PeopleSection({
  eyebrow,
  heading,
  people,
}: {
  eyebrow: string;
  heading: string;
  people: Person[];
}) {
  return (
    <section className="grid gap-8">
      <div className="reveal-up">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">
          {eyebrow}
        </span>
        <h2 className="mt-3 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
          {heading}
        </h2>
      </div>

      <div className="grid gap-y-8 md:gap-y-12">
        {chunkPeople(people).map((row, rowIndex) => (
          <div
            className="grid gap-y-8 md:grid-cols-6 md:gap-x-6"
            key={row.map((person) => `${person.name}-${person.role}`).join("-")}
          >
            {row.map((person, columnIndex) => (
              <PersonCard
                animationIndex={rowIndex * 3 + columnIndex}
                gridPosition={centeredRowPositions[row.length][columnIndex]}
                key={`${person.name}-${person.role}`}
                {...person}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AboutUsClient() {
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-up"),
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
  }, []);

  return (
    <PageShell scrollContainerRef={scrollRef}>
      <section className="wide-page-shell relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-16 px-4 pb-12 pt-28 md:px-grid-margin">
        <div className="grid items-center gap-8 md:min-h-[calc(var(--app-height)-7rem)] lg:grid-cols-[1fr_0.9fr]">
          <div className="reveal-up glass-panel section-text-panel op-clip border-l-4 border-l-primary p-6 md:p-stack-xl">
            <span className="font-label-caps text-label-caps uppercase text-primary">
              About Us
            </span>
            <h1 className="mt-4 font-display-xl text-4xl font-extrabold uppercase text-white md:text-display-xl">
              {aboutContent.title}
            </h1>
            <div className="mt-8 grid gap-5 font-body-lg text-body-lg text-on-surface-variant">
              {aboutContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div
            className="reveal-up relative min-h-80 overflow-hidden rounded border border-white/10 bg-surface-container-lowest shadow-2xl md:min-h-[32rem]"
            style={revealDelay(1)}
          >
            <Image
              alt="Violet OP group"
              className="object-cover"
              fill
              preload
              quality={75}
              sizes="(min-width: 1024px) 45vw, 100vw"
              src={aboutContent.image}
            />
          </div>
        </div>

        <section className="grid gap-8">
          {aboutContent.sections.map((section) => (
            <PeopleSection
              eyebrow={section.eyebrow}
              heading={section.heading}
              key={section.heading}
              people={section.people}
            />
          ))}
        </section>
      </section>
    </PageShell>
  );
}

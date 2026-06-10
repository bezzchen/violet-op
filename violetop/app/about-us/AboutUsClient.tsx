"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import PageShell from "../components/PageShell";
import { aboutContent } from "../data/siteContent";

type Person = {
  image?: string;
  name: string;
  role: string;
};

const rowPositions = [
  ["md:col-start-1", "md:col-start-5", "md:col-start-9"],
  ["md:col-start-2", "md:col-start-6", "md:col-start-10"],
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (value: number) => {
  const progress = clamp(value);

  return progress * progress * (3 - 2 * progress);
};

const scrollRange = (scrollPos: number, vh: number, start: number, end: number) =>
  smoothstep((scrollPos - vh * start) / (vh * (end - start)));

function PersonCard({
  gridPosition,
  index,
  image,
  name,
  registerCard,
  role,
}: Person & {
  gridPosition: string;
  index: number;
  registerCard: (index: number, node: HTMLElement | null) => void;
}) {
  return (
    <article
      className={`glass-panel about-person-card col-span-12 flex min-h-80 flex-col justify-between rounded border border-white/10 bg-surface-container-lowest/75 p-5 shadow-2xl md:col-span-3 md:min-h-96 md:p-6 ${gridPosition}`}
      ref={(node) => {
        registerCard(index, node);
      }}
    >
      {image ? (
        <div className="relative mb-6 h-56 w-full overflow-hidden rounded bg-surface-container md:h-64">
          <Image
            alt={name}
            className="object-cover"
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
  indexOffset = 0,
  people,
  registerCard,
  subtitle,
}: {
  eyebrow: string;
  heading: string;
  indexOffset?: number;
  people: Person[];
  registerCard: (index: number, node: HTMLElement | null) => void;
  subtitle?: string;
}) {
  return (
    <section className="grid gap-8">
      <div className="about-people-heading">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">
          {eyebrow}
        </span>
        <h2 className="mt-3 font-headline-lg text-3xl font-bold uppercase text-white md:text-headline-lg">
          {heading}
        </h2>
        {subtitle ? (
          <p className="mt-3 font-label-caps text-label-caps uppercase text-primary">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-6 md:gap-y-12">
        {chunkPeople(people).map((row, rowIndex) =>
          row.map((person, columnIndex) => (
            <PersonCard
              gridPosition={rowPositions[rowIndex % rowPositions.length][columnIndex]}
              index={indexOffset + rowIndex * 3 + columnIndex}
              key={`${person.name}-${person.role}`}
              registerCard={registerCard}
              {...person}
            />
          )),
        )}
      </div>
    </section>
  );
}

export default function AboutUsClient() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const aboutTextRef = useRef<HTMLDivElement | null>(null);
  const aboutImageRef = useRef<HTMLDivElement | null>(null);
  const cardsSectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const aboutSections = aboutContent.sections;
  const sectionOffsets = aboutSections.map((_, sectionIndex) =>
    aboutSections
      .slice(0, sectionIndex)
      .reduce((total, section) => total + section.people.length, 0),
  );

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) {
      return;
    }

    let animationFrame = 0;
    let removeScrollListeners = () => {};
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionQuery.matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(aboutTextRef.current, { autoAlpha: 1, x: 0 });
      gsap.set(aboutImageRef.current, { autoAlpha: 1, scale: 1, x: 0 });
      gsap.set(".about-people-heading", { autoAlpha: 0, y: 36 });
      gsap.set(cardRefs.current, { autoAlpha: 0, scale: 0.96, x: 0, y: 72 });

      let headingNodes: HTMLElement[] = [];
      let headingOffsets: number[] = [];
      let cardOffsets: number[] = [];

      const refreshMeasurements = () => {
        headingNodes = gsap.utils.toArray<HTMLElement>(".about-people-heading");
        headingOffsets = headingNodes.map((heading) => heading.offsetTop);
        cardOffsets = cardRefs.current.map((card) => card?.offsetTop ?? 0);
      };

      const animateScrollState = () => {
        const scrollPos = scrollContainer.scrollTop;
        const vh = scrollContainer.clientHeight;
        const heroExit = scrollRange(scrollPos, vh, 0.04, 0.48);

        gsap.set(aboutTextRef.current, {
          autoAlpha: 1 - heroExit,
          x: -120 * heroExit,
        });

        gsap.set(aboutImageRef.current, {
          autoAlpha: 1 - heroExit,
          scale: 1 - 0.08 * heroExit,
          x: 120 * heroExit,
        });

        headingNodes.forEach((heading, index) => {
          const headingProgress = smoothstep(
            (scrollPos - (headingOffsets[index] - vh * 0.86)) / (vh * 0.38),
          );

          gsap.set(heading, {
            autoAlpha: headingProgress,
            y: 36 * (1 - headingProgress),
          });
        });

        cardRefs.current.forEach((card, index) => {
          if (!card) {
            return;
          }

          const cardOffset = cardOffsets[index] ?? card.offsetTop;
          const rowDelay = Math.floor(index / 3) * 16;
          const columnDelay = (index % 3) * 28;
          const progress = smoothstep(
            (scrollPos - (cardOffset - vh * 0.84 + rowDelay + columnDelay)) /
              (vh * 0.4),
          );

          gsap.set(card, {
            autoAlpha: progress,
            scale: 0.96 + 0.04 * progress,
            x: 0,
            y: 72 * (1 - progress),
          });
        });
      };

      const scheduleScrollState = () => {
        if (animationFrame) {
          return;
        }

        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = 0;
          animateScrollState();
        });
      };

      const handleResize = () => {
        refreshMeasurements();
        scheduleScrollState();
      };

      refreshMeasurements();
      animateScrollState();
      scrollContainer.addEventListener("scroll", scheduleScrollState, {
        passive: true,
      });
      window.addEventListener("resize", handleResize);
      window.visualViewport?.addEventListener("resize", handleResize);

      removeScrollListeners = () => {
        scrollContainer.removeEventListener("scroll", scheduleScrollState);
        window.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("resize", handleResize);
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }
      };
    });

    return () => {
      removeScrollListeners();
      ctx.revert();
    };
  }, []);

  const registerCard = (index: number, node: HTMLElement | null) => {
    cardRefs.current[index] = node;
  };

  return (
    <PageShell scrollContainerRef={scrollRef}>
      <section className="relative mx-auto flex min-h-[var(--app-height)] w-full max-w-7xl flex-col gap-16 px-4 pb-12 pt-28 md:px-grid-margin">
        <div className="grid min-h-[calc(var(--app-height)-7rem)] items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div
            className="glass-panel section-text-panel op-clip border-l-4 border-l-primary p-6 md:p-stack-xl"
            ref={aboutTextRef}
          >
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
            className="relative min-h-80 overflow-hidden rounded border border-white/10 bg-surface-container-lowest shadow-2xl md:min-h-[32rem]"
            ref={aboutImageRef}
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

        <section className="grid gap-8" ref={cardsSectionRef}>
          {aboutSections.map((section, index) => (
            <PeopleSection
              eyebrow={section.eyebrow}
              heading={section.heading}
              indexOffset={sectionOffsets[index]}
              key={section.heading}
              people={section.people}
              registerCard={registerCard}
              subtitle={section.subtitle}
            />
          ))}
        </section>
      </section>
    </PageShell>
  );
}

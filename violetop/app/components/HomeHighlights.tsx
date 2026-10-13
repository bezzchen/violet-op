"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { highlightsContent } from "../data/siteContent";
import { socialMedia } from "../data/socialMedia";
import styles from "./HomeHighlights.module.css";

const clips = [
  ...socialMedia.youtube
    .filter((video) => video.id === "ay5opv1eabg")
    .map((video) => ({ id: video.id, title: video.title, url: `https://www.youtube.com/watch?v=${video.id}` })),
  ...highlightsContent.clips,
];

export default function HomeHighlights() {
  const track = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ start: true, end: false });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setBounds({
      start: element.scrollLeft <= 2,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);

  function move(direction: number) {
    const element = track.current;
    if (!element || !element.firstElementChild) return;
    const step = element.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.intro}>
          <h2 id="community-title">Highlights</h2>
          <p>Match moments. Team films. VOP in action.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/highlights">All highlights <span aria-hidden="true">↗</span></Link>
          <div className={styles.controls} aria-label="Highlight carousel controls">
            <button type="button" aria-label="Previous highlights" aria-controls="home-highlights-track" disabled={bounds.start} onClick={() => move(-1)}>←</button>
            <button type="button" aria-label="Next highlights" aria-controls="home-highlights-track" disabled={bounds.end} onClick={() => move(1)}>→</button>
          </div>
        </div>
      </div>
      <div className={styles.track} id="home-highlights-track" ref={track} role="region" aria-label="Featured highlight videos" aria-roledescription="carousel" tabIndex={0} onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
        {clips.map((clip, index) => (
          <article className={styles.card} key={clip.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${clips.length}`}>
            <a href={clip.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${clip.title} on YouTube`}>
              <div className={styles.image}>
                <Image src={clip.id === "BUTEgoy3bXo" ? "/images/highlights/we-deserve-lan-thumbnail.webp" : `https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 700px) 85vw, (max-width: 1100px) 44vw, 410px" quality={84} />
                <span className={styles.play} aria-hidden="true">▶</span>
              </div>
              <div className={styles.caption}>
                <h3>{clip.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}

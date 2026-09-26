"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { eventPhotos } from "../data/eventPhotos";
import styles from "./Events.module.css";

export default function EventPhotoCarousel() {
  const [index, setIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const photo = eventPhotos[index];
  const move = (direction: number) => setIndex((current) => (current + direction + eventPhotos.length) % eventPhotos.length);

  return (
    <section aria-label="Past Violet OP events" aria-roledescription="carousel" className={styles.carousel}>
      <figure className={styles.figure}>
        <div
          aria-label="Event photographs. Use left and right arrow keys to change photo."
          className={styles.photoFrame}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { pointerStart.current = null; }}
          onPointerUp={(event) => {
            const start = pointerStart.current;
            pointerStart.current = null;
            if (!start) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
          }}
          tabIndex={0}
        >
          {eventPhotos.map((slide, slideIndex) => (
            <Image alt={slideIndex === index ? slide.alt : ""} aria-hidden={slideIndex !== index} className={styles.photo} draggable={false} fill key={slide.src} loading={slideIndex === 0 ? undefined : "eager"} preload={slideIndex === 0} quality={85} sizes={slide.fit === "contain" ? "(max-width: 760px) 43vw, 405px" : "(max-width: 760px) calc(100vw - 32px), (max-width: 1400px) calc(100vw - 48px), 1352px"} src={slide.src} style={{ objectFit: slide.fit, objectPosition: slide.focalPoint, opacity: slideIndex === index ? 1 : 0 }} />
          ))}
        </div>
        <figcaption className={styles.captionBar}>
          <div aria-atomic="true" aria-live="polite"><span className={styles.eyebrow}>From the community</span><p>{photo.caption}</p></div>
          <div className={styles.controls}>
            <button aria-label="Previous event photo" onClick={() => move(-1)} type="button"><span aria-hidden="true">←</span></button>
            <span className={styles.count} aria-hidden="true">{index + 1} / {eventPhotos.length}</span>
            <button aria-label="Next event photo" onClick={() => move(1)} type="button"><span aria-hidden="true">→</span></button>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

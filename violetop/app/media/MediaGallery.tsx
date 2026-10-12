"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { EventMediaItem } from "../data/pastEvents";
import styles from "./Media.module.css";

type Filter = "photo" | "video" | "poster";
const matches = (item: EventMediaItem, filter: Filter) => filter === "video" ? item.kind === "video" || item.kind === "reel" : item.kind === filter;

export default function MediaGallery({ items, title }: { items: EventMediaItem[]; title: string }) {
  const [filter, setFilter] = useState<Filter>("photo");
  const [visible, setVisible] = useState(24);
  const [selected, setSelected] = useState<EventMediaItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const filtered = items.filter((item) => matches(item, filter)).sort((a, b) => Number(b.kind === "reel") - Number(a.kind === "reel"));
  const selectedIndex = selected ? filtered.findIndex((item) => item.id === selected.id) : -1;
  const move = (delta: number) => setSelected(filtered[(selectedIndex + delta + filtered.length) % filtered.length]);
  const photos = items.filter((item) => item.kind === "photo").length;
  const videos = items.filter((item) => matches(item, "video")).length;
  const posters = items.filter((item) => item.kind === "poster").length;
  const isOpen = selected !== null;

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const close = () => { setSelected(null); opener.current?.focus(); };
  const selectFilter = (next: Filter) => { setFilter(next); setVisible(24); };

  return (
    <section className={styles.gallery} aria-labelledby="gallery-title">
      <div className={styles.galleryHeading}>
        <h2 id="gallery-title">Photos &amp; Videos</h2>
        <div className={styles.filters} role="group" aria-label="Media type">
          <button type="button" aria-pressed={filter === "photo"} onClick={() => selectFilter("photo")}>Photos <span>{photos}</span></button>
          {videos ? <button type="button" aria-pressed={filter === "video"} onClick={() => selectFilter("video")}>Videos & reels <span>{videos}</span></button> : null}
          {posters ? <button type="button" aria-pressed={filter === "poster"} onClick={() => selectFilter("poster")}>Posters <span>{posters}</span></button> : null}
        </div>
      </div>
      <p className={styles.galleryNote}>{filter === "video" ? "Event reels and individual clips. Select one to watch." : "Select a photo to view it in full. Originals are available from each image."}</p>
      <div className={filter === "video" ? styles.videoGrid : styles.photoGrid}>
        {filtered.slice(0, visible).map((item, index) => (
          <button className={filter === "video" ? styles.videoCard : styles.photoButton} type="button" key={item.id} onClick={(event) => { opener.current = event.currentTarget; setSelected(item); }} aria-label={filter === "video" ? `Watch ${item.label}` : `Open ${item.alt}: ${item.label}`}>
            {item.thumbnail ? <Image alt={item.alt ?? title} src={item.thumbnail} width={item.width ?? 640} height={item.height ?? 480} unoptimized /> : <><span className={styles.playIcon} aria-hidden="true">▶</span><span className={styles.videoTitle}><strong>{item.kind === "reel" ? "Event reel" : `Video ${String(index + 1).padStart(2, "0")}`}</strong><small>{item.label}</small></span><span className={styles.videoArrow} aria-hidden="true">↗</span></>}
          </button>
        ))}
      </div>
      <div className={styles.galleryFooter}>
        <p aria-live="polite">Showing {Math.min(visible, filtered.length)} of {filtered.length} {filter === "photo" ? "photos" : filter === "poster" ? "posters" : "videos and reels"}</p>
        {visible < filtered.length ? <button className={styles.loadMore} type="button" onClick={() => setVisible((count) => count + 24)}>Show more <span aria-hidden="true">↓</span></button> : null}
      </div>
      <dialog className={styles.lightbox} ref={dialog} aria-label={`${title} media viewer`} data-lenis-prevent onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
      }}>
        {selected ? <div className={styles.viewer}>
          <div className={styles.viewerBar}><span>{selected.label}</span><button className={styles.close} aria-label="Close media viewer" autoFocus type="button" onClick={close}>×</button></div>
          <div className={styles.viewerStage}>
            {selected.src ? <Image alt={selected.alt ?? title} src={selected.src} width={selected.width ?? 1920} height={selected.height ?? 1280} unoptimized /> : <iframe key={selected.id} title={selected.label} src={`https://drive.google.com/file/d/${selected.id}/preview`} allow="autoplay; fullscreen" allowFullScreen referrerPolicy="no-referrer" />}
          </div>
          <div className={styles.viewerFooter}>
            <div className={styles.viewerControls}><button type="button" aria-label="Previous media" onClick={() => move(-1)}>←</button><span aria-live="polite">{selectedIndex + 1} / {filtered.length}</span><button type="button" aria-label="Next media" onClick={() => move(1)}>→</button></div>
            <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">{selected.src ? "Open original" : "Open in Google Drive"} ↗</a>
          </div>
        </div> : null}
      </dialog>
    </section>
  );
}

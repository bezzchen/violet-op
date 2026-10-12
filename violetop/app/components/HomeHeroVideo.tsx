"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import styles from "../Home.module.css";

const fullVideoUrl = "https://www.youtube.com/watch?v=5A9xqus4ypo";

export default function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [userWantsPlayback, setUserWantsPlayback] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const wantsPlayback = userWantsPlayback ?? !prefersReducedMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    let isInView = false;
    const syncPlayback = () => {
      if (wantsPlayback && isInView && !document.hidden) {
        void video.play().catch(() => { /* Keep the poster and manual play control. */ });
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.1 });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [wantsPlayback, failed]);

  function togglePlayback() {
    const shouldPlay = !isPlaying;
    setUserWantsPlayback(shouldPlay);
    if (shouldPlay) void videoRef.current?.play().catch(() => {});
    else videoRef.current?.pause();
  }

  return (
    <div className={styles.heroMedia}>
      <Image className={styles.heroPoster} alt="Violet OP dancers performing in New York City" fill preload quality={85} sizes="(max-width: 900px) 100vw, 50vw" src="/videos/vop-dance-poster.webp" />
      <video
        ref={videoRef}
        className={styles.heroVideo}
        data-ready={hasFrame && !failed ? "true" : undefined}
        src={wantsPlayback || hasFrame ? "/videos/vop-dance-preview.mp4" : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => { setIsPlaying(true); setHasFrame(true); }}
        onPause={() => setIsPlaying(false)}
        onError={() => { setFailed(true); setIsPlaying(false); }}
      />
      {!failed ? (
        <button type="button" className={styles.previewToggle} onClick={togglePlayback} aria-label={isPlaying ? "Pause video preview" : "Play video preview"}>
          <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
          <span>{isPlaying ? "Pause" : "Play preview"}</span>
        </button>
      ) : null}
      <div className={styles.videoCaption}>
        <p>NYU VOP × LOL <span>Dance film</span></p>
        <h2>Know My Name</h2>
        <a className={styles.watchNow} href={fullVideoUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch now: Know My Name — full dance film on YouTube">
          <span className={styles.watchIcon} aria-hidden="true">▶</span>
          Watch now
          <span className={styles.watchArrow} aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

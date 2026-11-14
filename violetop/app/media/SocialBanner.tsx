"use client";

import Image from "next/image";
import { useState } from "react";
import { socialMedia } from "../data/socialMedia";
import styles from "./SocialBanner.module.css";

export default function SocialBanner() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section className={styles.banner} aria-labelledby="social-heading">
      <header className={styles.intro}>
        <h1 id="social-heading">Find us on your feed.</h1>
      </header>
      <div className={styles.platforms}>
        <section className={styles.instagram} aria-labelledby="instagram-heading">
          <div className={styles.platformHeading}>
            <h3 id="instagram-heading">
              <a className={styles.platformLink} href={socialMedia.instagramUrl} target="_blank" rel="noopener noreferrer">
                <svg className={styles.instagramIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                <span>Instagram</span>
                <span className={styles.handle}>@nyuvioletop</span>
              </a>
            </h3>
          </div>
          <div className={styles.posts}>
            {socialMedia.instagram.map((post) => (
              <a className={styles.post} href={post.url} key={post.url} target="_blank" rel="noopener noreferrer" aria-label={`View Violet OP's ${post.label} ${post.type.toLowerCase()} on Instagram`}>
                <div className={styles.postImage}>
                  <Image src={post.image} alt={post.alt} fill sizes="(max-width: 700px) 82vw, (max-width: 1400px) 32vw, 440px" />
                  <span className={styles.postType}>{post.type === "Reel" ? "▶ Reel" : "Post"}</span>
                </div>
                <div className={styles.postCaption}><time dateTime={post.date}>{post.label}</time></div>
              </a>
            ))}
          </div>
        </section>
        <section className={styles.youtube} aria-labelledby="youtube-heading">
          <div className={styles.platformHeading}>
            <h3 id="youtube-heading">
              <a className={styles.platformLink} href={socialMedia.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <svg className={styles.youtubeIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8Z" />
                  <path fill="white" d="m9.6 15.6 6.3-3.6-6.3-3.6Z" />
                </svg>
                <span>YouTube</span>
                <span className={styles.handle}>@NYUVioletOP</span>
              </a>
            </h3>
          </div>
          <div className={styles.videos}>
            {socialMedia.youtube.map((video) => (
              <article className={styles.video} key={video.id}>
                <div className={styles.videoPreview}>
                  {playing === video.id ? (
                    <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                  ) : (
                    <button className={styles.play} onClick={() => setPlaying(video.id)} aria-label={`Play ${video.title}`}>
                      <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1400px) 48vw, 664px" />
                      <span className={styles.playIcon} aria-hidden="true">▶</span>
                      <span className={styles.duration}>{video.duration}</span>
                    </button>
                  )}
                </div>
                <div className={styles.videoInfo}>
                  <h4>{video.title}</h4>
                  <p>{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

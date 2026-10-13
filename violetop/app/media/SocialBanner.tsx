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
        <p>Clips, community, and everything VOP.</p>
      </header>
      <div className={styles.platforms}>
        <section className={styles.instagram} aria-labelledby="instagram-heading">
          <div className={styles.platformHeading}>
            <h3 id="instagram-heading"><span className={styles.instagramIcon} aria-hidden="true">◎</span> Instagram</h3>
            <a href={socialMedia.instagramUrl} target="_blank" rel="noopener noreferrer">@nyuvioletop <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.posts}>
            {socialMedia.instagram.map((post) => (
              <a className={styles.post} href={post.url} key={post.url} target="_blank" rel="noopener noreferrer" aria-label={`View Violet OP's ${post.label} ${post.type.toLowerCase()} on Instagram`}>
                <div className={styles.postImage}>
                  <Image src={post.image} alt={post.alt} fill sizes="(max-width: 700px) 210px, (max-width: 1000px) 30vw, 240px" />
                  <span className={styles.postType}>{post.type === "Reel" ? "▶ Reel" : "Post"}</span>
                </div>
                <div className={styles.postCaption}><time dateTime={post.date}>{post.label}</time><span aria-hidden="true">↗</span></div>
              </a>
            ))}
          </div>
        </section>
        <section className={styles.youtube} aria-labelledby="youtube-heading">
          <div className={styles.platformHeading}>
            <h3 id="youtube-heading"><span className={styles.youtubeIcon} aria-hidden="true">▶</span> YouTube</h3>
            <a href={socialMedia.youtubeUrl} target="_blank" rel="noopener noreferrer">View channel <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.videos}>
            {socialMedia.youtube.map((video) => (
              <article className={`${styles.video} ${playing === video.id ? styles.videoActive : ""}`} key={video.id}>
                <div className={styles.videoPreview}>
                  {playing === video.id ? (
                    <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                  ) : (
                    <button className={styles.play} onClick={() => setPlaying(video.id)} aria-label={`Play ${video.title}`}>
                      <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 700px) calc(100vw - 72px), (max-width: 1000px) 42vw, 230px" />
                      <span className={styles.playIcon} aria-hidden="true">▶</span>
                      <span className={styles.duration}>{video.duration}</span>
                    </button>
                  )}
                </div>
                <div className={styles.videoInfo}>
                  <h4>{video.title}</h4>
                  <p>{video.description}</p>
                  <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title} on YouTube`}>Watch on YouTube ↗</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

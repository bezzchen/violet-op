import Link from "next/link";
import BrandLogo from "./BrandLogo";
import styles from "./Footer.module.css";

type FooterProps = { pinned?: boolean };

export default function Footer({ pinned = false }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${pinned ? styles.pinned : ""}`}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <Link aria-label="Violet OP home" className={styles.brand} href="/">
            <BrandLogo />
            <span>Violet <strong>OP</strong></span>
          </Link>
          <p>Collegiate esports and community at New York University.</p>
        </div>
        <nav aria-label="Footer navigation" className={styles.links}>
          <div>
            <span>Explore</span>
            <Link href="/#teams">Teams</Link>
            <Link href="/events">Events</Link>
            <Link href="/about-us">About</Link>
            <Link href="/highlights">Highlights</Link>
          </div>
          <div>
            <span>Get involved</span>
            <Link href="/join-us">Join Us</Link>
            <a href="https://discord.gg/MAmXcrkADb" rel="noopener noreferrer" target="_blank">Discord ↗</a>
            <a href="https://www.instagram.com/nyuvioletop/" rel="noopener noreferrer" target="_blank">Instagram ↗</a>
            <a href="https://www.youtube.com/@NYUVioletOP" rel="noopener noreferrer" target="_blank">YouTube ↗</a>
          </div>
          <div>
            <span>Organization</span>
            <Link href="/eboard">E-Board</Link>
            <a href="https://docs.google.com/document/d/1dpVfc-GSqrE4rZi5tDV2NwRhCl0gWfAB0cEIPOFGKIk/edit?usp=sharing" rel="noopener noreferrer" target="_blank">Constitution ↗</a>
          </div>
        </nav>
      </div>
      <div className={styles.base}>
        <span>© {new Date().getFullYear()} Violet OP</span>
        <span>Made for the players, organizers, and community behind the game.</span>
      </div>
    </footer>
  );
}

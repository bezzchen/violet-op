import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import EventArchive from "./EventArchive";
import styles from "./Media.module.css";

export const metadata: Metadata = {
  title: "Event Media | Violet OP",
  description: "Photos, videos, and reels from past Violet OP events at NYU, including the Gen.G fireside chat, LEVEL UP, and VCT watch party.",
};

export default function MediaPage() {
  return (
    <PageShell>
      <div className={styles.page}>
        <Link className={styles.back} href="/events">← Events</Link>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>Violet OP media</span>
          <h1>Past events.</h1>
          <p>Photos, videos, and the people who made it happen.</p>
        </header>
        <EventArchive />
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/PageShell";
import EventArchive from "./EventArchive";
import SocialBanner from "./SocialBanner";
import styles from "./Media.module.css";

export const metadata: Metadata = {
  title: "Media | Violet OP",
  description: "Instagram posts, YouTube videos, and photos from Violet OP events at NYU.",
};

export default function MediaPage() {
  return (
    <PageShell>
      <div className={styles.page}>
        <Link className={styles.back} href="/events">← Events</Link>
        <SocialBanner />
        <div className={styles.sectionHeading}>
          <h2>Past Events</h2>
        </div>
        <EventArchive />
      </div>
    </PageShell>
  );
}

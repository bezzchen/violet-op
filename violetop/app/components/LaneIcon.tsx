import type { LaneRole } from "../data/laneRoles";
import styles from "./LaneIcon.module.css";

/**
 * Riot's official League position icon for a lane (the files in public/images/lanes), drawn as a
 * mask so it takes the surrounding colour through currentColor and keeps its two-tone frame.
 */
export default function LaneIcon({ className, role }: { className?: string; role: LaneRole }) {
  const mask = `url("/images/lanes/${role.toLowerCase()}.svg")`;
  return (
    <span
      aria-hidden="true"
      className={className ? `${styles.icon} ${className}` : styles.icon}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

import type { ReactNode } from "react";
import type { LaneRole } from "../data/laneRoles";

// Inline SVGs keep these icons request-free and crisp at any size; they take the
// surrounding colour through currentColor.
const lanePaths: Record<LaneRole, ReactNode> = {
  Top: (
    <>
      <path d="M6 13.5l6-6 6 6" />
      <path d="M12 7.5V18" />
    </>
  ),
  Jungle: (
    <>
      <path d="M12 4l6 11H6z" />
      <path d="M12 15v4.5" />
    </>
  ),
  Middle: <path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z" />,
  Bottom: (
    <>
      <path d="M6 10.5l6 6 6-6" />
      <path d="M12 6V16.5" />
    </>
  ),
  Support: <path d="M12 4l6 2.4v5c0 3.8-2.6 6.6-6 7.6-3.4-1-6-3.8-6-7.6v-5z" />,
};

export default function LaneIcon({ className, role }: { className?: string; role: LaneRole }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      {lanePaths[role]}
    </svg>
  );
}

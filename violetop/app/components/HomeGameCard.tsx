"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import styles from "../Home.module.css";

type Props = {
  children: ReactNode;
  className: string;
  id: string;
};

/** Use the actual pointer so mouse feedback also works in touch-capable previews. */
export default function HomeGameCard({ children, className, id }: Props) {
  const [hovered, setHovered] = useState(false);

  function followPointer(event: PointerEvent<HTMLElement>) {
    setHovered(event.pointerType === "mouse");
  }

  return (
    <div
      className={styles.gameCardInteraction}
      onPointerCancel={() => setHovered(false)}
      onPointerDown={followPointer}
      onPointerEnter={followPointer}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={followPointer}
    >
      <article className={className} data-hovered={hovered ? "true" : undefined} id={id}>
        {children}
      </article>
    </div>
  );
}

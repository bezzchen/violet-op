import Image from "next/image";
import type { MemberImage } from "../data/siteContent";
import styles from "./MemberPortrait.module.css";

type Props = {
  name: string;
  image?: MemberImage;
};

export default function MemberPortrait({ name, image }: Props) {
  return (
    <div className={`${styles.frame} ${image?.fit === "contain" ? styles.contain : ""}`}>
      {image ? (
        <Image
          alt={`Portrait of ${name}`}
          fill
          quality={70}
          sizes="(max-width: 600px) 45vw, (max-width: 1000px) 28vw, 19vw"
          src={image.src}
          style={{ objectFit: image.fit ?? "cover", objectPosition: image.focalPoint ?? "50% 0%" }}
        />
      ) : (
        <span aria-hidden="true">{name.split(" ").map((part) => part[0]).join("")}</span>
      )}
    </div>
  );
}

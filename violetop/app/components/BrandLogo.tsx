import Image from "next/image";

export const brandLogoSrc = "/images/vop-logo.png";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      alt=""
      className={className}
      height={802}
      priority={priority}
      src={brandLogoSrc}
      width={896}
    />
  );
}

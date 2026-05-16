import Link from "next/link";

const navLinkClass =
  "font-label-caps text-label-caps text-on-surface/80 transition-colors hover:text-primary";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-[100] border-b border-white/5 bg-background/70 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-grid-margin py-4">
        <Link
          href="/#hero-section"
          className="font-label-caps text-label-caps text-primary tracking-[0.2em]"
        >
          VIOLET OP
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          <Link href="/#hero-section" className={navLinkClass}>
            About
          </Link>
          <Link
            href="/#valorant-section"
            className={`${navLinkClass} hover:text-tertiary`}
          >
            Valorant
          </Link>
          <Link href="/#lol-section" className={navLinkClass}>
            League
          </Link>
          <Link href="/#join-section" className={navLinkClass}>
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
}

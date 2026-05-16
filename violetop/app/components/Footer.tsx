export function Footer() {
  return (
    <footer className="relative z-10 mt-stack-xl w-full border-t border-white/10 bg-surface-container-low/60 py-stack-md backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-grid-margin md:flex-row md:gap-gutter">
        <p className="font-label-caps text-label-caps text-center text-on-surface-variant md:text-left">
          © {new Date().getFullYear()} New York University · Violet Operator
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-6"
          aria-label="Footer"
        >
          <a
            href="https://www.nyu.edu/"
            className="font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-primary"
            rel="noopener noreferrer"
            target="_blank"
          >
            NYU
          </a>
          <a
            href="/#join-section"
            className="font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-tertiary"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

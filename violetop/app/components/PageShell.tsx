"use client";

import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

type PageShellProps = { children: ReactNode };

export default function PageShell({ children }: PageShellProps) {
  return (
    <>
      <Header />
      <main
        className="page-scroll-container relative z-10 text-on-background selection:bg-primary selection:text-on-primary"
        id="main-content"
        tabIndex={-1}
      >
        {children}
        <Footer pinned={false} />
      </main>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { leagueTeams, valorantTeams } from "../data/siteContent";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link aria-label="Violet OP home" className={styles.brand} href="/" onClick={closeMenu}>
            <Image alt="" height={42} priority src="/images/logo.avif" width={42} />
            <span>Violet <strong>OP</strong></span>
          </Link>

          <nav aria-label="Main navigation" className={styles.desktopNav}>
            <Link href="/#teams">Teams</Link>
            <Link href="/events">Events</Link>
            <Link href="/about-us">About</Link>
          </nav>

          <div className={styles.actions}>
            <Link className={styles.join} href="/join-us" onClick={closeMenu}>
              Join Violet OP <span aria-hidden="true">↗</span>
            </Link>
            <button
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={styles.menuButton}
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav aria-label="Mobile navigation" className={styles.mobileNav} id="mobile-navigation">
            <Link href="/#teams" onClick={closeMenu}>Teams</Link>
            <Link href="/events" onClick={closeMenu}>Events</Link>
            <Link href="/about-us" onClick={closeMenu}>About</Link>
            <div className={styles.mobileTeams}>
              <div>
                <span>VALORANT</span>
                {valorantTeams.map((team) => (
                  <Link href={team.href} key={team.href} onClick={closeMenu}>{team.name}</Link>
                ))}
              </div>
              <div>
                <span>League of Legends</span>
                {leagueTeams.map((team) => (
                  <Link href={team.href} key={team.href} onClick={closeMenu}>{team.name}</Link>
                ))}
              </div>
            </div>
            <Link className={styles.mobileJoin} href="/join-us" onClick={closeMenu}>See joining paths ↗</Link>
          </nav>
        ) : null}
      </header>
    </>
  );
}

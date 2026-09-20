"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { leagueTeams, valorantTeams } from "../data/siteContent";
import BrandLogo from "./BrandLogo";
import styles from "./Header.module.css";

const gameGroups = [
  { name: "VALORANT", href: "/teams/valorant", image: "/images/valologo.webp", teams: valorantTeams },
  { name: "League of Legends", href: "/teams/league-of-legends", image: "/images/lollogo.avif", teams: leagueTeams },
];

export type HeaderPalette = {
  name: string;
  style: CSSProperties & Record<`--${string}`, string>;
};

type HeaderProps = {
  homeAnimation?: {
    current: HeaderPalette;
    incoming: HeaderPalette;
    wiping: boolean;
  };
};

export default function Header({ homeAnimation }: HeaderProps = {}) {
  const pathname = usePathname();
  const isHomeHeader = Boolean(homeAnimation);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileTeamsOpen, setMobileTeamsOpen] = useState(false);
  const [homeSolid, setHomeSolid] = useState(false);
  const teamsTriggerRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTeamsTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  const closeMenus = useCallback(() => {
    setTeamsOpen(false);
    setMenuOpen(false);
    setMobileTeamsOpen(false);
  }, []);

  useEffect(() => {
    if (!teamsOpen && !menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (teamsOpen) {
        setTeamsOpen(false);
        teamsTriggerRef.current?.focus();
      } else if (mobileTeamsOpen) {
        setMobileTeamsOpen(false);
        mobileTeamsTriggerRef.current?.focus();
      } else {
        setMenuOpen(false);
        mobileTriggerRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      const inside = [teamsTriggerRef, megaRef, mobileTriggerRef, mobileNavRef]
        .some((ref) => ref.current?.contains(event.target as Node));
      if (!inside) closeMenus();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [teamsOpen, menuOpen, mobileTeamsOpen, closeMenus]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 900px)");
    breakpoint.addEventListener("change", closeMenus);
    return () => breakpoint.removeEventListener("change", closeMenus);
  }, [closeMenus]);

  useEffect(() => {
    if (!isHomeHeader) return;

    const updateSurface = () => {
      const hero = document.getElementById("hero-section");
      const headerHeight = window.matchMedia("(max-width: 900px)").matches ? 64 : 72;
      setHomeSolid(!hero || hero.getBoundingClientRect().bottom <= headerHeight);
    };

    updateSurface();
    window.addEventListener("scroll", updateSurface, { passive: true });
    window.addEventListener("resize", updateSurface);
    return () => {
      window.removeEventListener("scroll", updateSurface);
      window.removeEventListener("resize", updateSurface);
    };
  }, [isHomeHeader]);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <header className={`${styles.header} ${homeAnimation ? styles.homeHeader : ""} ${homeAnimation && homeSolid ? styles.homeSolid : ""}`}>
        {homeAnimation ? (
          <div className={`${styles.homeAccentCanvas} ${homeAnimation.wiping ? styles.homeWiping : ""}`} aria-hidden="true">
            <div className={`${styles.homeAccentTheme} ${styles.homeAccentCurrent}`} data-theme={homeAnimation.current.name.toLowerCase()} style={homeAnimation.current.style}>
              <span className={styles.homeAccentLogo} />
              <span className={styles.homeAccentJoin} />
            </div>
            <div className={`${styles.homeAccentTheme} ${styles.homeAccentIncoming}`} data-theme={homeAnimation.incoming.name.toLowerCase()} style={homeAnimation.incoming.style}>
              <span className={styles.homeAccentLogo} />
              <span className={styles.homeAccentJoin} />
            </div>
          </div>
        ) : null}
        <div className={styles.inner}>
          <Link aria-label="Violet OP home" className={styles.brand} href="/" onClick={closeMenus}>
            <BrandLogo priority />
            <span>Violet <strong>OP</strong></span>
          </Link>

          <nav aria-label="Main navigation" className={styles.desktopNav}>
            <button
              aria-controls="teams-mega-menu"
              aria-expanded={teamsOpen}
              className={styles.teamsTrigger}
              onClick={() => { setMenuOpen(false); setMobileTeamsOpen(false); setTeamsOpen((open) => !open); }}
              ref={teamsTriggerRef}
              type="button"
            >
              Teams <span aria-hidden="true" className={styles.chevron} />
            </button>
            <div aria-label="Teams" className={styles.megaMenu} hidden={!teamsOpen} id="teams-mega-menu" ref={megaRef} role="region">
              {gameGroups.map((group) => (
                <section aria-label={`${group.name} teams`} className={styles.megaGroup} key={group.href}>
                  <div className={styles.gameHeading}>
                    <Image alt="" height={42} quality={75} src={group.image} width={42} />
                    <div>
                      <h2>{group.name}</h2>
                      <Link className={styles.overviewLink} href={group.href} onClick={closeMenus}>Explore All Teams <span aria-hidden="true">→</span></Link>
                    </div>
                  </div>
                  <div className={styles.teamGrid}>
                    {group.teams.map((team) => (
                      <Link className={styles.teamLink} href={team.href} key={team.href} onClick={closeMenus}>
                        <Image alt="" className={team.name === "VOP Black" ? styles.darkCrest : undefined} height={30} quality={75} src={team.image} width={30} />
                        <span>{team.name}</span>
                        <span aria-hidden="true" className={styles.teamArrow}>↗</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <Link aria-current={pathname === "/events" ? "page" : undefined} href="/events" onClick={closeMenus}>Events</Link>
            <Link aria-current={pathname === "/about-us" ? "page" : undefined} href="/about-us" onClick={closeMenus}>About</Link>
            <Link aria-current={pathname === "/join-us" ? "page" : undefined} href="/join-us" onClick={closeMenus}>Join Us</Link>
          </nav>

          <div className={styles.actions}>
            <a
              aria-label="Join the Violet OP Discord"
              className={styles.join}
              href="https://discord.gg/MAmXcrkADb"
              onClick={closeMenus}
              rel="noopener noreferrer"
              target="_blank"
            >
              Discord <span aria-hidden="true">↗</span>
            </a>
            <button
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={styles.menuButton}
              onClick={() => { setTeamsOpen(false); setMenuOpen((open) => !open); setMobileTeamsOpen(false); }}
              ref={mobileTriggerRef}
              type="button"
            >
              <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
            </button>
          </div>
        </div>

        <nav aria-label="Mobile navigation" className={styles.mobileNav} hidden={!menuOpen} id="mobile-navigation" ref={mobileNavRef}>
          <button
            aria-controls="mobile-team-groups"
            aria-expanded={mobileTeamsOpen}
            className={styles.mobileTeamsTrigger}
            onClick={() => setMobileTeamsOpen((open) => !open)}
            ref={mobileTeamsTriggerRef}
            type="button"
          >
            Teams <span aria-hidden="true" className={styles.chevron} />
          </button>
          <div className={styles.mobileTeams} hidden={!mobileTeamsOpen} id="mobile-team-groups">
            {gameGroups.map((group) => (
              <section className={styles.mobileGame} key={group.href}>
                <Link className={styles.mobileOverview} href={group.href} onClick={closeMenus}>
                  {group.name} <span aria-hidden="true">→</span>
                </Link>
                <div className={styles.mobileTeamGrid}>
                  {group.teams.map((team) => (
                    <Link href={team.href} key={team.href} onClick={closeMenus}>
                      <Image alt="" className={team.name === "VOP Black" ? styles.darkCrest : undefined} height={26} quality={75} src={team.image} width={26} />
                      {team.name}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <Link aria-current={pathname === "/events" ? "page" : undefined} className={styles.mobilePageLink} href="/events" onClick={closeMenus}>Events</Link>
          <Link aria-current={pathname === "/about-us" ? "page" : undefined} className={styles.mobilePageLink} href="/about-us" onClick={closeMenus}>About</Link>
          <Link aria-current={pathname === "/join-us" ? "page" : undefined} className={styles.mobilePageLink} href="/join-us" onClick={closeMenus}>Join Us</Link>
          <a
            aria-label="Join the Violet OP Discord"
            className={`${styles.mobileJoin} ${homeAnimation?.wiping ? styles.mobileJoinWiping : ""}`}
            href="https://discord.gg/MAmXcrkADb"
            onClick={closeMenus}
            rel="noopener noreferrer"
            target="_blank"
          >
            {homeAnimation ? (
              <>
                <span aria-hidden="true" className={`${styles.mobileJoinPalette} ${styles.mobileJoinCurrent}`} style={homeAnimation.current.style} />
                <span aria-hidden="true" className={`${styles.mobileJoinPalette} ${styles.mobileJoinIncoming}`} style={homeAnimation.incoming.style} />
                <span className={styles.mobileJoinLabel}>Discord ↗</span>
              </>
            ) : "Discord ↗"}
          </a>
        </nav>
      </header>
    </>
  );
}

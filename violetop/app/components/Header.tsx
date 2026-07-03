"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { leagueTeams, mainNav, valorantTeams } from "../data/siteContent";

const visibleHeaderNav = mainNav
  .slice(1, 4)
  .filter((item) => item.href !== "/events");

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header fixed left-0 top-0 z-50 grid w-full grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 bg-surface/55 px-4 py-4 backdrop-blur-xl md:flex md:justify-between md:px-grid-margin">
      <Link className="flex min-w-0 items-center gap-3" href="/" onClick={closeMenu}>
        <Image
          alt="NYU Violet OP logo"
          className="site-header-logo h-10 w-10 rounded-full border border-primary/30 object-cover"
          height={40}
          loading="eager"
          src="/images/logo.avif"
          width={40}
        />
        <span className="site-header-brand hidden font-headline-md text-headline-md font-bold text-on-surface md:inline">
          Violet OP
        </span>
      </Link>

      <nav className="site-header-nav hidden h-full items-center gap-8 md:flex">
        <div className="mega-menu-trigger relative flex h-full items-center">
          <Link
            className="site-header-link flex items-center gap-1 font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-on-surface"
            href="/#valorant-section"
          >
            Teams{" "}
            <span aria-hidden="true" className="inline-block -translate-y-1">
              ⌄
            </span>
          </Link>

          <div className="mega-menu absolute left-1/2 top-full pt-4 -translate-x-1/2">
            <div className="site-header-mega-panel flex w-[500px] gap-12 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-8 shadow-2xl">
              <div className="flex-1">
                <h4 className="site-header-mega-title mb-4 border-b border-tertiary/20 pb-2 font-label-caps text-label-caps text-tertiary">
                  Valorant
                </h4>
                <ul className="space-y-3">
                  {valorantTeams.map((team) => (
                    <li key={team.name}>
                      <Link
                        className="site-header-mega-link font-body-md text-on-surface/70 transition-colors hover:text-tertiary"
                        href={team.href}
                      >
                        {team.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1">
                <h4 className="site-header-mega-title mb-4 border-b border-primary/20 pb-2 font-label-caps text-label-caps text-primary">
                  League of Legends
                </h4>
                <ul className="space-y-3">
                  {leagueTeams.map((team) => (
                    <li key={team.name}>
                      <Link
                        className="site-header-mega-link font-body-md text-on-surface/70 transition-colors hover:text-primary"
                        href={team.href}
                      >
                        {team.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {visibleHeaderNav.map((item) => (
          <Link
            className="site-header-link font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-on-surface"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link
        className="site-header-join op-clip justify-self-center bg-primary-container px-5 py-2 font-label-caps text-label-nav text-white transition-all hover:brightness-110 active:scale-95 md:justify-self-auto md:px-6"
        href="/join-us"
        onClick={closeMenu}
      >
        Join Us
      </Link>

      <button
        aria-controls="mobile-menu"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="glass-panel op-clip flex h-10 w-10 items-center justify-center justify-self-end border border-outline-variant text-on-surface transition-all hover:border-primary hover:text-primary md:hidden"
        onClick={() => setIsMenuOpen((open) => !open)}
        type="button"
      >
        <span className="relative h-4 w-5" aria-hidden="true">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${
              isMenuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-5 bg-current transition-transform ${
              isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`absolute left-4 right-4 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded border border-outline-variant bg-surface-container-lowest p-4 shadow-2xl transition-all md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        id="mobile-menu"
      >
        <nav className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-3 border-b border-tertiary/20 pb-2 font-label-caps text-label-caps text-tertiary">
                Valorant
              </h4>
              <ul className="space-y-2">
                {valorantTeams.map((team) => (
                  <li key={team.name}>
                    <Link
                      className="font-body-md text-sm text-on-surface/75 transition-colors hover:text-tertiary"
                      href={team.href}
                      onClick={closeMenu}
                    >
                      {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 border-b border-primary/20 pb-2 font-label-caps text-label-caps text-primary">
                League
              </h4>
              <ul className="space-y-2">
                {leagueTeams.map((team) => (
                  <li key={team.name}>
                    <Link
                      className="font-body-md text-sm text-on-surface/75 transition-colors hover:text-primary"
                      href={team.href}
                      onClick={closeMenu}
                    >
                      {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-2 border-t border-outline-variant pt-3">
            {visibleHeaderNav.map((item) => (
              <Link
                className="font-label-caps text-label-caps text-on-surface/75 transition-colors hover:text-on-surface"
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

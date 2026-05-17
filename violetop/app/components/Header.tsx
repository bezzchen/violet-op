import Image from "next/image";

const valorantTeams = ["White", "Purple", "Black", "Gamechangers"];
const leagueTeams = ["Baron", "Elder"];

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-surface/55 px-4 py-4 backdrop-blur-xl md:px-grid-margin">
      <a className="flex items-center gap-3" href="">
        <Image
          alt="NYU Violet OP logo"
          className="h-10 w-10 rounded-full border border-primary/30 object-cover"
          height={40}
          priority
          src="/images/logo.avif"
          width={40}
        />
        <span className="font-headline-md text-headline-md font-bold text-on-surface">
          Violet OP
        </span>
      </a>

      <nav className="hidden h-full items-center gap-8 md:flex">
        <div className="mega-menu-trigger relative flex h-full items-center">
          <a
            className="flex items-center gap-1 font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-on-surface"
            href=""
          >
            Teams{" "}
            <span aria-hidden="true" className="inline-block -translate-y-1">
              ⌄
            </span>
          </a>

          <div className="mega-menu absolute left-1/2 top-full pt-4 -translate-x-1/2">
            <div className="glass-panel flex w-[500px] gap-12 rounded-xl bg-surface-container-lowest/90 p-8 shadow-2xl">
              <div className="flex-1">
                <h4 className="mb-4 border-b border-tertiary/20 pb-2 font-label-caps text-label-caps text-tertiary">
                  Valorant
                </h4>
                <ul className="space-y-3">
                  {valorantTeams.map((team) => (
                    <li key={team}>
                      <a
                        className="font-body-md text-on-surface/70 transition-colors hover:text-tertiary"
                        href=""
                      >
                        {team}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1">
                <h4 className="mb-4 border-b border-primary/20 pb-2 font-label-caps text-label-caps text-primary">
                  League of Legends
                </h4>
                <ul className="space-y-3">
                  {leagueTeams.map((team) => (
                    <li key={team}>
                      <a
                        className="font-body-md text-on-surface/70 transition-colors hover:text-primary"
                        href=""
                      >
                        {team}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <a
          className="font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-on-surface"
          href=""
        >
          About Us
        </a>
        <a
          className="font-label-caps text-label-caps text-on-surface/70 transition-colors hover:text-on-surface"
          href=""
        >
          Events
        </a>
      </nav>

      <div className="flex items-center gap-3 md:gap-6">
        <a
          className="op-clip bg-primary-container px-5 py-2 font-label-caps text-label-nav text-white transition-all hover:brightness-110 active:scale-95 md:px-6"
          href=""
        >
          Join Us
        </a>
      </div>
    </header>
  );
}

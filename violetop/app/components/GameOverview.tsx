import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";
import Header from "./Header";
import { HomeGameArtwork, HomeGameLogo } from "./HomeGameArtwork";
import { joinContent, leagueTeams, valorantTeams } from "../data/siteContent";
import styles from "./GameOverview.module.css";

type Game = "valorant" | "league";

export default function GameOverview({ game }: { game: Game }) {
  const isValorant = game === "valorant";
  const teams = isValorant ? valorantTeams : leagueTeams;
  const title = isValorant ? "VALORANT" : "League of Legends";
  const description = isValorant
    ? "Meet Violet OP’s four VALORANT rosters, from selective competition to open-rank team play. Explore each team’s people, requirements, and current joining status."
    : "Meet VOP Elder and VOP Baron, Violet OP’s open-rank League of Legends rosters. Explore the players, team identity, and current joining path for each squad.";

  return (
    <>
      <Header />
      <main className={styles.main} id="main-content" tabIndex={-1}>
        <div className={styles.wrap}>
          <nav aria-label="Games" className={styles.gameNav}>
            <Link aria-current={isValorant ? "page" : undefined} href="/teams/valorant">VALORANT</Link>
            <Link aria-current={!isValorant ? "page" : undefined} href="/teams/league-of-legends">League of Legends</Link>
          </nav>

          <section aria-labelledby="game-title" className={styles.hero} data-game={game}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Violet OP / Teams</p>
              <h1 className={styles.gameTitle} id="game-title"><span className="sr-only">{title}</span><HomeGameLogo game={game} /></h1>
              <p>{description}</p>
              <Link className={styles.secondaryLink} href="/#teams">← All Teams</Link>
            </div>
            <div className={styles.heroArt}>
              <HomeGameArtwork alignment={isValorant ? "xMidYMid" : "xMaxYMid"} game={game} />
            </div>
          </section>

          <section aria-labelledby="rosters-title" className={styles.rosters}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>Choose a Team</p>
                <h2 id="rosters-title">{isValorant ? "VALORANT Rosters" : "League of Legends Rosters"}</h2>
              </div>
              <Link className={styles.secondaryLink} href="/join-us#player-paths">Recruitment Details ↗</Link>
            </div>
            <div className={styles.teamGrid}>
              {teams.map((team) => {
                const recruitment = joinContent.paths.find((path) => path.name === team.name);
                return (
                  <Link className={styles.teamCard} href={team.href} key={team.href}>
                    <div className={styles.teamCardTop}>
                      <span className={styles.crest}><Image alt="" fill quality={75} sizes="76px" src={team.image} /></span>
                      <span className={styles.status}>{recruitment?.filled ? "Roster Filled" : "Applications Listed Open"}</span>
                    </div>
                    <span className={styles.tier}>{team.tier}</span>
                    <h3>{team.name}</h3>
                    <p>{team.summary}</p>
                    <span className={styles.cardAction}>View Team Profile <span aria-hidden="true">→</span></span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

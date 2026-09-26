type Game = "valorant" | "league";
type ArtworkAlignment = "xMidYMin" | "xMidYMid" | "xMaxYMin" | "xMaxYMid";

/** Crop the supplied compositions before fitting them to the panel. Their
 * embedded titles stay outside the viewBox at every responsive aspect ratio. */
export function HomeGameArtwork({ game, alignment }: { game: Game; alignment?: ArtworkAlignment }) {
  const valorant = game === "valorant";
  return (
    <svg aria-hidden="true" focusable="false" height="100%" width="100%" viewBox={valorant ? "0 0 985 811" : "0 0 1435 1080"} preserveAspectRatio={`${alignment ?? (valorant ? "xMidYMin" : "xMaxYMin")} slice`}>
      <image href={`/images/home-games/${valorant ? "valorant-agents" : "league-champions"}.webp`} width={valorant ? 1440 : 1920} height={valorant ? 811 : 1080} />
    </svg>
  );
}

/** Existing transparent official marks, framed to their visible alpha bounds. */
export function HomeGameLogo({ game }: { game: Game }) {
  const valorant = game === "valorant";
  return (
    <svg aria-hidden="true" focusable="false" viewBox={valorant ? "119 251 742 478" : "29 368 3189 1360"}>
      <image href={valorant ? "/images/valologo.webp" : "/images/lollogo.avif"} width={valorant ? 980 : 3331} height={valorant ? 980 : 2160} />
    </svg>
  );
}

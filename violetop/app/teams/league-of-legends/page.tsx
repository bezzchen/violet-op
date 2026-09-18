import type { Metadata } from "next";
import GameOverview from "../../components/GameOverview";

export const metadata: Metadata = {
  title: "League of Legends Teams | Violet OP",
  description: "Meet VOP Elder and VOP Baron, the Violet OP League of Legends rosters.",
};

export default function LeagueTeamsPage() {
  return <GameOverview game="league" />;
}

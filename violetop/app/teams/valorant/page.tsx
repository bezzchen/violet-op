import type { Metadata } from "next";
import GameOverview from "../../components/GameOverview";

export const metadata: Metadata = {
  title: "VALORANT Teams | Violet OP",
  description: "Meet the Violet OP VALORANT rosters and find each team’s profile and current joining status.",
};

export default function ValorantTeamsPage() {
  return <GameOverview game="valorant" />;
}

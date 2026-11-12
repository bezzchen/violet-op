import type { Metadata } from "next";
import WorldsLive from "./WorldsLive";
export const metadata: Metadata = { title: "Worlds Live | Violet OP", description: "Pick a side. Vote live with Violet OP at the Worlds watch party. No account needed." };
export default function WorldsPage() { return <WorldsLive mode="fan" />; }

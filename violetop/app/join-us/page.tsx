import type { Metadata } from "next";
import JoinUsClient from "./JoinUsClient";
import { siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `Join Us | ${siteMeta.title}`,
  description: siteMeta.description,
};

export default function JoinUsPage() {
  return <JoinUsClient />;
}

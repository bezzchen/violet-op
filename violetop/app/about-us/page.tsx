import type { Metadata } from "next";
import AboutUsClient from "./AboutUsClient";
import { siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `About Us | ${siteMeta.title}`,
  description: siteMeta.description,
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}

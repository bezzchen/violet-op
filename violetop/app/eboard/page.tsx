import type { Metadata } from "next";
import EboardClient from "./EboardClient";
import { siteMeta } from "../data/siteContent";

export const metadata: Metadata = {
  title: `E-Board | ${siteMeta.title}`,
  description: "Internal E-Board meeting schedule for NYU Violet OP.",
};

export default function EboardPage() {
  return <EboardClient />;
}

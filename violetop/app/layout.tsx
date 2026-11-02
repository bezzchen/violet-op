import type { Metadata } from "next";
import { Archivo_Black, Outfit } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import SwirlBackground from "./components/SwirlBackground";
import { siteMeta } from "./data/siteContent";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo-black", display: "swap" });

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`dark ${outfit.variable} ${archivoBlack.variable}`} lang="en">
      <body>
        <SmoothScroll />
        <SwirlBackground />
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}

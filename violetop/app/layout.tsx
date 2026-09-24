import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import SwirlBackground from "./components/SwirlBackground";
import { siteMeta } from "./data/siteContent";

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
    <html className="dark" lang="en">
      <body>
        <SmoothScroll />
        <SwirlBackground />
        {children}
      </body>
    </html>
  );
}

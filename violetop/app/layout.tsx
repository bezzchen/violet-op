import type { Metadata } from "next";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}

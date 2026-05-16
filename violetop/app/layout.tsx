import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Violet OP | NYU Esports",
  description:
    "NYU Violet OP esports teams, rosters, events, and community opportunities.",
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

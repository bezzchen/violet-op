import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono, Sora } from "next/font/google";
import { Header } from "./components/Header";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Violet OP | NYU Esports",
  description: "NYU Esports — Violet OP competitive programs and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sora.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background selection:bg-primary selection:text-on-primary">
        <Header />
        {children}
      </body>
    </html>
  );
}

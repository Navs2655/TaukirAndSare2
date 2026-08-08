import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Amiri } from "next/font/google";
import "@/styles/globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Navigation from "@/components/layout/Navigation";
import InvitationGate from "@/components/layout/InvitationGate";
import GlobalStarField from "@/components/layout/GlobalStarField";
import Preloader from "@/components/layout/Preloader";
import FilmGrain from "@/components/ui/FilmGrain";
import AmbientAudioToggle from "@/components/ui/AmbientAudioToggle";
import { AudioProvider } from "@/components/layout/AudioProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taukir & Sara | Nikah — 10th November 2026",
  description:
    "Join us in celebrating the Nikah of Taukir & Sara on 10th November 2026 at Jumma Masjid, Junadeesa.",
  openGraph: {
    title: "Taukir & Sara's Nikah",
    description: "10th November 2026 • Jumma Masjid, Junadeesa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taukir & Sara's Nikah",
    description: "10th November 2026 • Jumma Masjid, Junadeesa",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${amiri.variable}`}>
      <body className="font-body bg-background text-champagne antialiased">
        <Preloader />
        <FilmGrain />
        <SmoothScrollProvider>
          <GlobalStarField />
          <AudioProvider>
            <InvitationGate navigation={<Navigation />}>
              {children}
            </InvitationGate>
            <AmbientAudioToggle />
          </AudioProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

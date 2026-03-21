import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Max_Adis | Innovation & Formation au Bénin",
  description:
    "Max_Adis — Vente de composants électroniques Arduino, ESP32, capteurs au Bénin. Formations pratiques en robotique et domotique à Porto-Novo.",
  keywords: [
    "Arduino",
    "ESP32",
    "composants électroniques",
    "Bénin",
    "Porto-Novo",
    "robotique",
    "domotique",
    "IoT",
    "formation",
  ],
  authors: [{ name: "Max_Adis" }],
  openGraph: {
    title: "Max_Adis | Composants Électroniques & Formations au Bénin",
    description:
      "Vente de composants électroniques et formations pratiques en robotique au Bénin",
    url: "https://maxadis.vercel.app",
    siteName: "Max_Adis",
    locale: "fr_BJ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Max_Adis | Innovation & Formation au Bénin",
    description:
      "Composants électroniques et formations en robotique au Bénin",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "ZY730XKdf0vB5QXe8v94cLBBGV7ERzgIrwCjHpZQ-eg",
  },
}

export const viewport: Viewport = {
  themeColor: "#D90429",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}

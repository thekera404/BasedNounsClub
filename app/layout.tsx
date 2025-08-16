// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Based Nouns Club - Free Minting on Base",
  description:
    "Mint your exclusive NFT from the Based Nouns Club collection. Each token is unique and grants you access to special community benefits.",
  generator: "v0.app",
  openGraph: {
    title: "Based Nouns Club - Free Minting on Base",
    description:
      "Mint your exclusive NFT from the Based Nouns Club collection. Each token is unique and grants you access to special community benefits.",
    images: ["/og-image.png"],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://based-nouns-club.vercel.app/"

  return (
    <html lang="en">
      <head>
        {/* Fonts */}
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>

        {/* ✅ Farcaster Mini App Embed */}
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "1",
            imageUrl: `${baseUrl}/embed-image.png`,
            button: {
              title: "🎨 Free Mint",
              action: {
                type: "launch_miniapp",
                url: baseUrl,
                name: "OCK NFT Mint",
                splashImageUrl: `${baseUrl}/splash-image.png`,
                splashBackgroundColor: "#0B0B0F",
              },
            },
          })}
        />

        {/* ✅ Backward compatibility with Frames */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="/embed-image.png" />
        <meta name="fc:frame:button:1" content="🎨 Free Mint" />
        <meta name="fc:frame:button:1:action" content="launch_miniapp" />
      </head>
      <body>{children}</body>
    </html>
  )
}

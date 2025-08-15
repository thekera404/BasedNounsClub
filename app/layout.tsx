import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "OCK NFT Mint - Free Minting on Base",
  description:
    "Mint your exclusive NFT from the OCK collection. Each token is unique and grants you access to special community benefits and future drops.",
  generator: "v0.app",
  openGraph: {
    title: "OCK NFT Mint - Free Minting on Base",
    description:
      "Mint your exclusive NFT from the OCK collection. Each token is unique and grants you access to special community benefits.",
    images: ["/og-image.png"],
    type: "website",
  },
  other: {
    // Farcaster Mini App embed configuration
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/embed-image.png`,
      button: {
        title: "🎨 Free Mint",
        action: {
          type: "launch_miniapp",
          url: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com",
          name: "OCK NFT Mint",
          splashImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/splash-image.png`,
          splashBackgroundColor: "#0B0B0F",
        },
      },
    }),
    // Backward compatibility
    "fc:frame": "vNext",
    "fc:frame:image": "/embed-image.png",
    "fc:frame:button:1": "🎨 Free Mint",
    "fc:frame:button:1:action": "launch_miniapp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

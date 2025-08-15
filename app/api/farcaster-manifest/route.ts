import { NextResponse } from "next/server"

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "REPLACE_WITH_YOUR_HEADER",
      payload: "REPLACE_WITH_YOUR_PAYLOAD",
      signature: "REPLACE_WITH_YOUR_SIGNATURE",
    },
    miniapp: {
      version: "1",
      name: "OCK NFT Mint",
      iconUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/app-icon.png`,
      splashImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/splash-image.png`,
      splashBackgroundColor: "#0B0B0F",
      homeUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com",
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/api/webhook`,
      subtitle: "Free NFT minting on Base",
      description:
        "Mint your exclusive NFT from the OCK collection. Each token is unique and grants you access to special community benefits and future drops.",
      screenshotUrls: [
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/screenshot1.png`,
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/screenshot2.png`,
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/screenshot3.png`,
      ],
      primaryCategory: "nft",
      tags: ["nft", "mint", "base", "free", "collection"],
      heroImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/hero-image.png`,
      tagline: "Free NFT minting on Base",
      ogTitle: "OCK NFT Mint - Free Minting on Base",
      ogDescription:
        "Mint your exclusive NFT from the OCK collection. Each token is unique and grants you access to special community benefits.",
      ogImageUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/og-image.png`,
    },
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

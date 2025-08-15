# OCK NFT Mint - Publishing Guide

## Steps to Publish Your Farcaster Mini App

### 1. Generate Account Association
1. Visit the [Mini App Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest) in Warpcast
2. Connect your Farcaster account
3. Enter your domain name
4. Copy the generated `accountAssociation` object
5. Replace the placeholder values in `farcaster.json` and `app/api/farcaster-manifest/route.ts`

### 2. Update Domain URLs
Replace all instances of `your-domain.com` with your actual domain in:
- `public/.well-known/farcaster.json`
- `app/layout.tsx` 
- `app/api/farcaster-manifest/route.ts`

### 3. Set Environment Variables
Add to your Vercel project:
\`\`\`
NEXT_PUBLIC_BASE_URL=https://your-domain.com
\`\`\`

### 4. Deploy to Vercel
1. Push your code to GitHub
2. Connect to Vercel
3. Deploy your app
4. Verify the manifest is accessible at `https://your-domain.com/.well-known/farcaster.json`

### 5. Test Your Mini App
1. Use the [Mini App Debug Tool](https://farcaster.xyz/~/developers/mini-apps/debug)
2. Enter your domain URL
3. Test wallet connection and minting functionality
4. Verify embed sharing works correctly

### 6. Submit for Review
1. Visit [Warpcast Developers](https://farcaster.xyz/~/developers)
2. Add your Mini App
3. Complete the verification process
4. Submit for app store review

### 7. Share Your App
- Create embeds by sharing your app URL in Farcaster casts
- Use the Universal Link format: `https://farcaster.xyz/miniapps/{id}/{name}`
- Promote through social channels and community

## Required Assets Checklist
- ✅ App icon (512x512px)
- ✅ Splash screen image
- ✅ Hero banner (1200x630px)
- ✅ Embed preview image (600x400px, 3:2 ratio)
- ✅ Screenshots (3 images showing key features)
- ✅ OG image for social sharing

## Testing Checklist
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] Embed meta tags present in HTML
- [ ] Wallet connection works on Base mainnet
- [ ] NFT minting functionality works
- [ ] App loads properly in Farcaster clients
- [ ] Sharing creates proper embed cards
- [ ] All images load correctly

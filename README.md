# Farcaster NFT Mint Mini App

A Farcaster Mini App that allows users to mint NFT rewards directly from within Farcaster clients.

## Features

- 🎨 **NFT Minting**: Direct integration with your NFT smart contract
- 📱 **Mobile Responsive**: Optimized for mobile and desktop viewing
- 🔗 **Farcaster Integration**: Uses official Farcaster Mini App SDK
- 💰 **Free Minting**: Supports gas-sponsored or free minting
- ⚡ **Real-time Updates**: Live supply tracking and transaction status

## Setup Instructions

### 1. Prerequisites

- Node.js 22.11.0 or higher
- A deployed NFT smart contract
- Farcaster account with Developer Mode enabled

### 2. Installation

\`\`\`bash
npm install
\`\`\`

### 3. Configuration

1. **Update Contract Details** in `components/nft-contract.ts`:
   \`\`\`typescript
   export const NFT_CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"
   export const NFT_CONTRACT_ABI = [/* Your contract ABI */]
   \`\`\`

2. **Environment Variables** (create `.env.local`):
   \`\`\`
   NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   \`\`\`

3. **NFT Metadata**: Replace the placeholder image in the main component with your NFT preview.

### 4. Development

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your Mini App.

### 5. Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings
4. Add environment variables in Vercel dashboard

### 6. Farcaster Integration

1. Enable Developer Mode in Farcaster
2. Test your Mini App URL in Farcaster
3. Submit for review when ready for public use

## Customization

### Contract Integration

The app uses ethers.js for blockchain interaction. Key files:
- `components/nft-contract.ts` - Contract interface and utilities
- `lib/farcaster-wallet.ts` - Wallet connection management

### UI Customization

- Modify `app/page.tsx` for layout changes
- Update colors and styling using Tailwind CSS
- Replace NFT preview image with your artwork

### Minting Logic

The minting function in `app/page.tsx` handles:
- Quantity selection (1-10 NFTs)
- Price calculation and display
- Transaction execution and status updates
- Error handling and user feedback

## Important Notes

- **Replace Mock Data**: Update contract address, ABI, and RPC URL
- **Test Thoroughly**: Test on testnets before mainnet deployment
- **Gas Optimization**: Consider gas sponsorship for better UX
- **Security**: Validate all user inputs and handle errors gracefully

## Support

For issues with Farcaster Mini Apps, visit the [official documentation](https://miniapps.farcaster.xyz/docs).

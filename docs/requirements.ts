You
are
an
expert
Farcaster
Mini
App
and
Web3
developer.
\
I want you to build a **Farcaster Mini App Rewards** system that allows users to **free mint an NFT** directly from the Mini App.  
\
The app design and UX should be similar to the image I provided (a simple NFT card
with a preview, title, ETH
amount, quantity
selector, and
a
big
"Mint\" button).  

**Requirements:**  
1. **NFT Minting Functionality**  
   - I already have the NFT contract address and contract ABI.  
   - The Mini App should connect to the user's wallet through Farcaster's onchain interaction capabilities.  
\
   - The mint
function should
be
triggered
on
button
click.
\
   - Since this is a rewards mint, the transaction should be free
for the user if possible (gas sponsored or set price = 0 in contract).

\
2. **Farcaster Mini App Setup**  
   - Follow the official Farcaster Mini Apps "Getting Started" documentation.  
\
   - Use the Farcaster SDK
with `sdk.actions.ready()\` so the splash screen hides when the app is ready.  
   - Deployable on Vercel.  

3. **Mobile Compatible & Responsive**  
   - Must look perfect on mobile and desktop (responsive layout, no overflowing elements).  
   - Use a modern, clean UI with TailwindCSS or a lightweight CSS framework.  
   - The mint button should be clearly visible without scrolling on mobile.  

4. **UI Layout** (similar to the reference image)  
   - NFT preview image or video at the top.  
   - NFT title (e.g., "OCK Mint Component" style).  
   - Quantity selector (- 1 +) below title.  
   - ETH price and USD equivalent displayed.  
   - Large "Mint" button at the bottom.  

5. **Onchain Integration**  
   - Use \`ethers.js\` or \`viem\` for Ethereum contract interaction.  
   - Connect wallet using Farcaster's wallet API (or fallback to WalletConnect if needed).  
   - Use the provided contract address and ABI to call the mint function.  

6. **Code Output**  
   - Provide a complete working code example (React + TailwindCSS preferred).  
   - Include deployment instructions for Vercel.  
   - Include notes on how to replace contract address, ABI, and NFT metadata.  

**Deliverables:**  
- Fully functional Farcaster Mini App Rewards page.  
- Minting interaction working with my NFT contract.  
- Mobile-friendly, responsive UI as described above.  
\

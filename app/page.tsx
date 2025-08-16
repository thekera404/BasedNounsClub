"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { sdk } from "@farcaster/frame-sdk"

const NFT_CONTRACT_ADDRESS = "0xf10c1C1290018e328B1Cb8745F4eE800a6fF2DC5"
const BASE_MAINNET_CHAIN_ID = "0x2105" // 8453 in hex
const BASE_MAINNET_RPC = "https://mainnet.base.org"

const NFT_CONTRACT_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "ERC721EnumerableForbiddenBatchMint", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "ERC721InvalidOwner", type: "error" },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "ERC721OutOfBoundsIndex",
    type: "error",
  },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }], name: "OwnableInvalidOwner", type: "error" },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "approved", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "string", name: "newBaseURI", type: "string" }],
    name: "BaseURISet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "FreeMint",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "MetadataLocked", type: "event" },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "bool", name: "active", type: "bool" }],
    name: "MintActiveSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "quantity", type: "uint256" },
    ],
    name: "OwnerMint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "freeMint", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "lockMetadata", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "metadataLocked",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "quantity", type: "uint256" },
    ],
    name: "ownerMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newBaseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "active", type: "bool" }],
    name: "setMintActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export default function App() {
  const [minting, setMinting] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [switchingNetwork, setSwitchingNetwork] = useState(false)
  const [totalSupply, setTotalSupply] = useState(0)
  const [maxSupply, setMaxSupply] = useState(299)
  const [userHasMinted, setUserHasMinted] = useState(false)
  const [loadingContractData, setLoadingContractData] = useState(false)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async () => {
        await checkWalletConnection()
        if (isCorrectNetwork) fetchContractData()
      })
      window.ethereum.on("chainChanged", async () => {
        await checkNetwork()
        if (isCorrectNetwork) fetchContractData()
      })
    }
  }, [isCorrectNetwork])

  const initializeApp = async () => {
    try {
      await checkWalletConnection()
      await checkNetwork()
      if (isCorrectNetwork) {
        await fetchContractData()
      }
      await sdk.actions.ready()
      setAppReady(true)

    } catch (error) {
      console.error("Error initializing app:", error)
      await sdk.actions.ready()
    }
  }

  useEffect(() => {
    initializeApp()
  }, [])

  const fetchContractData = async () => {
    if (!window.ethereum || !isWalletConnected || !isCorrectNetwork) return

    try {
      setLoadingContractData(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

      const [currentSupply, maxSupplyFromContract] = await Promise.all([contract.totalSupply(), contract.MAX_SUPPLY()])

      setTotalSupply(Number(currentSupply))
      setMaxSupply(Number(maxSupplyFromContract))

      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        console.log("[v0] Checking if user has minted for address:", accounts[0])
        const hasMinted = await contract.hasMinted(accounts[0])
        console.log("[v0] Contract hasMinted response:", hasMinted)
        setUserHasMinted(hasMinted)
        console.log("[v0] Updated userHasMinted state to:", hasMinted)
      }
    } catch (error) {
      console.error("Error fetching contract data:", error)
    } finally {
      setLoadingContractData(false)
    }
  }

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        setIsWalletConnected(accounts.length > 0)
        if (accounts.length > 0) {
          await checkNetwork()
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const isCorrect = chainId === BASE_MAINNET_CHAIN_ID
      setIsCorrectNetwork(isCorrect)
      if (isCorrect) {
        fetchContractData()
      }
    } catch (error) {
      console.error("Error checking network:", error)
    }
  }

  const switchToBaseMainnet = async () => {
    try {
      setSwitchingNetwork(true)
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_MAINNET_CHAIN_ID }],
      })
      setIsCorrectNetwork(true)
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BASE_MAINNET_CHAIN_ID,
                chainName: "Base Mainnet",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [BASE_MAINNET_RPC],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          })
          setIsCorrectNetwork(true)
        } catch (addError) {
          console.error("Error adding Base mainnet:", addError)
          alert("Failed to add Base mainnet to wallet.")
        }
      } else {
        console.error("Error switching to Base mainnet:", switchError)
        alert("Failed to switch to Base mainnet.")
      }
    } finally {
      setSwitchingNetwork(false)
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install a wallet.")
        return
      }

      await window.ethereum.request({ method: "eth_requestAccounts" })
      setIsWalletConnected(true)
      await checkNetwork()
      if (isCorrectNetwork){
        fetchContractData()
      }

    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet.")
    }
  }

  const mintNFT = async () => {
    try {
      if (!window.ethereum) {
        alert("Please connect a wallet.")
        return
      }

      if (!isCorrectNetwork) {
        alert("Please switch to Base mainnet to mint.")
        return
      }

      setMinting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

      const tx = await contract.freeMint()

      await tx.wait()
      alert("Mint successful!")
      fetchContractData()
    } catch (error) {
      console.error(error)
      alert("Mint failed.")
    } finally {
      setMinting(false)
    }
  }

  const getButtonText = () => {
    if (!isWalletConnected) return "Connect Wallet"
    if (!isCorrectNetwork) return switchingNetwork ? "Switching Network..." : "Switch to Base"
    if (loadingContractData) return "Loading..."
    if (totalSupply >= maxSupply) return "Sold Out"
    if (userHasMinted) {
      console.log("[v0] Button showing 'Already Minted' because userHasMinted is:", userHasMinted)
      return "Already Minted"
    }
    if (minting) return "Minting..."
    return "Free Mint"
  }

  const getButtonAction = () => {
    if (!isWalletConnected) return connectWallet
    if (!isCorrectNetwork) return switchToBaseMainnet
    if (totalSupply >= maxSupply || userHasMinted) return () => {}
    return mintNFT
  }

  const isButtonDisabled = () => {
    return minting || switchingNetwork || loadingContractData || totalSupply >= maxSupply || userHasMinted
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0F] to-[#15151F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0F0F17] rounded-2xl shadow-2xl border border-[#1F1F2A] p-4">
        <div className="aspect-square rounded-xl overflow-hidden border border-[#2A2A3A] mb-4">
          <img src="/nft.gif" alt="NFT Preview" className="object-cover w-full h-full" />
        </div>

        <h2 className="text-lg font-semibold mb-3 text-center">Based Nouns Club</h2>

        <p className="text-gray-400 text-sm text-center mb-4 leading-relaxed">
          Mint your exclusive NFT from the Based Nouns Club collection. Each user can mint only 1 NFT. Each token is unique and
          grants you access to special community benefits and future drops.
        </p>

        {isWalletConnected && isCorrectNetwork && (
          <div className="mb-4 p-3 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg">
            <p className="text-center text-sm">
              <span className="text-white font-semibold">{totalSupply}</span>
              <span className="text-gray-400"> / {maxSupply} minted</span>
            </p>
          </div>
        )}

        {isWalletConnected && !isCorrectNetwork && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-400 text-xs text-center">Please switch to Base mainnet to mint your NFT</p>
          </div>
        )}

        <button
          onClick={getButtonAction()}
          disabled={isButtonDisabled()}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            isButtonDisabled() ? "bg-gray-600 cursor-not-allowed" : "bg-[#0052FF] hover:bg-[#003ECC]"
          }`}
        >
          {getButtonText()}
        </button>

        <div className="mt-4 flex justify-center">
          <a
            href="https://opensea.io/collection/based-nouns-club-557426338"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg hover:bg-[#2A2A34] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-400"
            >
              <path
                d="M45 0C69.8514 0 90 20.1486 90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0Z"
                fill="currentColor"
              />
              <path
                d="M22.2011 46.512L22.3952 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                fill="white"
              />
              <path
                d="M74.38 49.9149V52.8137C74.38 53.0801 74.2783 53.3281 74.1304 53.4906C73.1803 54.5804 71.4615 56.7013 68.832 56.7013C65.0295 56.7013 63.0052 53.7662 61.9185 51.9756C61.0611 50.6037 60.2989 49.4121 59.0418 49.4121C57.7847 49.4121 57.0225 50.6037 56.165 51.9756C55.0784 53.7662 53.054 56.7013 49.2516 56.7013C45.4491 56.7013 43.4248 53.7662 42.3381 51.9756C41.4807 50.6037 40.7185 49.4121 39.4614 49.4121C38.2043 49.4121 37.4421 50.6037 36.5847 51.9756C35.498 53.7662 33.4737 56.7013 29.6712 56.7013C27.0417 56.7013 25.3229 54.5804 24.3728 53.4906C24.2249 53.3281 24.1232 53.0801 24.1232 52.8137V49.9149C24.1232 49.6347 24.3496 49.4083 24.6298 49.4083H74.8734C75.1536 49.4083 75.38 49.6347 75.38 49.9149H74.38Z"
                fill="white"
              />
            </svg>
            <span className="text-sm text-gray-300">View on OpenSea</span>
          </a>
        </div>
      </div>
    </div>
  )
}

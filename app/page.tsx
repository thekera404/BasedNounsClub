"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { sdk } from "@farcaster/frame-sdk"

const NFT_CONTRACT_ADDRESS = "0xf10c1C1290018e328B1Cb8745F4eE800a6fF2DC5"
const BASE_MAINNET_CHAIN_ID = "0x2105" // 8453 in hex
const BASE_MAINNET_RPC = "https://mainnet.base.org"

const NFT_CONTRACT_ABI = [ /* your ABI unchanged */ ]

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
    initializeApp()
  }, [])

  // setup event listeners
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = async () => {
      await checkWalletConnection()
      if (isCorrectNetwork) fetchContractData()
    }

    const handleChainChanged = async () => {
      await checkNetwork()
      if (isCorrectNetwork) fetchContractData()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [isCorrectNetwork])

  const initializeApp = async () => {
    try {
      await checkWalletConnection()
      await checkNetwork()
    } catch (error) {
      console.error("Error initializing app:", error)
    } finally {
      await sdk.actions.ready() // ✅ always called
      setAppReady(true)
    }
  }

  const fetchContractData = async () => {
    if (!window.ethereum || !isWalletConnected || !isCorrectNetwork) return

    try {
      setLoadingContractData(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider)

      const [currentSupply, maxSupplyFromContract] = await Promise.all([
        contract.totalSupply(),
        contract.MAX_SUPPLY(),
      ])

      setTotalSupply(Number(currentSupply))
      setMaxSupply(Number(maxSupplyFromContract))

      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        const hasMinted = await contract.hasMinted(accounts[0])
        setUserHasMinted(hasMinted)
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
        await fetchContractData()
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
                nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
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
    if (userHasMinted) return "Already Minted"
    if (minting) return "Minting..."
    return "Free Mint"
  }

  const getButtonAction = () => {
    if (!isWalletConnected) return connectWallet
    if (!isCorrectNetwork) return switchToBaseMainnet
    if (totalSupply >= maxSupply || userHasMinted) return () => {}
    return mintNFT
  }

  const isButtonDisabled = () =>
    minting || switchingNetwork || loadingContractData || totalSupply >= maxSupply || userHasMinted

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0F] to-[#15151F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0F0F17] rounded-2xl shadow-2xl border border-[#1F1F2A] p-4">
        <div className="aspect-square rounded-xl overflow-hidden border border-[#2A2A3A] mb-4">
          <img src="/nft.gif" alt="NFT Preview" className="object-cover w-full h-full" />
        </div>

        <h2 className="text-lg font-semibold mb-3 text-center">Based Nouns Club</h2>

        <p className="text-gray-400 text-sm text-center mb-4 leading-relaxed">
          Mint your exclusive NFT from the Based Nouns Club collection. Each user can mint only 1 NFT.
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
      </div>
    </div>
  )
}

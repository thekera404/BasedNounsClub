// NFT Contract Integration Utilities
import { ethers } from "ethers"

// Replace these with your actual contract details
export const NFT_CONTRACT_ADDRESS = "0xf10c1C1290018e328B1Cb8745F4eE800a6fF2DC5"

export const NFT_CONTRACT_ABI = [
  // Standard ERC721 functions
  "function mint(address to, uint256 quantity) external payable",
  "function totalSupply() external view returns (uint256)",
  "function maxSupply() external view returns (uint256)",
  "function mintPrice() external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Mint(address indexed to, uint256 quantity, uint256 totalCost)",
]

export interface NFTContractData {
  totalSupply: number
  maxSupply: number
  mintPrice: string
  userBalance: number
}

export class NFTContract {
  private contract: ethers.Contract
  private provider: ethers.Provider

  constructor(provider: ethers.Provider, signerOrAddress?: ethers.Signer | string) {
    this.provider = provider
    this.contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signerOrAddress || provider)
  }

  async getContractData(userAddress?: string): Promise<NFTContractData> {
    try {
      const [totalSupply, maxSupply, mintPrice, userBalance] = await Promise.all([
        this.contract.totalSupply(),
        this.contract.maxSupply(),
        this.contract.mintPrice(),
        userAddress ? this.contract.balanceOf(userAddress) : Promise.resolve(0),
      ])

      return {
        totalSupply: Number(totalSupply),
        maxSupply: Number(maxSupply),
        mintPrice: ethers.formatEther(mintPrice),
        userBalance: Number(userBalance),
      }
    } catch (error) {
      console.error("Failed to fetch contract data:", error)
      throw error
    }
  }

  async mint(to: string, quantity: number, value?: string): Promise<ethers.TransactionResponse> {
    try {
      const tx = await this.contract.mint(to, quantity, {
        value: value ? ethers.parseEther(value) : 0,
      })
      return tx
    } catch (error) {
      console.error("Minting failed:", error)
      throw error
    }
  }

  async estimateGas(to: string, quantity: number, value?: string): Promise<bigint> {
    try {
      return await this.contract.mint.estimateGas(to, quantity, {
        value: value ? ethers.parseEther(value) : 0,
      })
    } catch (error) {
      console.error("Gas estimation failed:", error)
      throw error
    }
  }
}

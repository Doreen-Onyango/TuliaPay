import { ethers } from "ethers";
import TuliaProtocolABI from "../abis/TuliaProtocol.json";

// We read from the NEXT_PUBLIC variables
const PROTOCOL_ADDRESS = process.env.NEXT_PUBLIC_TULIA_PROTOCOL_ADDRESS || "";

/**
 * Prompts the user to connect their wallet (e.g., MetaMask).
 * Returns the ethers provider, the signer (the user's wallet), and the user's address.
 */
export async function connectWallet() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("No crypto wallet found. Please install MetaMask.");
  }

  try {
    // A Web3Provider wraps a standard Web3 provider, which
    // is what MetaMask injects as window.ethereum into each page
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error) {
    console.error("User rejected request or other Error:", error);
    throw error;
  }
}

/**
 * Returns a readable instance of the Tulia Protocol contract.
 * Uses a default read-only provider (no wallet required) or the user's connected wallet.
 */
export async function getTuliaProtocolContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  if (!PROTOCOL_ADDRESS) {
    throw new Error("TULIA_PROTOCOL_ADDRESS environment variable is missing.");
  }

  let defaultProvider = signerOrProvider;

  // If no wallet is passed, fallback to a read-only provider using RPC_URL
  if (!defaultProvider) {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) {
      throw new Error("No RPC_URL provided for read-only connections.");
    }
    defaultProvider = new ethers.JsonRpcProvider(rpcUrl);
  }

  const protocolContract = new ethers.Contract(
    PROTOCOL_ADDRESS,
    TuliaProtocolABI,
    defaultProvider
  );

  return protocolContract;
}

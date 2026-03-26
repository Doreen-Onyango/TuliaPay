import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ------------------------------------------------------------------------
// WEB3 SETUP (Relayer Wallet on fhEVM Network)
// ------------------------------------------------------------------------
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545"; // Local hardhat by default
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Admin account 0 directly from Hardhat
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Update after deployment

const provider = new ethers.JsonRpcProvider(RPC_URL);
const relayerWallet = new ethers.Wallet(PRIVATE_KEY, provider);

// We need the ABI for TuliaProtocol (just the functions we need as the Relayer)
const TULIA_ABI = [
  "function verifyHuman(uint256 nullifierHash, uint256[8] calldata proof) external",
  "function sendEncrypted(address to, bytes calldata encryptedAmount, bytes calldata inputProof) external",
];
const protocolContract = new ethers.Contract(CONTRACT_ADDRESS, TULIA_ABI, relayerWallet);

// ------------------------------------------------------------------------
// ENDPOINTS
// ------------------------------------------------------------------------

/**
 * World ID Verification Route
 * In production, the backend receives the proof from IDKit, verifies it against 
 * Worldcoin's Developer Portal, and then initiates the on-chain execution so the user 
 * doesn't pay gas for the initial registration.
 */
app.post("/api/verify", async (req, res) => {
  const { nullifier_hash, proof, action, credential_type } = req.body;

  try {
    // 1. (Optional) Make API Call to Worldcoin Developer endpoint
    /*
    const verifyRes = await fetch(`https://developer.worldcoin.org/api/v1/verify/${process.env.APP_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nullifier_hash, proof, action, ... })
    });
    if (!verifyRes.ok) throw new Error("World ID Verification failed");
    */

    // 2. Mocking verification for now. 
    console.log("Verified World ID Proof for nullifier:", nullifier_hash);

    // 3. Register user on-chain using the Relayer wallet (Subsidizing Gas)
    // Here we'd convert the proof to uint256[8] format for Solidity
    const tx = await protocolContract.verifyHuman(nullifier_hash, [0,0,0,0,0,0,0,0]);
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Gasless Relaying (Meta-Transactions)
 * Allows users to perform FHE transactions without holding ETH on the privacy chain.
 */
app.post("/api/relay/send", async (req, res) => {
  // Production Note: The user should sign an EIP-712 payload proving they initiated 
  // this. The proxy verifies the signature before submitting to fhEVM.
  const { recipientAddress, encryptedAmountBytes, inputProofBytes } = req.body;

  try {
    // Relayer submits the transaction using their gas
    const tx = await protocolContract.sendEncrypted(
      recipientAddress, 
      encryptedAmountBytes, 
      inputProofBytes
    );
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    console.error("Relayer send error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start the relayer server
app.listen(PORT, () => {
  console.log(`🚀 TuliaPay Relayer API listening on port ${PORT}`);
});

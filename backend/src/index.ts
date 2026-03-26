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
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const relayerWallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Unified ABI for TuliaProtocol (including Identity & Balance modules)
const TULIA_ABI = [
  "function verifyAndRegister(uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external",
  "function deposit() external payable",
  "function sendEncrypted(address to, bytes calldata encryptedAmount, bytes calldata inputProof) external",
];
const protocolContract = new ethers.Contract(CONTRACT_ADDRESS, TULIA_ABI, relayerWallet);

// ------------------------------------------------------------------------
// ENDPOINTS
// ------------------------------------------------------------------------

/**
 * World ID Verification Route
 * Relayer submits the proof on-chain to register the human (Subsidizing Gas)
 */
app.post("/api/verify", async (req, res) => {
  const { nullifier_hash, proof, root } = req.body;

  try {
    console.log("Verified World ID Proof for nullifier:", nullifier_hash);

    // Register user on-chain using the Relayer wallet
    // We use a dummy root/proof if not provided for testing, but real proof should be uint256[8]
    const tx = await protocolContract.verifyAndRegister(
        root || 1, 
        nullifier_hash, 
        proof || [0,0,0,0,0,0,0,0]
    );
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Gasless Relaying (Meta-Transactions)
 * Relayer subsidizes the FHE compute cost for validated humans.
 */
app.post("/api/relay/send", async (req, res) => {
  const { recipientAddress, encryptedAmountBytes, inputProofBytes } = req.body;

  try {
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

app.listen(PORT, () => {
  console.log(`🚀 TuliaPay Relayer API listening on port ${PORT}`);
});

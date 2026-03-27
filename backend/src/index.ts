import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { signRequest } from "@worldcoin/idkit-core/signing";

// Load default .env and then override with .env.local if present (local dev)
dotenv.config();
dotenv.config({ path: ".env.local" });

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
const PRIVATE_KEY =
  process.env.RELAYER_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const relayerWallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Unified ABI for TuliaProtocol (including Identity & Balance modules)
const TULIA_ABI = [
  "function verifyAndRegister(uint256 root, uint256 nullifierHash, uint256[8] calldata proof) external",
  "function deposit() external payable",
  "function sendEncrypted(address to, bytes calldata encryptedAmount, bytes calldata inputProof) external",
];
const protocolContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  TULIA_ABI,
  relayerWallet,
);

// ------------------------------------------------------------------------
// WORLD ID / IDKIT INTEGRATION
// ------------------------------------------------------------------------

const WORLD_APP_ID = process.env.WORLD_APP_ID;
const WORLD_RP_ID = process.env.WORLD_RP_ID;
const RP_SIGNING_KEY = process.env.RP_SIGNING_KEY;

if (!WORLD_APP_ID || !WORLD_RP_ID || !RP_SIGNING_KEY) {
  console.warn(
    "[World ID] WORLD_APP_ID, WORLD_RP_ID, or RP_SIGNING_KEY env vars are missing. IDKit flows will fail until these are configured.",
  );
}

/**
 * Generate RP signature for an IDKit request.
 * Never expose RP_SIGNING_KEY to the client.
 */
app.post("/api/world/sign-request", async (req, res) => {
  try {
    const { action } = req.body as { action?: string };

    if (!WORLD_APP_ID || !WORLD_RP_ID || !RP_SIGNING_KEY) {
      return res.status(500).json({
        error: "World ID env vars not configured on backend",
      });
    }

    if (!action || typeof action !== "string") {
      return res.status(400).json({ error: "Missing action" });
    }

    const { sig, nonce, createdAt, expiresAt } = signRequest(
      action,
      RP_SIGNING_KEY,
    );

    return res.json({
      app_id: WORLD_APP_ID,
      rp_id: WORLD_RP_ID,
      action,
      rp_context: {
        rp_id: WORLD_RP_ID,
        nonce,
        created_at: createdAt,
        expires_at: expiresAt,
        signature: sig,
      },
    });
  } catch (err: any) {
    console.error("[World ID] sign-request error:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate World ID RP signature" });
  }
});

/**
 * Verify an IDKit result with World Developer API.
 * Forwards payload as-is to POST /api/v4/verify/{rp_id}
 */
app.post("/api/world/verify", async (req, res) => {
  try {
    if (!WORLD_RP_ID) {
      return res.status(500).json({
        error: "WORLD_RP_ID env var not configured on backend",
      });
    }

    const worldRes = await fetch(
      `https://developer.world.org/api/v4/verify/${WORLD_RP_ID}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await worldRes.json();

    if (!worldRes.ok) {
      console.error("[World ID] verification failed:", data);
      return res.status(worldRes.status).json(data);
    }

    return res.json(data);
  } catch (err: any) {
    console.error("[World ID] verify proxy error:", err);
    return res
      .status(500)
      .json({ error: "Failed to verify World ID proof with Developer API" });
  }
});

// ------------------------------------------------------------------------
// GASLESS RELAY ENDPOINTS (unchanged)
// ------------------------------------------------------------------------

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
      inputProofBytes,
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

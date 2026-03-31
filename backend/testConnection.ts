import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import TuliaProtocolABI from "./abis/TuliaProtocol.json";

// Load .env.local if it exists
if (fs.existsSync(path.resolve(__dirname, ".env.local"))) {
  dotenv.config({ path: path.resolve(__dirname, ".env.local") });
} else {
  dotenv.config();
}

async function testConnection() {
  console.log("=========================================");
  console.log("🔄 Testing Backend Blockchain Connection");
  console.log("=========================================\n");

  const rpcUrl = process.env.RPC_URL;
  const contractAddress = process.env.TULIA_PROTOCOL_ADDRESS || process.env.CONTRACT_ADDRESS;

  if (!rpcUrl) {
    console.error("❌ ERROR: RPC_URL is missing in .env.local");
    return;
  }
  if (!contractAddress) {
    console.error("❌ ERROR: TULIA_PROTOCOL_ADDRESS is missing in .env.local");
    return;
  }

  try {
    // 1. Test RPC Connection
    console.log(`📡 Connecting to RPC Provider: ${rpcUrl}`);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    console.log(`✅ Successfully connected to Network (Chain ID: ${network.chainId})`);
    console.log(`🧱 Current Block Number: ${blockNumber}\n`);

    // 2. Test Contract Connection
    console.log(`📜 Connecting to Contract at: ${contractAddress}`);
    const protocolContract = new ethers.Contract(contractAddress, TuliaProtocolABI, provider);

    // Call a random view function that doesn't cost gas to verify ABI & Address
    try {
      const owner = await protocolContract.owner();
      console.log(`✅ Contract Owner is: ${owner}\n`);
      console.log("🎉 Connection is PERFECT!");
    } catch (contractErr: any) {
      console.error("❌ Connected to network, but failed reading from the contract.");
      console.error("   Make sure the address in .env.local is exactly right and on the correct network.");
      console.error("   Error details:", contractErr.message);
    }
    
  } catch (providerErr: any) {
    console.error("\n❌ RPC Connection Failed!");
    console.error(providerErr.message);
  }
}

testConnection();

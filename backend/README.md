# ⛽ TuliaPay Backend Relayer

The **TuliaPay Backend Relayer** is a high-performance Express.js service that acts as a bridge between the [Frontend](../frontend) and the [Smart Contracts](../smart-contracts). It handles World ID verification orchestration and facilitates gasless meta-transactions.

---

## ⚡ Core Functions

1. **Gasless Processing:** Subsidizes transaction costs for users by wrapping their encrypted payloads and submitting them via a protocol-owned wallet.
2. **World ID Verification:** Validates user-provided proofs from IDKit before allowing any state-changing protocol interactions.
3. **FHE Proxying:** Safely routes encrypted transaction blobs directly to the fhEVM blockchain without any intermediate storage or analysis.

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js:** v20.x or higher
- **Ethers.js:** v6.x (for provider interaction)

### 🛠️ Local Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Create a `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - **Key Fields:**
     - `RELAYER_PRIVATE_KEY`: Private key of the wallet that will pay the gas for meta-transactions.
     - `WORLD_ID_APP_ID`: Your official World ID app identifier.
     - `RPC_URL`: The RPC endpoint for the fhEVM blockchain.

3. **Launch the Server:**
   ```bash
   npm run dev
   # Server will start on Port 3001 (default)
   ```

---

## 🌐 API Endpoints

### `POST /api/verify`
- **Goal:** Verify a World ID proof.
- **Body:** `{ proof, signal, action_id, root, nullifier_hash }`
- **Output:** `{ success: boolean, registrationTxHash?: string }`

### `POST /api/relay/send`
- **Goal:** Subsidize an FHE encrypted transaction.
- **Body:** `{ to, data, signature }`
- **Output:** `{ success: boolean, txHash: string }`

---

## 🔐 Privacy Guarantee

- **No Data Retention:** The relayer does not store transaction logs containing encrypted amounts or balances.
- **Stateless Verification:** All verification is handled in real-time.

---

## 📄 License

This component is licensed under the **BSD-3-Clause-Clear License**.

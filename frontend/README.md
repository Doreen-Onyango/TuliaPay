# 🖥️ TuliaPay Frontend Dashboard

The **TuliaPay Frontend** is a cutting-edge **Next.js 15** application that serves as the main entry point for the privacy-first financial protocol. It allows verified humans to interact with the [TuliaProtocol](../smart-contracts) and manage their confidential assets.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Glassmorphism & Premium UI)
- **State Management:** Jotai (Atomic state for real-time reactive UI)
- **Web3 Interaction:** Ethers.js v6
- **Confidentiality:** `@zama-fhe/fhevmjs` (Client-side FHE encryption)
- **Identity:** `@worldcoin/idkit` (World ID integration)

---

## ✨ Features

- **🛡️ Proof of Personhood:** Seamless integration with World ID to ensure a sybil-resistant experience.
- **👁️ Confidential Balances:** Private view keys ensure that only *you* see your balance, not the blockchain explorer.
- **💸 Encrypted Transfers:** Perform peer-to-peer transfers using fully homomorphic encryption.
- **⛽ Gasless Flow:** Integrates with the [Relayer](../backend) to allow transactions without needing native tokens for gas.

---

## 🛠️ Getting Started

### 📋 Prerequisites

- **Node.js:** v20.x or higher
- **MetaMask:** Required for signing and wallet connection.

### ⚙️ Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - **Important Keys:**
     - `NEXT_PUBLIC_TULIA_CONTRACT`: The address of the deployed TuliaProtocol.
     - `NEXT_PUBLIC_WORLD_ID_APP_ID`: Your World ID application ID.
     - `NEXT_PUBLIC_GATEWAY_URL`: Zama's FHEVM Gateway URL.

3. **Start the Development Server:**
   ```bash
   npm run dev
   # App will be live at http://localhost:3000
   ```

---

## 🏗️ Project Structure

- **`/src/app/`:** App Router pages and layouts.
- **`/src/components/`:** Reusable UI components (Atomic design).
- **`/src/utils/`:** Helper functions for contract interaction and FHE encryption.
- **`/src/store/`:** Jotai atoms for global state management.

---

## 🔐 Privacy & Security

- **Client-Side Encryption:** All financial amounts are encrypted in the user's browser before being sent across the wire.
- **Sanitization:** All inputs are sanitized to prevent common Web3 attack vectors.

---

## 📄 License

This component is licensed under the **BSD-3-Clause-Clear License**.

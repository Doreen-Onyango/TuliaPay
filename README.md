# TuliaPay Monorepo

TuliaPay is a privacy-first, sybil-resistant financial protocol built for the **World ID** and **Zama fhEVM (Confidential Onchain Finance)** ecosystem. 

It allows verified humans to deposit assets, maintain confidential on-chain balances, and perform transfers using Fully Homomorphic Encryption (FHE)—ensuring that only the sender and recipient ever know the amounts involved.

---

## 🏗️ Repository Architecture

This project is a monorepo using **npm workspaces** for unified dependency and development orchestration.

- **[`/smart-contracts`](./smart-contracts/README.md):** 
  - FHEVM-enabled Solidity contracts.
  - Core Logic: `TuliaProtocol.sol` (Vault, Transfer, WorldID Verifier).
  - Hardhat-based development with `fhEVM` extensions.
- **[`/backend`](./backend/README.md):**
  - Node.js/Express relayer service.
  - Handles World ID verification orchestration and gasless meta-transactions.
- **[`/frontend`](./frontend/README.md):**
  - Next.js 15 Mini-App optimized for World App integration.
  - Uses `fhevmjs` for client-side encryption and `Jotai` for state management.
- **[`/docs`](./docs/implementation_plan.md):**
  - Detailed system architecture, implementation logs, and guides.

---

## 🚀 Getting Started

From the root directory, install all required dependencies:

```bash
npm install
```

### Development Flow
To run the components simultaneously:
1. **Contracts:** `cd smart-contracts && npm run compile`
2. **Relayer:** `cd backend && npm run dev` (Default port: 3001)
3. **Frontend:** `cd frontend && npm run dev` (Default port: 3000)

---

## 🔐 Security & Privacy
- **Human Verification:** Enforces World ID Orb-verification before any encrypted activity.
- **End-to-End Privacy:** Transaction amounts are encrypted locally on the user's device before being relayed to the blockchain. No plaintext financial data ever touches the backend or public Explorer logs.
- **Bot Resistance:** A purely "human-only" financial ecosystem.

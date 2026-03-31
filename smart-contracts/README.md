# 🛡️ TuliaPay Smart Contracts (FHEVM)

This repository contains the core Solidity logic for the **TuliaPay** protocol, built on the **Zama fhEVM (Confidential Onchain Finance)** network.

## ⚖️ Overview

The TuliaPay smart contracts provide a confidential, encrypted balance system that only verified humans (via **World ID**) can interact with.

- **Vault Logic:** Handles deposits and withdrawals of ERC-20 assets (e.g., USDe, ETH).
- **Confidential Balances:** Uses `euint32` (Zama's encrypted 32-bit uint) to store user balances privately.
- **Relay Support:** Compatible with meta-transactions to support gasless operations via the [TuliaRelayer](../backend).

---

## 📂 Contract Structure

- **[`contracts/TuliaProtocol.sol`](./contracts/TuliaProtocol.sol):** The main protocol contract.
  - `deposit(bytes ciphertext)`: High-level entry point for confidential deposits.
  - `transfer(address to, bytes ciphertext)`: Confidential transfer logic between verified humans.
  - `registerUser(bytes proof)`: Integration point for World ID verification (On-chain).
- **[`contracts/ZamaLib.sol`](./contracts/ZamaLib.sol):** Internal libraries for FHE arithmetic operations.

---

## 🛠️ Development & Deployment

### 📋 Prerequisites

- **Node.js**: v20 or higher
- **Zama fhEVM Knowledge:** [See Zama Docs](https://docs.zama.ai/fhevm)

### 🚀 Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   ```bash
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   ```

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run compile` | Compiles Solidity contracts using Hardhat. |
| `npm run test` | Runs the FHE-specific test suite. |
| `npm run deploy:local` | Deploys to a local fhEVM-ready Hardhat node. |
| `npm run deploy:sepolia` | Deploys to the Zama Sepolia Devnet. |

---

## 🔐 Security Audit

- **Sybil Resistance:** All non-view functions are protected by `onlyVerifiedHuman` modifiers.
- **Encryption:** Encryption is enforced at the protocol level. No unencrypted balances are allowed.

---

## 📄 License

This component is licensed under the **BSD-3-Clause-Clear License**.

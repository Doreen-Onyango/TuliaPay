# 📝 TuliaPay: Technical Implementation Plan

This document outlines the architecture, security invariants, and technical roadmap for **TuliaPay**, a privacy-first financial protocol.

## 🏛️ System Architecture

TuliaPay is built on a **three-tier architecture** designed for confidentiality and human verification.

### 1. User Tier (Frontend)
- **Framework:** Next.js 15
- **Local Encryption:** Uses `fhevmjs` to generate encrypted ciphertexts of transaction amounts *before* sending them to the relayer or blockchain.
- **Verification:** Integrates World ID Kit into the frontend flow to generate a ZK proof of personhood.

### 2. Relayer Tier (Backend)
- **Framework:** Express.js / Node.js
- **Responsibility:** Subsidizes gas costs for users. It takes a signed meta-transaction from the user, validates the World ID proof against the World Coin API (or proxies it to the contract), and submits the `euint32` payload to the fhEVM blockchain.

### 3. Protocol Tier (Smart Contracts)
- **Blockchain:** Zama fhEVM
- **Confidential State:** Stores user balances as `euint32` (encrypted types). All arithmetic (add/subtract) is performed on the encrypted state using FHE opcodes.
- **Access Control:** All protocol logic is guarded by World ID verification.

---

## 🔐 Security & Privacy Deep-Dive

### Fully Homomorphic Encryption (FHE)
Unlike ZK-Rollups which are used for scalability and *optional* privacy, TuliaPay uses FHE to keep the **state itself encrypted**. Only the owner of the private key (the user) can "re-encrypt" or "decrypt" parts of their balance for viewing purposes.

### World ID Integration
By requiring a "Human-Only" check, TuliaPay prevents sybil attacks which are common in DeFi (e.g., wash trading, airdrop farming). Each World ID nullifier hash is mapped to a single protocol-level account.

---

## 🗺️ Roadmap

### Phase 1: Prototype (Completed)
- [x] Basic FHE deposit/withdraw logic.
- [x] Integrated World ID authentication on the frontend.
- [x] Basic Express relayer for gasless transactions.

### Phase 2: Security Hardening (Current)
- [ ] Implement re-encryption limits to prevent brute-force attacks on encrypted balances.
- [ ] Integrate full on-chain World ID verification (Smart Contract level).
- [ ] Add support for multiple confidential ERC-20 assets.

### Phase 3: Mainnet Launch (Upcoming)
- [ ] Full protocol audit.
- [ ] Deploy to Zama Mainnet.
- [ ] Multi-sig governance for protocol parameters.

---

## 🛠️ Testing Strategy

### Smart Contracts
- Unit tests using Hardhat and `fhevm` libraries.
- Fuzz testing for encrypted arithmetic.

### Relayer
- End-to-end integration tests using a local fhEVM node.
- Stress testing for meta-transaction relaying.

### Frontend
- Cypress/Playwright suites for user journey verification (World ID flow).

---

## 📚 Resources
- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [World ID Developer Portal](https://developer.worldcoin.org/)
- [EIP-712 Meta-Transactions](https://eips.ethereum.org/EIPS/eip-712)

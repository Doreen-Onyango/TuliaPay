# TuliaPay Frontend Application

The primary user interface for TuliaPay. Built with Next.js, Tailwind CSS, Jotai, and `@zama-fhe/fhevmjs`.

## Tech Stack
- **Next.js (App Router):** High-performance framework.
- **Tailwind CSS v4:** Modern, utility-first styling with glassmorphism support.
- **Jotai:** Atomic state management for global synchronization.
- **Ethers.js v6 + fhevmjs:** Handles on-chain interactions and local client-side encryption.

## Features
- **World ID Integration:** Uses `@worldcoin/idkit` to verify humans in-app.
- **Confidential Dashboard:** Securely displays encrypted balances.
- **FHE Transactions:** Enables the "Send" and "Deposit" flow using localized encryption.

## Setup
1. `cd frontend`
2. `npm install`
3. `cp .env.example .env` (Populate keys)
4. `npm run dev`

# TuliaPay Backend Relayer

This is the API layer for TuliaPay that handles World ID verification and gasless meta-transactions on the fhEVM network.

## Features
- **Gasless Transaction Proxies:** Allows users to interact with TuliaProtocol without holding native ETH.
- **World ID Proxy:** Verifies IDKit proofs before triggering the on-chain registration.

## Setup
1. `cd backend`
2. `npm install`
3. `cp .env.example .env` (Populate keys)
4. `npm run dev`

## API Endpoints
- `POST /api/verify`: Ingests and verifies World ID Proofs.
- `POST /api/relay/send`: Proxies FHE encrypted transaction payloads directly to the blockchain.

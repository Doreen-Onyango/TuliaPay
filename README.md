# TuliaPay Monorepo

Welcome to the TuliaPay repository! This project follows a monorepo structure to ensure a clear separation of concerns, scalability, and seamless collaboration across different parts of the stack.

## Folder Structure

- `/backend`: Contains all backend-related code (API servers, background workers, integrations).
- `/smart-contracts`: Houses all Blockchain/Web3 code including Solidity smart contracts, Hardhat configuration, ABI generation, and deployment scripts.
- `/frontend`: The front-facing web application.
- `/docs`: Centralized documentation for APIs, architecture, and onboarding.
- `/config`: Shared configuration files (if applicable, e.g., global ESLint, prettier, or environment configurations).
- `/scripts`: Utility scripts for automation, CI/CD, or bootstrapping the environment.

## Getting Started

1. **Install Dependencies**
   From the root of the project, run:
   ```bash
   npm install
   ```
   *Npm workspaces will automatically install and link dependencies for all sub-packages.*

## Sub-Projects

- [Smart Contracts](./smart-contracts/README.md)

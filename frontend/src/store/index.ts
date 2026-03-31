import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { FhevmInstance } from 'fhevmjs';
import type { BrowserProvider, Signer } from 'ethers';

// FHEVM & Ethers.js State
export const providerAtom = atom<BrowserProvider | null>(null);
export const signerAtom = atom<Signer | null>(null);
export const fhevmInstanceAtom = atom<FhevmInstance | null>(null);

// Wallet & Auth
export const walletAddressAtom = atom<string | null>(null);
export const isVerifiedHumanAtom = atom<boolean>(false);

// FHE Data
export const encryptedBalanceAtom = atom<string>("****"); // Only decrypted when user opts in
export const userNonceAtom = atom<number>(0); // Tracked sequentially for replay protection
export const supportedTokensAtom = atom<string[]>(["TuliaTest (tUSD)", "fhEther (FHE)"]);

// UI State
export const activeTabAtom = atom<"dashboard" | "deposit" | "send" | "withdraw">("dashboard");
export const transactionStatusAtom = atom<"idle" | "processing" | "success" | "error">("idle");
export const transactionMessageAtom = atom<string>("");

// Global Privacy Metrics (Simulated from Zama/TuliaMetrics contract)
export const globalMetricsAtom = atom({
  totalHumans: 1342,
  protocolTVL: "14.2M", // Track totalPublicDeposits
  activeChannels: 42
});

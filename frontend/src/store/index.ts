import { atom } from 'jotai';

// Wallet & Auth
export const walletAddressAtom = atom<string | null>(null);
export const isVerifiedHumanAtom = atom<boolean>(false);

// FHE Data
export const encryptedBalanceAtom = atom<string>("****"); // Only decrypted when user opts in
export const supportedTokensAtom = atom<string[]>(["TuliaTest (tUSD)", "fhEther (FHE)"]);

// UI State
export const activeTabAtom = atom<"dashboard" | "deposit" | "send" | "withdraw">("dashboard");
export const transactionStatusAtom = atom<"idle" | "processing" | "success" | "error">("idle");
export const transactionMessageAtom = atom<string>("");

// Global Privacy Metrics (Simulated from Zama/TuliaMetrics contract)
export const globalMetricsAtom = atom({
  totalHumans: 1342,
  totalEncryptedVolume: "Hidden",
  activeChannels: 42
});

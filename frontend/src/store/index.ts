import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Wallet & Auth
export const walletAddressAtom = atomWithStorage<string | null>('tulia_wallet', null);
export const isVerifiedHumanAtom = atomWithStorage<boolean>('tulia_verified', false);

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

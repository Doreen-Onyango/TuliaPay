// frontend/src/store/atoms.ts
import { atom } from 'jotai'

// Holds the connected wallet address globally
export const walletAddressAtom = atom<string | null>(null)

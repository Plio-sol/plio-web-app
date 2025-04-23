// src/types/TokenBalance.ts
export interface TokenBalance {
    mint: string;
    symbol: string;
    name: string;
    uiAmount: number;
    decimals: number;
    priceUsd: number | null;
    valueUsd: number | null;
}
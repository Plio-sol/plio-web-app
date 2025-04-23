// src/components/WalletInfo.tsx
import React, { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, getAccount, getMint } from '@solana/spl-token';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

// Import styles for WalletInfo's internal structure
import * as S from './WalletInfo.styles';

// Define the specific token mint address for $Plio
const PLIO_MINT_ADDRESS = new PublicKey("So11111111111111111111111111111111111111112");
const PLIO_SYMBOL = "$Plio";
// --- Corrected Jupiter Price API endpoint ---
const JUPITER_PRICE_API = "https://lite-api.jup.ag/price/v2?ids="; // Correct v2 endpoint

// Animation variants for balance/value appearance
const valueVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const WalletInfo: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    // State for token balance
    const [plioBalance, setPlioBalance] = useState<string | null>(null);
    const [numericBalance, setNumericBalance] = useState<number | null>(null); // Store numeric balance for calculation
    const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(true);
    const [balanceError, setBalanceError] = useState<string | null>(null);

    // State for USD value
    const [usdValue, setUsdValue] = useState<string | null>(null);
    const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false); // Only load price after balance is known
    const [priceError, setPriceError] = useState<string | null>(null);


    useEffect(() => {
        const fetchWalletData = async () => {
            if (!publicKey || !connection) {
                setPlioBalance(null);
                setNumericBalance(null);
                setUsdValue(null);
                setIsBalanceLoading(false);
                setIsPriceLoading(false);
                setBalanceError(null);
                setPriceError(null);
                return;
            }

            // Reset states
            setIsBalanceLoading(true);
            setIsPriceLoading(false); // Price loading starts later
            setBalanceError(null);
            setPriceError(null);
            setPlioBalance(null);
            setNumericBalance(null);
            setUsdValue(null);

            let fetchedNumericBalance: number | null = null;
            let fetchedFormattedBalance: string | null = null;

            // --- Fetch Token Balance ---
            try {
                const associatedTokenAddress = getAssociatedTokenAddressSync(
                    PLIO_MINT_ADDRESS,
                    publicKey
                );

                let decimals = 9; // Default decimals
                try {
                    const mintInfo = await getMint(connection, PLIO_MINT_ADDRESS);
                    decimals = mintInfo.decimals;
                } catch (mintError) {
                    console.warn(`Could not fetch mint info for ${PLIO_SYMBOL}, using default decimals:`, mintError);
                }

                fetchedFormattedBalance = '0'; // Default to 0
                fetchedNumericBalance = 0;

                try {
                    const accountInfo = await getAccount(connection, associatedTokenAddress);
                    const rawAmount = Number(accountInfo.amount);
                    fetchedNumericBalance = rawAmount / (10 ** decimals);
                    fetchedFormattedBalance = fetchedNumericBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                    });
                } catch (accountError: any) {
                    if (accountError.message.includes('could not find account') || accountError.message.includes('Account does not exist')) {
                        console.log(`No ${PLIO_SYMBOL} token account found. Balance is 0.`);
                        // Balances remain 0
                    } else {
                        throw accountError; // Rethrow other account errors
                    }
                }

                setPlioBalance(fetchedFormattedBalance);
                setNumericBalance(fetchedNumericBalance);

            } catch (err: any) {
                console.error(`Failed to fetch ${PLIO_SYMBOL} balance:`, err);
                setBalanceError(`Failed to load ${PLIO_SYMBOL} balance.`); // Simplified error
            } finally {
                setIsBalanceLoading(false);
            }

            // --- Fetch Price and Calculate USD Value (only if balance fetch was successful) ---
            if (fetchedNumericBalance !== null) {
                setIsPriceLoading(true);
                setPriceError(null);
                try {
                    const priceResponse = await fetch(`${JUPITER_PRICE_API}${PLIO_MINT_ADDRESS.toBase58()}`);
                    if (!priceResponse.ok) {
                        throw new Error(`Failed to fetch price (Status: ${priceResponse.status})`);
                    }
                    const priceData = await priceResponse.json();

                    // Access the data using the mint address string
                    const priceInfo = priceData.data?.[PLIO_MINT_ADDRESS.toBase58()];

                    // --- Updated Check: Check if price is a non-empty string ---
                    if (priceInfo && typeof priceInfo.price === 'string' && priceInfo.price.length > 0) {
                        // --- Convert string price to number ---
                        const price = parseFloat(priceInfo.price);
                        if (!isNaN(price)) { // Ensure conversion was successful
                            const calculatedUsdValue = fetchedNumericBalance * price;
                            setUsdValue(calculatedUsdValue.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2, // Keep consistent USD formatting
                            }));
                        } else {
                            console.warn("Could not parse price string:", priceInfo.price);
                            setPriceError("Invalid price format received.");
                            setUsdValue(null);
                        }
                    } else {
                        console.warn("Price data not found or invalid for $Plio in v2 API response:", priceData);
                        setPriceError("Could not retrieve price.");
                        setUsdValue(null); // Ensure USD value is null if price fails
                    }
                } catch (err: any) {
                    console.error(`Failed to fetch ${PLIO_SYMBOL} price:`, err);
                    setPriceError("Could not retrieve price.");
                    setUsdValue(null); // Ensure USD value is null if price fails
                } finally {
                    setIsPriceLoading(false);
                }
            }
        };

        fetchWalletData();
        // Re-fetch if connection or publicKey changes
    }, [connection, publicKey]);

    // Determine overall loading state for the main spinner
    const showMainSpinner = isBalanceLoading; // Show main spinner only during initial balance load

    return (
        <S.WalletInfoContainer>
            <S.BalanceTitle>Your $Plio Balance</S.BalanceTitle>

            {/* Show main spinner only during initial balance load */}
            {showMainSpinner && (
                <S.LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
            )}

            {/* Display Balance and USD Value when not in initial load */}
            {!showMainSpinner && (
                <>
                    {/* Display Balance Error */}
                    {balanceError && <S.ErrorMessage>{balanceError}</S.ErrorMessage>}

                    {/* Display Balance */}
                    {!balanceError && plioBalance !== null && (
                        <AnimatePresence mode="wait"> {/* Use mode="wait" for smoother transitions */}
                            <S.BalanceDisplayContainer
                                key={`balance-${plioBalance}`} // Animate when balance string changes
                                variants={valueVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden" // Add exit animation if needed
                            >
                                <S.BalanceAmount>{numericBalance !== null ? Math.round(numericBalance).toLocaleString() : '0'}</S.BalanceAmount>                           </S.BalanceDisplayContainer>
                        </AnimatePresence>
                    )}

                    {/* Display USD Value or Price Loading/Error */}
                    {!balanceError && plioBalance !== null && ( // Only show USD section if balance loaded ok
                        <S.UsdValueDisplay>
                            <AnimatePresence mode="wait">
                                {isPriceLoading ? (
                                    <S.PriceLoadingIndicator
                                        key="price-loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, rotate: 360 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            rotate: { repeat: Infinity, duration: 0.8, ease: 'linear' },
                                            opacity: { duration: 0.2 }
                                        }}
                                    />
                                ) : priceError ? (
                                    <S.ErrorMessage key="price-error" style={{ fontSize: '0.9em', marginTop: 0 }}>
                                        {priceError}
                                    </S.ErrorMessage>
                                ) : usdValue !== null ? (
                                    <motion.span // Animate the value itself
                                        key={`usd-${usdValue}`} // Animate when value string changes
                                        variants={valueVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        ~ {usdValue} USD
                                    </motion.span>
                                ) : null /* Render nothing if price isn't loaded/error and value is null */}
                            </AnimatePresence>
                        </S.UsdValueDisplay>
                    )}
                </>
            )}

            {/* Prompt to connect wallet */}
            {!publicKey && !isBalanceLoading && (
                <S.ConnectPrompt>Connect wallet to view balance.</S.ConnectPrompt>
            )}
        </S.WalletInfoContainer>
    );
};

export default WalletInfo;
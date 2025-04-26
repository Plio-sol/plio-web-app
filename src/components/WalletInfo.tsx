// src/components/WalletInfo.tsx
import React, { FC, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react"; // Keep useConnection if needed for price/other things
// import { useWallet } from "@solana/wallet-adapter-react"; // No longer needed directly here
// import { PublicKey } from "@solana/web3.js"; // No longer needed directly here
// import { getAssociatedTokenAddressSync, getAccount, getMint } from "@solana/spl-token"; // No longer needed directly here
import { motion, AnimatePresence } from "framer-motion";

// Import styles
import * as S from "./WalletInfo.styles";

// Keep constants needed for price fetching
const PLIO_MINT_ADDRESS_STR = "2eXamy7t3kvKhfV6aJ6Uwe3eh8cuREFcTKs1mFKZpump";
const JUPITER_PRICE_API = "https://lite-api.jup.ag/price/v2?ids=";

// Animation variants (Keep as they are)
const valueVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// --- Define Props Interface ---
interface WalletInfoProps {
  numericBalance: number | null;
  isBalanceLoading: boolean;
  balanceError: string | null;
  isConnected: boolean; // Pass connection status for display logic
}

const WalletInfo: FC<WalletInfoProps> = ({
                                           numericBalance,
                                           isBalanceLoading,
                                           balanceError,
                                           isConnected,
                                         }) => {
  const { connection } = useConnection(); // Still needed for price fetching

  // --- REMOVE State for token balance ---
  // const [plioBalance, setPlioBalance] = useState<string | null>(null);
  // const [numericBalance, setNumericBalance] = useState<number | null>(null);
  // const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(true);
  // const [balanceError, setBalanceError] = useState<string | null>(null);

  // State ONLY for USD value
  const [usdValue, setUsdValue] = useState<string | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // --- REMOVE Balance Fetching useEffect ---
  // useEffect(() => { /* ... balance fetching logic removed ... */ }, [connection, publicKey]);

  // --- useEffect for Price Fetching (Depends on numericBalance prop) ---
  useEffect(() => {
    const fetchPriceAndCalculateValue = async () => {
      // Only fetch price if balance is known, not loading, no error, and connection exists
      if (
          numericBalance === null ||
          numericBalance < 0 || // Should not happen, but good check
          isBalanceLoading ||
          balanceError ||
          !connection
      ) {
        setUsdValue(null);
        setIsPriceLoading(false);
        setPriceError(null);
        return;
      }

      setIsPriceLoading(true);
      setPriceError(null);
      setUsdValue(null); // Reset before fetching

      try {
        const priceResponse = await fetch(
            `${JUPITER_PRICE_API}${PLIO_MINT_ADDRESS_STR}`,
        );
        if (!priceResponse.ok) {
          throw new Error(
              `Failed to fetch price (Status: ${priceResponse.status})`,
          );
        }
        const priceData = await priceResponse.json();
        const priceInfo = priceData.data?.[PLIO_MINT_ADDRESS_STR];

        if (
            priceInfo &&
            typeof priceInfo.price === "string" &&
            priceInfo.price.length > 0
        ) {
          const price = parseFloat(priceInfo.price);
          if (!isNaN(price)) {
            const calculatedUsdValue = numericBalance * price;
            setUsdValue(
                calculatedUsdValue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
            );
          } else {
            console.warn("Could not parse price string:", priceInfo.price);
            setPriceError("Invalid price format received.");
          }
        } else {
          console.warn(
              "Price data not found or invalid for $Plio in v2 API response:",
              priceData,
          );
          setPriceError("Could not retrieve price.");
        }
      } catch (err: any) {
        console.error(`Failed to fetch $Plio price:`, err);
        setPriceError("Could not retrieve price.");
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchPriceAndCalculateValue();
    // Re-fetch price if balance, connection, or error status changes
  }, [numericBalance, isBalanceLoading, balanceError, connection]);

  // Determine overall loading state for the main spinner (use prop)
  const showMainSpinner = isBalanceLoading;

  // Format balance for display (derived from prop)
  const formattedBalance =
      numericBalance !== null
          ? Math.round(numericBalance).toLocaleString()
          : "0";

  return (
      <S.WalletInfoContainer>
        <S.BalanceTitle>Your $Plio Balance</S.BalanceTitle>

        {/* Show main spinner only during initial balance load (using prop) */}
        {showMainSpinner && (
            <S.LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        )}

        {/* Display Balance and USD Value when not in initial load */}
        {!showMainSpinner && (
            <>
              {/* Display Balance Error (using prop) */}
              {balanceError && <S.ErrorMessage>{balanceError}</S.ErrorMessage>}

              {/* Display Balance (using prop) */}
              {!balanceError && numericBalance !== null && (
                  <AnimatePresence mode="wait">
                    <S.BalanceDisplayContainer
                        key={`balance-${formattedBalance}`} // Animate when formatted balance changes
                        variants={valueVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                      <S.BalanceAmount>{formattedBalance}</S.BalanceAmount>{" "}
                    </S.BalanceDisplayContainer>
                  </AnimatePresence>
              )}

              {/* Display USD Value or Price Loading/Error */}
              {!balanceError &&
                  numericBalance !== null && ( // Only show USD section if balance loaded ok
                      <S.UsdValueDisplay>
                        <AnimatePresence mode="wait">
                          {isPriceLoading ? (
                              <S.PriceLoadingIndicator
                                  key="price-loading"
                                  /* ... animation props ... */
                              />
                          ) : priceError ? (
                              <S.ErrorMessage
                                  key="price-error"
                                  style={{ fontSize: "0.9em", marginTop: 0 }}
                              >
                                {priceError}
                              </S.ErrorMessage>
                          ) : usdValue !== null ? (
                              <motion.span
                                  key={`usd-${usdValue}`}
                                  variants={valueVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                              >
                                ~ {usdValue} USD
                              </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </S.UsdValueDisplay>
                  )}
            </>
        )}

        {/* Prompt to connect wallet (using prop) */}
        {!isConnected && !isBalanceLoading && (
            <S.ConnectPrompt>Connect wallet to view balance.</S.ConnectPrompt>
        )}
      </S.WalletInfoContainer>
  );
};

export default WalletInfo;
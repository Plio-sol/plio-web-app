// src/components/CryptoMarketTracker.tsx
import React, { FC, JSX, useEffect, useMemo, useState } from "react";
import * as S from "./CryptoMarketTracker.styles";
import { FaBitcoin, FaEthereum, FaQuestionCircle } from "react-icons/fa"; // Base icons
// Import specific icons
import {
  SiCardano,
  SiDogecoin,
  SiPolkadot,
  SiRipple,
  SiSolana,
} from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components"; // Import motion

interface CryptoMarketTrackerProps {
  onClose: () => void;
}

// Define Tab Type
type MarketTab = "largeCap" | "meme";

// Define the structure of the price data we expect
interface PriceData {
  [coinId: string]: {
    usd: number;
  };
}

// --- Define Coin Lists ---

// Large Cap Coins
const LARGE_CAP_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple", // XRP
  "cardano", // ADA
  "polkadot", // DOT
  // Add stablecoins back if desired
  // "usd-coin", // USDC
  // "tether",   // USDT
];

// Map CoinGecko IDs to display info (Name, Symbol, Icon)
const LARGE_CAP_DISPLAY_INFO: {
  [key: string]: { name: string; symbol: string; icon: JSX.Element };
} = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
    icon: <FaBitcoin color="#F7931A" />,
  },
  ethereum: {
    name: "Ethereum",
    symbol: "ETH",
    icon: <FaEthereum color="#627EEA" />,
  },
  solana: { name: "Solana", symbol: "SOL", icon: <SiSolana color="#9945FF" /> },
  ripple: { name: "XRP", symbol: "XRP", icon: <SiRipple color="#00A5E0" /> },
  cardano: {
    name: "Cardano",
    symbol: "ADA",
    icon: <SiCardano color="#0033AD" />,
  },
  polkadot: {
    name: "Polkadot",
    symbol: "DOT",
    icon: <SiPolkadot color="#E6007A" />,
  },
  // Add stablecoins back if desired
  // "usd-coin": { name: "USD Coin", symbol: "USDC", icon: <FaDollarSign color="#2775CA" /> },
  // tether: { name: "Tether", symbol: "USDT", icon: <FaDollarSign color="#26A17B" /> },
};

// Meme Coins (Add CoinGecko IDs)
const MEME_COIN_IDS = [
  "dogecoin", // DOGE
  "shiba-inu", // SHIB
  "pepe", // PEPE
  "dogwifcoin", // WIF (use correct ID)
  "bonk", // BONK (use correct ID)
  // Add more meme coin IDs if desired
];

const MEME_COIN_DISPLAY_INFO: {
  [key: string]: { name: string; symbol: string; icon: JSX.Element };
} = {
  dogecoin: {
    name: "Dogecoin",
    symbol: "DOGE",
    icon: <SiDogecoin color="#C2A633" />,
  },
  "shiba-inu": {
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: (
      <img
        src={process.env.PUBLIC_URL + "/shib_logo.png"}
        alt="SHIB"
        style={{ width: "40px", height: "40px" }}
      />
    ),
  }, // Use specific icon if available or fallback
  pepe: {
    name: "Pepe",
    symbol: "PEPE",
    icon: (
      <img
        src={process.env.PUBLIC_URL + "/pepe_logo.png"}
        alt="PEPE"
        style={{ width: "40px", height: "40px" }}
      />
    ),
  }, // Use specific icon if available or fallback
  dogwifcoin: {
    name: "dogwifhat",
    symbol: "WIF",
    icon: (
      <img
        src={process.env.PUBLIC_URL + "/wif_logo.svg"}
        alt="WIF"
        style={{ width: "40px", height: "40px" }}
      />
    ),
  },
  bonk: {
    name: "Bonk",
    symbol: "BONK",
    icon: (
      <img
        src={process.env.PUBLIC_URL + "/bonk_logo.png"}
        alt="BONK"
        style={{ width: "40px", height: "40px" }}
      />
    ),
  },
};

// Combine all display info for easy lookup
const ALL_COIN_DISPLAY_INFO = {
  ...LARGE_CAP_DISPLAY_INFO,
  ...MEME_COIN_DISPLAY_INFO,
};
// --- End Coin Lists ---

// Animation variants (Keep as is)
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const modalVariants = {
  // Using the full-screen variant definitions from styles
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const gridVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Simple styled component for the "Coming Soon" text (if needed later)
const ComingSoonText = styled.p`
  color: #8892b0;
  font-size: 1.2em;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const CryptoMarketTracker: FC<CryptoMarketTrackerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<MarketTab>("largeCap"); // Default tab
  // Store prices for all fetched coins, persists across tab switches within this component instance
  const [prices, setPrices] = useState<PriceData | null>(null);
  // Loading state specifically for when a fetch is in progress
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start false, set true only during fetch
  const [error, setError] = useState<string | null>(null);
  // Keep track of which tabs have successfully loaded data in this session
  const [loadedTabs, setLoadedTabs] = useState<Set<MarketTab>>(new Set());

  // Determine which coin IDs to fetch based on the active tab
  const currentCoinIds = useMemo(() => {
    return activeTab === "largeCap" ? LARGE_CAP_IDS : MEME_COIN_IDS;
  }, [activeTab]);

  useEffect(() => {
    const fetchPricesForTab = async () => {
      // --- Only fetch if the current tab hasn't been loaded yet in this session ---
      if (loadedTabs.has(activeTab)) {
        setIsLoading(false); // Ensure loading is false if not fetching
        return;
      }

      // Use the correct IDs based on the current state
      const idsToFetch =
        activeTab === "largeCap" ? LARGE_CAP_IDS : MEME_COIN_IDS;

      // Prevent fetching if the ID list is empty (safety check)
      if (idsToFetch.length === 0) {
        setIsLoading(false);
        return;
      }

      const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${idsToFetch.join(",")}&vs_currencies=usd`;

      setIsLoading(true); // Set loading true *before* the fetch starts
      setError(null); // Clear previous error

      console.log(
        `Fetching prices ONCE for ${activeTab}: ${idsToFetch.join(", ")}`,
      );

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          if (response.status === 429) {
            console.error("Rate limit exceeded fetching CoinGecko data.");
            throw new Error("Rate limit exceeded. Please try again later.");
          }
          let errorMsg = `Failed to fetch market data (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData?.error) errorMsg = `Error: ${errorData.error}`;
          } catch (_) {
            /* Ignore */
          }
          throw new Error(errorMsg);
        }
        const data: PriceData = await response.json();
        // Merge data into existing prices state
        setPrices((prevPrices) => ({ ...prevPrices, ...data }));
        // --- Mark this tab as loaded ---
        setLoadedTabs((prevLoadedTabs) =>
          new Set(prevLoadedTabs).add(activeTab),
        );
      } catch (err: any) {
        console.error(`Error fetching ${activeTab} prices:`, err);
        setError(err.message || "Could not load market data.");
      } finally {
        // Ensure loading is set to false after the fetch attempt completes
        setIsLoading(false);
      }
    };

    fetchPricesForTab();

    // --- REMOVE setInterval ---
    // No automatic refresh to avoid rate limits and adhere to fetch-once logic
    // const intervalId = setInterval(fetchPrices, 9000); // REMOVED
    // return () => clearInterval(intervalId); // REMOVED

    // Depend on activeTab to trigger fetch for new tabs.
    // loadedTabs dependency ensures fetch only happens if tab isn't already loaded.
    // currentCoinIds is implicitly covered by activeTab but included for ESLint.
  }, [activeTab, loadedTabs, currentCoinIds]); // Keep dependencies

  // Helper to format price
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "N/A";
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price > 1 ? 2 : price > 0.001 ? 4 : 8, // More precision for memes
    });
  };

  // Determine if the *current* tab's data is available (i.e., has been loaded)
  const isCurrentTabDataAvailable = loadedTabs.has(activeTab);

  return (
    <S.OverlayContainer
      key="market-overlay"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      {/* Apply modalVariants for full screen */}
      <S.ModalWindow
        variants={modalVariants} // Use the full-screen variants
        onClick={(e) => e.stopPropagation()}
      >
        <S.CloseButton onClick={onClose} aria-label="Close Market Tracker">
          &times;
        </S.CloseButton>

        <S.Title>Crypto Market Overview</S.Title>
        <S.Subtitle>Live prices from CoinGecko</S.Subtitle>

        {/* Wrap the main content area (Tabs + Grid/Loading/Error) */}
        <S.ContentContainer>
          {/* --- Tab Buttons --- */}
          <S.TabContainer>
            <S.TabButton
              isActive={activeTab === "largeCap"}
              onClick={() => setActiveTab("largeCap")}
            >
              Large Cap
            </S.TabButton>
            <S.TabButton
              isActive={activeTab === "meme"}
              onClick={() => setActiveTab("meme")}
            >
              Meme Coins
            </S.TabButton>
          </S.TabContainer>
          {/* --- End Tab Buttons --- */}

          {/* --- Conditional Rendering --- */}

          {/* Show loading spinner ONLY when a fetch is actively in progress */}
          {isLoading && (
            <S.LoadingContainer>
              <S.LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </S.LoadingContainer>
          )}

          {/* Show error state if not loading AND an error occurred */}
          {!isLoading && error && <S.ErrorMessage>{error}</S.ErrorMessage>}

          {/* Grid - Show if NOT loading, NO error, AND data for this tab is available */}
          {!isLoading && !error && isCurrentTabDataAvailable && prices && (
            <AnimatePresence mode="wait">
              <S.MarketGrid
                key={activeTab} // Key ensures animation on tab change
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Map over the IDs for the CURRENT active tab */}
                {currentCoinIds.map((coinId) => {
                  const displayInfo = ALL_COIN_DISPLAY_INFO[coinId] || {
                    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
                    symbol: coinId.substring(0, 4).toUpperCase(),
                    icon: <FaQuestionCircle />,
                  };
                  // Get price safely from the potentially merged state
                  const priceInfo = prices ? prices[coinId] : undefined;

                  return (
                    <S.CoinCard key={coinId} variants={cardVariants}>
                      <S.CoinIcon>{displayInfo.icon}</S.CoinIcon>
                      <S.CoinInfo>
                        <S.CoinName>{displayInfo.name}</S.CoinName>
                        <S.CoinSymbol>{displayInfo.symbol}</S.CoinSymbol>
                      </S.CoinInfo>
                      <S.CoinPrice>
                        {/* Show N/A if price is truly missing after load attempt, otherwise format */}
                        {priceInfo === undefined
                          ? "N/A"
                          : formatPrice(priceInfo?.usd)}
                      </S.CoinPrice>
                    </S.CoinCard>
                  );
                })}
              </S.MarketGrid>
            </AnimatePresence>
          )}

          {/* Optional: Message if data couldn't load for a tab */}
          {!isLoading && !error && !isCurrentTabDataAvailable && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-not-loaded`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ComingSoonText>
                  {/* Adjust message based on tab or keep generic */}
                  {activeTab === "meme"
                    ? "Meme coin data loading..."
                    : "Could not load market data. Please try reopening the tool."}
                </ComingSoonText>
              </motion.div>
            </AnimatePresence>
          )}
          {/* --- End Conditional Rendering --- */}
        </S.ContentContainer>
        {/* End ContentContainer */}
      </S.ModalWindow>
    </S.OverlayContainer>
  );
};

export default CryptoMarketTracker;

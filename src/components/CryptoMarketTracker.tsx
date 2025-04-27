// src/components/CryptoMarketTracker.tsx
import React, {FC, JSX, useEffect, useMemo, useState} from "react";
import * as S from "./CryptoMarketTracker.styles";
import {
    FaBitcoin,
    FaEthereum,
    FaQuestionCircle,
} from "react-icons/fa"; // Base icons
// Import specific icons if needed, e.g., from simple-icons or use images
import {SiCardano, SiDogecoin, SiPolkadot, SiRipple, SiSolana, } from 'react-icons/si';
import { AnimatePresence } from "framer-motion";

interface CryptoMarketTrackerProps {
    onClose: () => void;
}

// Define Tab Type
type MarketTab = 'largeCap' | 'meme';

// Define the structure of the price data we expect
interface PriceData {
    [coinId: string]: {
        usd: number;
    };
}


// Large Cap Coins
const LARGE_CAP_IDS = [
    "bitcoin",
    "ethereum",
    "solana",
    "ripple",   // XRP
    "cardano",  // ADA
    "polkadot", // DOT
];

// Map CoinGecko IDs to display info (Name, Symbol, Icon)
const LARGE_CAP_DISPLAY_INFO: {
    [key: string]: { name: string; symbol: string; icon: JSX.Element };
} = {
    bitcoin: { name: "Bitcoin", symbol: "BTC", icon: <FaBitcoin color="#F7931A" /> },
    ethereum: { name: "Ethereum", symbol: "ETH", icon: <FaEthereum color="#627EEA" /> },
    solana: { name: "Solana", symbol: "SOL", icon: <SiSolana color="#9945FF" />},
    cardano: { name: "Cardano", symbol: "ADA", icon: <SiCardano color="#0033AD" /> },
    ripple: { name: "XRP", symbol: "XRP", icon: <SiRipple color="#00A5E0" /> },
    dogecoin: { name: "Dogecoin", symbol: "DOGE", icon: <SiDogecoin color="#C2A633" /> },
    polkadot: { name: "Polkadot", symbol: "DOT", icon: <SiPolkadot color="#E6007A" /> },
    // Add corresponding display info for any other IDs added above
};

// Meme Coins (Add CoinGecko IDs)
const MEME_COIN_IDS = [
    "dogecoin",     // DOGE
    "shiba-inu",    // SHIB
    "pepe",         // PEPE
    "dogwifcoin",   // WIF (use correct ID)
    "bonk",         // BONK (use correct ID)
    // Add more meme coin IDs if desired
];

const MEME_COIN_DISPLAY_INFO: { [key: string]: { name: string; symbol: string; icon: JSX.Element } } = {
    dogecoin: { name: "Dogecoin", symbol: "DOGE", icon: <SiDogecoin color="#C2A633" /> },
    "shiba-inu": { name: "Shiba Inu", symbol: "SHIB",         icon: <img src={process.env.PUBLIC_URL + "/shib_logo.png"} alt="SHIB" style={{ width: '40px', height: '40px' }}/> }, // Use specific icon if available or fallback
    pepe: { name: "Pepe", symbol: "PEPE",         icon: <img src={process.env.PUBLIC_URL + "/pepe_logo.png"} alt="PEPE" style={{ width: '40px', height: '40px' }}/> }, // Use specific icon if available or fallback
    dogwifcoin: { name: "dogwifhat", symbol: "WIF", icon: <img src={process.env.PUBLIC_URL + "/wif_logo.svg"} alt="WIF" style={{ width: '40px', height: '40px' }}/> }, // Placeholder - find/add WIF icon/image
    bonk: { name: "Bonk", symbol: "BONK", icon: <img src={process.env.PUBLIC_URL + "/bonk_logo.png"} alt="BONK" style={{ width: '40px', height: '40px' }}/> }, // Placeholder - find/add BONK icon/image
};

// Combine all display info for easy lookup
const ALL_COIN_DISPLAY_INFO = { ...LARGE_CAP_DISPLAY_INFO, ...MEME_COIN_DISPLAY_INFO };



// Animation variants
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};
const modalVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.3, ease: "easeIn" } },
};
const gridVariants = {
    visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const CryptoMarketTracker: FC<CryptoMarketTrackerProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<MarketTab>('largeCap'); // Default tab
    const [prices, setPrices] = useState<PriceData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Determine which coin IDs to fetch based on the active tab
    const currentCoinIds = useMemo(() => {
        return activeTab === 'largeCap' ? LARGE_CAP_IDS : MEME_COIN_IDS;
    }, [activeTab]);



    useEffect(() => {
        const fetchPrices = async () => {
            // Don't reset loading on tab change if prices already exist, just refetch
            if (!prices) {
                setIsLoading(true);
            }
            setError(null);

            const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${currentCoinIds.join(",")}&vs_currencies=usd`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    let errorMsg = `Failed to fetch market data (Status: ${response.status})`;
                    try {
                        const errorData = await response.json();
                        if (errorData?.error) errorMsg = `Error: ${errorData.error}`;
                    } catch (_) { /* Ignore */ }
                    throw new Error(errorMsg);
                }
                const data: PriceData = await response.json();

                // Update prices - merge new data with existing if needed, or just set
                setPrices(prevPrices => ({ ...prevPrices, ...data })); // Merge to keep old tab data briefly visible

            } catch (err: any) {
                console.error(`Error fetching ${activeTab} prices:`, err);
                setError(err.message || "Could not load market data.");
                // Clear prices for the current tab on error? Optional.
                // setPrices(prev => {
                //     const next = {...prev};
                //     currentCoinIds.forEach(id => delete next?.[id]);
                //     return next;
                // });
            } finally {
                setIsLoading(false); // Set loading false after fetch attempt
            }
        };

        fetchPrices(); // Fetch when tab changes or on mount


        const intervalId = setInterval(fetchPrices, 9000);
        return () => clearInterval(intervalId); // Cleanup interval

    }, [activeTab]); // Rerun effect when activeTab changes

    // Helper to format price (Keep as is)
    const formatPrice = (price: number | undefined): string => {
        if (price === undefined) return "N/A";
        return price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: price > 1 ? 2 : (price > 0.001 ? 4 : 8), // More precision for memes
        });
    };

    return (
        <S.OverlayContainer
            key="market-overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
        >
            <S.ModalWindow
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <S.CloseButton onClick={onClose} aria-label="Close Market Tracker">
                    &times;
                </S.CloseButton>

                <S.Title>Crypto Market Overview</S.Title>
                <S.Subtitle>Live prices from CoinGecko</S.Subtitle>

                {/* --- Add Tab Buttons --- */}
                <S.TabContainer>
                    <S.TabButton
                        isActive={activeTab === 'largeCap'}
                        onClick={() => setActiveTab('largeCap')}
                    >
                        Large Cap
                    </S.TabButton>
                    <S.TabButton
                        isActive={activeTab === 'meme'}
                        onClick={() => setActiveTab('meme')}
                    >
                        Meme Coins
                    </S.TabButton>
                </S.TabContainer>
                {/* --- End Tab Buttons --- */}


                {/* Show loading spinner only when isLoading is true */}
                {isLoading && (
                    <S.LoadingContainer>
                        <S.LoadingSpinner
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    </S.LoadingContainer>
                )}

                {/* Show error if not loading and error exists */}
                {!isLoading && error && <S.ErrorMessage>{error}</S.ErrorMessage>}

                {/* Show grid if not loading, no error, and prices exist */}
                {/* Use AnimatePresence to animate tab changes */}
                {!isLoading && !error && prices && (
                    <AnimatePresence mode="wait">
                        <S.MarketGrid
                            key={activeTab} // Add key to force re-render on tab change
                            variants={gridVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0 }} // Simple fade out for old grid
                            transition={{ duration: 0.2 }} // Adjust timing
                        >
                            {/* Map over the IDs for the CURRENT active tab */}
                            {currentCoinIds.map((coinId) => {
                                const displayInfo = ALL_COIN_DISPLAY_INFO[coinId] || {
                                    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
                                    symbol: coinId.substring(0, 4).toUpperCase(),
                                    icon: <FaQuestionCircle />,
                                };
                                const priceInfo = prices[coinId]; // Get price from potentially merged state

                                // Only render card if price exists for this coin (handles potential partial loads)
                                if (priceInfo === undefined && !isLoading) return null; // Skip if no price and not loading

                                return (
                                    <S.CoinCard key={coinId} variants={cardVariants}>
                                        <S.CoinIcon>{displayInfo.icon}</S.CoinIcon>
                                        <S.CoinInfo>
                                            <S.CoinName>{displayInfo.name}</S.CoinName>
                                            <S.CoinSymbol>{displayInfo.symbol}</S.CoinSymbol>
                                        </S.CoinInfo>
                                        {/* Show loading dots or price */}
                                        <S.CoinPrice>
                                            {priceInfo === undefined ? "..." : formatPrice(priceInfo?.usd)}
                                        </S.CoinPrice>
                                    </S.CoinCard>
                                );
                            })}
                        </S.MarketGrid>
                    </AnimatePresence>
                )}
            </S.ModalWindow>
        </S.OverlayContainer>
    );
};

export default CryptoMarketTracker;
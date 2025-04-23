// src/components/DexScreenerLatest.tsx
import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all styled components using an alias 'S'
import * as S from './DexScreenerLatest.styles';

// --- Types ---

// Structure for links in the API response
interface DexScreenerLink {
    label?: string; // Label might be missing if type is present
    type?: 'twitter' | 'telegram' | string; // Common types + others
    url: string;
}

// Structure for a single token profile in the API response
interface DexScreenerTokenProfile {
    url: string;
    chainId: string;
    tokenAddress: string;
    icon?: string; // Optional
    header?: string; // Optional
    openGraph?: string; // Optional
    description?: string; // Optional
    links?: DexScreenerLink[]; // Optional
}

// Our internal structure for displaying results
interface DisplayTokenItem {
    id: string; // Use tokenAddress as unique ID
    dexScreenerUrl: string;
    chainId: string;
    iconUrl?: string;
    description?: string;
    links?: DexScreenerLink[];
    // Chart-specific state per item
    pairAddress?: string | null; // Store fetched pair address, null if fetch failed/no pair, undefined if not attempted
    isLoadingChart?: boolean; // Flag for loading state *of the chart*
    chartError?: string; // Store error specific to chart fetching
}

interface DexScreenerLatestProps {
    onClose?: () => void;
}

// --- Framer Motion Variants ---
// Re-use variants from other search components if desired, or define specific ones
const overlayVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.2, ease: "easeIn" } }
};

const resultsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        }
    }
};

const tokenCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 12 }
    },
    exit: {
        opacity: 0, scale: 0.95,
        transition: { duration: 0.2 }
    }
};

// Variants for chart area content (spinner, error, iframe, button)
const chartContentVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};


// --- DexScreenerLatest Component ---
const DexScreenerLatest: FC<DexScreenerLatestProps> = ({ onClose }) => {
    // State hooks
    const [tokens, setTokens] = useState<DisplayTokenItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Initial component loading
    const [error, setError] = useState<string | null>(null); // Error for initial fetch

    // --- API Endpoints ---
    const DEXSCREENER_API_URL = 'https://api.dexscreener.com/token-profiles/latest/v1';
    const SOLSCAN_MARKET_API_BASE = 'https://public-api.solscan.io/market?tokenAddress=';

    // --- Fetch Initial Data on Mount ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            setTokens([]);
            console.log(`Fetching latest tokens from DexScreener API...`);

            try {
                const response = await fetch(DEXSCREENER_API_URL);
                if (!response.ok) throw new Error(`DexScreener API request failed: ${response.status} ${response.statusText}`);

                const data: DexScreenerTokenProfile[] = await response.json();
                if (!Array.isArray(data)) throw new Error('Invalid data format received from DexScreener API.');

                // Map initial data, leaving chart fields undefined
                const mappedTokens: DisplayTokenItem[] = data
                    .filter(token => token.chainId === 'solana') // Filter for Solana tokens
                    .map(token => ({
                        id: token.tokenAddress, // Use address as key
                        dexScreenerUrl: token.url,
                        chainId: token.chainId,
                        iconUrl: token.icon,
                        description: token.description,
                        links: token.links,
                        // pairAddress, isLoadingChart, chartError remain undefined initially
                    }));

                setTokens(mappedTokens);

            } catch (err: any) {
                console.error("DexScreener initial fetch failed:", err);
                setError(err.message || 'An unknown error occurred while fetching initial data.');
                setTokens([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
        // Empty dependency array means this runs once when the component mounts
    }, []);

    // --- Handler to Fetch Pair Data and Update Chart State ---
    const handleViewChart = async (tokenId: string) => {
        console.log(`Fetching pair data for ${tokenId} from Solscan...`);

        // 1. Update state to show loading for this specific token
        setTokens(prevTokens =>
            prevTokens.map(token =>
                token.id === tokenId
                    ? { ...token, isLoadingChart: true, chartError: undefined, pairAddress: undefined } // Reset state before fetch
                    : token
            )
        );

        try {
            const solscanUrl = `${SOLSCAN_MARKET_API_BASE}${tokenId}`;

            // --- ADD API KEY FROM ENVIRONMENT VARIABLE ---
            const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDU0NDUzNDgwMTksImVtYWlsIjoibW50ZWNoc3VydmV5QGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTc0NTQ0NTM0OH0.JM-jd7JIned9_7CTdgkeRC3-zISBZBwqFeMDp4UHR8I';
            if (!apiKey) {
                console.error("Solscan API Key not found in environment variables! Make sure REACT_APP_SOLSCAN_API_KEY is set.");
                throw new Error("Solscan API Key is missing.");
            }

            const response = await fetch(solscanUrl, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`, // Standard JWT authorization
                    // 'token': apiKey, // Alternative header if 'Authorization' doesn't work
                }
            });
            // --- END API KEY ADDITION ---


            if (!response.ok) {
                // Handle Solscan API errors (like 404 Not Found, 429 Rate Limit, 401 Unauthorized)
                if (response.status === 401) {
                    throw new Error(`Solscan API Error: 401 Unauthorized. Check your API Key.`);
                }
                throw new Error(`Solscan API Error: ${response.status} ${response.statusText}`);
            }

            const marketData = await response.json();

            // 2. Find the best pair (e.g., highest liquidity SOL or USDC pair)
            let bestPairAddress: string | null = null; // Use null to indicate fetch completed but no suitable pair found
            let errorMessage: string | undefined = undefined;

            // Check if marketData is an array and not empty
            if (marketData && Array.isArray(marketData) && marketData.length > 0) {
                // Define preferred quote token addresses
                const preferredQuoteTokens = [
                    'So11111111111111111111111111111111111111112', // SOL
                    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC (Solana)
                ];

                // Filter pairs where one side is the target token (tokenId) and the other is a preferred quote token
                // IMPORTANT: Adjust 'tokenAddress' and 'baseAddress' based on Solscan's actual response structure for pairs
                // Assuming Solscan response has 'baseAddress' and 'quoteAddress' for the pair
                const relevantPairs = marketData.filter((pair: any) =>
                    (pair.baseAddress === tokenId && preferredQuoteTokens.includes(pair.quoteAddress)) ||
                    (pair.quoteAddress === tokenId && preferredQuoteTokens.includes(pair.baseAddress))
                );


                if (relevantPairs.length > 0) {
                    // Sort by liquidity (descending) - check actual field name (e.g., 'liquidity', 'volume24h')
                    // Using 'liquidity' as a placeholder
                    relevantPairs.sort((a: any, b: any) => (b.liquidity ?? 0) - (a.liquidity ?? 0));

                    // Get the market address - check actual field name (e.g., 'address', 'market', 'ammId')
                    // Using 'market' or 'ammId' as placeholders
                    bestPairAddress = relevantPairs[0].market || relevantPairs[0].address || relevantPairs[0].ammId;

                    if (!bestPairAddress) {
                        console.warn("Found relevant pairs but couldn't extract market/pair address from:", relevantPairs[0]);
                        errorMessage = "Could not extract pair address from data.";
                    }
                } else {
                    errorMessage = "No suitable SOL/USDC pair found.";
                }

            } else {
                errorMessage = "No market data found on Solscan.";
            }

            // If after all checks, we still don't have an address and no specific error, set a generic one
            if (!bestPairAddress && !errorMessage) {
                errorMessage = "Could not find pair address.";
            }

            // 3. Update state with result (pairAddress or error)
            setTokens(prevTokens =>
                prevTokens.map(token =>
                    token.id === tokenId
                        ? { ...token, isLoadingChart: false, pairAddress: bestPairAddress, chartError: errorMessage }
                        : token
                )
            );

        } catch (err: any) {
            console.error(`Error fetching Solscan data for ${tokenId}:`, err);
            // 4. Update state with error
            setTokens(prevTokens =>
                prevTokens.map(token =>
                    token.id === tokenId
                        ? { ...token, isLoadingChart: false, pairAddress: null, chartError: err.message || 'Failed to load chart data.' }
                        : token
                )
            );
        }
    };


    // Helper to get link class for styling/icons
    const getLinkClassName = (link: DexScreenerLink): string => {
        if (link.type) return link.type.toLowerCase();
        if (link.label?.toLowerCase().includes('website')) return 'website';
        // Add more specific checks if needed
        return ''; // Default class
    };

    // --- Render Logic ---
    return (
        <S.OverlayContainer
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Close Button */}
            {onClose && (
                <S.CloseButton
                    onClick={onClose}
                    aria-label="Close Latest Tokens"
                    whileHover={{ scale: 1.1, rotate: 90, color: "#facc15" }} // DexScreener Yellow?
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    &times;
                </S.CloseButton>
            )}

            {/* Updated Title */}
            <S.DisplayTitle>Latest Solana Tokens (Dex Paid)</S.DisplayTitle>

            {/* Results Area */}
            <S.ResultsArea>
                <AnimatePresence>
                    {isLoading && (
                        <S.Spinner
                            key="initial-spinner" // Changed key for clarity
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                                opacity: { duration: 0.2 }
                            }}
                        />
                    )}
                </AnimatePresence>

                {!isLoading && error && <S.ErrorMessage>Error: {error}</S.ErrorMessage>}
                {/* Updated No Data Message */}
                {!isLoading && !error && tokens.length === 0 && (
                    <S.NoDataMessage>No Solana token data available at the moment.</S.NoDataMessage>
                )}

                {/* Results Grid */}
                {!isLoading && !error && tokens.length > 0 && (
                    <S.ResultsGrid
                        variants={resultsGridVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {tokens.map((token) => {
                            // Construct DexScreener embed URL *only if* pairAddress is available
                            let chartEmbedUrl: string | undefined = undefined;
                            if (token.pairAddress) {
                                // Use the pair address and the parameters from your example
                                chartEmbedUrl = `https://dexscreener.com/${token.chainId}/${token.pairAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`;
                            }

                            return (
                                <S.TokenCard
                                    key={token.id}
                                    variants={tokenCardVariants}
                                    layout
                                    whileHover={{ y: -5, borderColor: "rgba(250, 204, 21, 0.6)", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)"}} // Yellow border/shadow
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <S.CardHeader>
                                        {token.iconUrl && <S.TokenIcon src={token.iconUrl} alt={`${token.chainId} token`} />}
                                        <S.TokenInfo>
                                            <S.TokenAddress title={token.id}>{token.id}</S.TokenAddress>
                                            <S.ChainBadge>{token.chainId}</S.ChainBadge>
                                        </S.TokenInfo>
                                    </S.CardHeader>

                                    {token.description && (
                                        <S.TokenDescription>{token.description}</S.TokenDescription>
                                    )}

                                    {/* --- Chart Area --- */}
                                    <S.ChartAreaContainer layout>
                                        {/* AnimatePresence handles the switching between button/spinner/error/chart */}
                                        <AnimatePresence mode="wait">
                                            {token.isLoadingChart ? (
                                                <S.ChartSpinner
                                                    key="chart-spinner" // Unique key for the spinner
                                                    variants={chartContentVariants}
                                                    initial="initial"
                                                    animate={{ opacity: 1, scale: 1, rotate: 360 }} // Animate opacity/scale and rotation
                                                    exit="exit"
                                                    transition={{
                                                        opacity: { duration: 0.2 },
                                                        scale: { duration: 0.2 },
                                                        rotate: { repeat: Infinity, duration: 1, ease: 'linear' } // Rotation animation
                                                    }}
                                                />
                                            ) : chartEmbedUrl ? (
                                                // Wrap iframe in motion.div for animation
                                                <motion.div
                                                    key="chart-iframe" // Unique key for the iframe state
                                                    variants={chartContentVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    style={{ width: '100%', height: '100%' }} // Ensure div fills container
                                                >
                                                    <S.ChartIframe
                                                        src={chartEmbedUrl}
                                                        title={`${token.id} Price Chart`}
                                                        loading="lazy" // Still useful
                                                        frameBorder="0"
                                                    />
                                                </motion.div>
                                            ) : token.chartError ? (
                                                <S.ChartErrorMessage
                                                    key="chart-error" // Unique key for the error state
                                                    variants={chartContentVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                >
                                                    {token.chartError}
                                                </S.ChartErrorMessage>
                                            ) : (
                                                // Show button only if not loading, no chart URL, and no error
                                                <S.ViewChartButton
                                                    key="view-chart-button" // Unique key for the button state
                                                    variants={chartContentVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    onClick={() => handleViewChart(token.id)}
                                                    disabled={token.isLoadingChart} // Disable while loading (redundant check but safe)
                                                    layout // Helps Framer Motion adjust layout smoothly
                                                >
                                                    View Chart
                                                </S.ViewChartButton>
                                            )}
                                        </AnimatePresence>
                                    </S.ChartAreaContainer>
                                    {/* --- END Chart Area --- */}


                                    <S.LinksContainer>
                                        {/* DexScreener Link First */}
                                        <S.LinkButton
                                            href={token.dexScreenerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="View on DexScreener"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            DexScreener
                                        </S.LinkButton>
                                        {/* Other Links */}
                                        {token.links?.map((link, index) => (
                                            <S.LinkButton
                                                key={`${token.id}-link-${index}`}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={link.label || link.type || 'External Link'}
                                                className={getLinkClassName(link)} // Add class for potential icon styling
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {/* Corrected Twitter link text */}
                                                {link.type === 'twitter' ? 'X' : (link.label || link.type || 'Link')}
                                            </S.LinkButton>
                                        ))}
                                    </S.LinksContainer>
                                </S.TokenCard>
                            );
                        })}
                    </S.ResultsGrid>
                )}
            </S.ResultsArea>
        </S.OverlayContainer>
    );
};

export default DexScreenerLatest;
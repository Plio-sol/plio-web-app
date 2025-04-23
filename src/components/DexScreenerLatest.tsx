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


// --- DexScreenerLatest Component ---
const DexScreenerLatest: FC<DexScreenerLatestProps> = ({ onClose }) => {
    // State hooks
    const [tokens, setTokens] = useState<DisplayTokenItem[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Start loading immediately
    const [error, setError] = useState<string | null>(null);

    // --- DexScreener API Endpoint ---
    const DEXSCREENER_API_URL = 'https://api.dexscreener.com/token-profiles/latest/v1';

    // --- Fetch Data on Mount ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            setTokens([]); // Clear previous results

            console.log(`Fetching latest tokens from DexScreener API...`);

            try {
                const response = await fetch(DEXSCREENER_API_URL);

                if (!response.ok) {
                    throw new Error(`DexScreener API request failed: ${response.status} ${response.statusText}`);
                }

                const data: DexScreenerTokenProfile[] = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from DexScreener API.');
                }

                // Map the data to our internal structure
                const mappedTokens: DisplayTokenItem[] = data.filter(token => token.chainId === 'solana').map(token => ({
                    id: token.tokenAddress, // Use address as key
                    dexScreenerUrl: token.url,
                    chainId: token.chainId,
                    iconUrl: token.icon,
                    description: token.description,
                    links: token.links,
                }));

                setTokens(mappedTokens);

            } catch (err: any) {
                console.error("DexScreener fetch failed:", err);
                if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                    setError(`Network error or potential CORS issue fetching from DexScreener API. ${err.message}`);
                } else {
                    setError(err.message || 'An unknown error occurred while fetching data.');
                }
                setTokens([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // Empty dependency array means this runs once when the component mounts
    }, []);

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

            <S.DisplayTitle>Newest "Dex Paid" Tokens</S.DisplayTitle>

            {/* Results Area */}
            <S.ResultsArea>
                <AnimatePresence>
                    {isLoading && (
                        <S.Spinner
                            key="spinner"
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
                {!isLoading && !error && tokens.length === 0 && (
                    <S.NoDataMessage>No token data available at the moment.</S.NoDataMessage>
                )}

                {/* Results Grid */}
                {!isLoading && !error && tokens.length > 0 && (
                    <S.ResultsGrid
                        variants={resultsGridVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {tokens.map((token) => (
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
                                            {link.type === 'twitter' ? '' : (link.label || link.type || 'Link')}
                                        </S.LinkButton>
                                    ))}
                                </S.LinksContainer>
                            </S.TokenCard>
                        ))}
                    </S.ResultsGrid>
                )}
            </S.ResultsArea>
        </S.OverlayContainer>
    );
};

export default DexScreenerLatest;
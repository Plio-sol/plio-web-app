// src/components/DexScreenerVolume.tsx
import React, { FC, useEffect, useState } from "react";
import * as S from "./DexScreenerVolume.styles";
import { AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa"; // For DexScreener link

// --- Types ---
interface DexScreenerVolumeProps {
  onClose: () => void;
}

// Define the structure of the token data from the API
interface DexVolumeToken {
  tokenSymbol: string; // Needs parsing
  tokenName: string;
  priceUsd: number | null;
  age: number | null; // In minutes/hours? API doesn't specify units clearly
  transactionCount: number | null;
  volumeUsd: number | null; // This seems to be the 24h volume
  volume5m: number | null; // Assuming the API provides this if sorted by 5m
  makerCount: number | null;
  priceChange5m: number | null;
  priceChange1h: number | null;
  priceChange6h: number | null;
  priceChange24h: number | null;
  liquidityUsd: number | null;
  marketCapUsd: number | null;
  address: string; // Token address
}

// --- API Endpoint ---
// WARNING: Including API keys directly in frontend code is insecure.
// Ideally, this should be fetched via a Netlify function proxy.
const APIFY_API_KEY = "apify_api_CydE3y3Iz0e9Uk1dr3vxmGZZS0xVf93cn8mN";

// Define endpoints clearly
const ENDPOINTS = {
  '24h': `https://api.apify.com/v2/datasets/Wqgu4Nv69ONxRemaA/items?token=${APIFY_API_KEY}`, // Original endpoint (assuming 24h volume sort)
  '5m': `https://api.apify.com/v2/datasets/MyKbUv28e8hgCDOff/items?token=${APIFY_API_KEY}`, // New endpoint (assuming 5m volume sort)
};

type TimeFrame = keyof typeof ENDPOINTS; // '24h' | '5m'

// --- Animation Variants (Using basic ones for now) ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const gridVariants = {
  visible: { transition: { staggerChildren: 0.05 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// --- Helper Functions ---
const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: value > 1 ? 2 : value > 0.001 ? 4 : 8,
  });
};

const formatCompactNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return `${(value * 100).toFixed(2)}%`;
};

// Parses the messy tokenSymbol string
const parseTokenInfo = (
    tokenSymbolString: string,
): { rank: string; symbol: string } => {
  const parts = tokenSymbolString.split("\n");
  const rank = parts[0] || "#?"; // e.g., #1
  let symbol = "N/A";
  if (parts.length > 1) {
    // Usually the second part is the symbol, handle potential "CPMM" prefix
    symbol = parts[1] === "CPMM" || parts[1] === "DLMM" || parts[1] === "WP" || parts[1] === "DYN" ? (parts[2] || "N/A") : parts[1];
  }
  return { rank, symbol: symbol.trim() };
};

// --- Component ---
const DexScreenerVolume: FC<DexScreenerVolumeProps> = ({ onClose }) => {
  const [volumeData, setVolumeData] = useState<DexVolumeToken[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('5m'); // Default to 5m
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setVolumeData([]); // Clear previous data on fetch

      // --- Get the correct endpoint URL ---
      const currentEndpoint = ENDPOINTS[activeTimeFrame];
      console.log(`Fetching from endpoint: ${activeTimeFrame} (${currentEndpoint})`);

      try {
        const response = await fetch(currentEndpoint);
        if (!response.ok) {
          throw new Error(
              `Failed to fetch volume data (Status: ${response.status})`,
          );
        }
        const data: DexVolumeToken[] = await response.json();
        // Assuming the API returns data sorted according to the endpoint used
        setVolumeData(data);
      } catch (err: any) {
        console.error(`Error fetching DexScreener ${activeTimeFrame} volume data:`, err);
        setError(err.message || `Could not load ${activeTimeFrame} volume data.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // --- Re-fetch when activeTimeFrame changes ---
  }, [activeTimeFrame]); // Dependency array includes activeTimeFrame

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveTimeFrame(event.target.checked ? '24h' : '5m');
  };

  return (
      <S.OverlayContainer
          key="dexvolume-overlay"
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
          <S.CloseButton onClick={onClose} aria-label="Close Volume Tracker">
            &times;
          </S.CloseButton>

          {/* --- Use Header Container --- */}
          <S.HeaderContainer>
            <S.Title>DexScreener Volume Leaders</S.Title>
            <S.Subtitle>
              Top tokens sorted by {activeTimeFrame === '5m' ? '5 minute' : '24 hour'} volume
            </S.Subtitle>
            {/* --- Add Switch --- */}
            <S.SwitchContainer>
              <S.SwitchLabel>5m</S.SwitchLabel>
              <S.SwitchToggle>
                <input
                    type="checkbox"
                    checked={activeTimeFrame === '24h'}
                    onChange={handleSwitchChange}
                    disabled={isLoading} // Disable switch while loading
                />
                <span /> {/* The visual part of the toggle */}
              </S.SwitchToggle>
              <S.SwitchLabel>24h</S.SwitchLabel>
            </S.SwitchContainer>
            {/* --- End Switch --- */}
          </S.HeaderContainer>
          {/* --- End Header Container --- */}


          <S.ContentContainer>
            {isLoading && (
                <S.LoadingContainer>
                  <S.LoadingSpinner
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </S.LoadingContainer>
            )}

            {!isLoading && error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            {!isLoading && !error && volumeData.length > 0 && (
                <AnimatePresence>
                  <S.VolumeGrid
                      variants={gridVariants}
                      initial="hidden"
                      animate="visible"
                  >
                    {volumeData.map((token) => {
                      const { rank, symbol } = parseTokenInfo(token.tokenSymbol);
                      const dexScreenerLink = `https://dexscreener.com/solana/${token.address}`;

                      // Determine which volume to display based on active timeframe (if available)
                      // Assuming 'volumeUsd' is always 24h and 'volume5m' exists for the 5m endpoint
                      const displayVolume = activeTimeFrame === '5m' ? token.volume5m : token.volumeUsd;
                      const displayVolumeLabel = activeTimeFrame === '5m' ? 'Volume (5m)' : 'Volume (24h)';

                      return (
                          <S.TokenCard key={token.address} variants={cardVariants}>
                            <S.CardHeader>
                              <S.TokenRank>{rank}</S.TokenRank>
                              <S.TokenNameSymbol>
                                <S.TokenName>{token.tokenName}</S.TokenName>
                                <S.TokenSymbol>{symbol}</S.TokenSymbol>
                              </S.TokenNameSymbol>
                            </S.CardHeader>

                            <S.TokenDataGrid>
                              <S.DataRow>
                                <S.DataLabel>Price</S.DataLabel>
                                <S.DataValue>
                                  {formatCurrency(token.priceUsd)}
                                </S.DataValue>
                              </S.DataRow>
                              <S.DataRow>
                                {/* --- Display Correct Volume --- */}
                                <S.DataLabel>{displayVolumeLabel}</S.DataLabel>
                                <S.DataValue>
                                  ${formatCompactNumber(displayVolume)}
                                </S.DataValue>
                                {/* --- End Display Correct Volume --- */}
                              </S.DataRow>
                              <S.DataRow>
                                <S.DataLabel>Market Cap</S.DataLabel>
                                <S.DataValue>
                                  ${formatCompactNumber(token.marketCapUsd)}
                                </S.DataValue>
                              </S.DataRow>
                              <S.DataRow>
                                <S.DataLabel>Liquidity</S.DataLabel>
                                <S.DataValue>
                                  ${formatCompactNumber(token.liquidityUsd)}
                                </S.DataValue>
                              </S.DataRow>
                              <S.DataRow>
                                {/* Display 5m change if available */}
                                <S.DataLabel>Change (5m)</S.DataLabel>
                                <S.PriceChange value={token.priceChange5m}>
                                  {formatPercentage(token.priceChange5m)}
                                </S.PriceChange>
                              </S.DataRow>
                              <S.DataRow>
                                <S.DataLabel>Change (1h)</S.DataLabel>
                                <S.PriceChange value={token.priceChange1h}>
                                  {formatPercentage(token.priceChange1h)}
                                </S.PriceChange>
                              </S.DataRow>
                              <S.DataRow>
                                <S.DataLabel>Change (24h)</S.DataLabel>
                                <S.PriceChange value={token.priceChange24h}>
                                  {formatPercentage(token.priceChange24h)}
                                </S.PriceChange>
                              </S.DataRow>
                              <S.DataRow>
                                <S.DataLabel>Age (hrs)</S.DataLabel>
                                <S.DataValue>
                                  {token.age !== null ? (token.age / 60).toFixed(1) : 'N/A'}
                                </S.DataValue>
                              </S.DataRow>
                              {/* Removed Makers row as it wasn't in the new API data example */}
                              {/* <S.DataRow>
                          <S.DataLabel>Makers</S.DataLabel>
                          <S.DataValue>
                            {formatCompactNumber(token.makerCount)}
                          </S.DataValue>
                        </S.DataRow> */}
                            </S.TokenDataGrid>

                            <S.DexLink
                                href={dexScreenerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                              View on DexScreener <FaExternalLinkAlt size="0.8em" style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
                            </S.DexLink>
                          </S.TokenCard>
                      );
                    })}
                  </S.VolumeGrid>
                </AnimatePresence>
            )}

            {!isLoading && !error && volumeData.length === 0 && (
                <S.ErrorMessage>No volume data available for this timeframe.</S.ErrorMessage>
            )}

          </S.ContentContainer>
        </S.ModalWindow>
      </S.OverlayContainer>
  );
};

export default DexScreenerVolume;
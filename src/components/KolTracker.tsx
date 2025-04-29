// src/components/KolTracker.tsx
import React, { FC, useEffect, useState } from "react";
import * as S from "./KolTracker.styles";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// --- Types based on API response ---
interface KolTrackerProps {
  onClose: () => void;
}

interface KolWalletInfo {
  ens: string;
  twitter_username: string; // Key field
  twitter_name: string;
  tags: string[]; // Check for "kol"
  avatar: string; // Key field
  name: string;
  balance: string;
  balance_ts: number;
  wallet_address: string;
  net_inflow: string;
  net_amount: string;
  amount_total: string;
  buys: number;
  sells: number;
  side: string;
  is_open_or_close: number;
  timestamp: number;
}

interface KolTokenData {
  address: string;
  symbol: string;
  name: string;
  logo: string;
  price: string;
  market_cap: string;
  liquidity: string;
  // ... other token fields if needed
  wallets: KolWalletInfo[]; // Array of wallets/KOLs
}

// --- Apify API Info ---
const APIFY_TOKEN = "apify_api_CydE3y3Iz0e9Uk1dr3vxmGZZS0xVf93cn8mN";
const APIFY_TASK_ID = "plio-sol~gmgn-kol-monitor-scraper-task";

// --- API Endpoints ---
const KOL_DATA_ENDPOINT = `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last/dataset/items?token=${APIFY_TOKEN}&status=SUCCEEDED`;
const KOL_RUN_META_ENDPOINT = `https://api.apify.com/v2/actor-tasks/${APIFY_TASK_ID}/runs/last?token=${APIFY_TOKEN}&status=SUCCEEDED`; // Endpoint for last run metadata

// --- Animation Variants (Using basic ones) ---
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
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const formatCompactNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  // Handle potential NaN from parseFloat
  if (isNaN(value)) return "N/A";
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
};
const formatUpdateTime = (date: Date | null): string => {
  if (!date) return "fetching time..."; // Placeholder while loading
  try {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "invalid time"; // Fallback on error
  }
};

interface KolAvatarWithFallbackProps {
  src: string;
  alt: string;
}

const KolAvatarWithFallback: FC<KolAvatarWithFallbackProps> = ({
  src,
  alt,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // Reset error state if src changes (though unlikely in this map context)
  useEffect(() => {
    setHasError(false);
  }, [src]);

  return hasError ? (
    <S.KolAvatarPlaceholder aria-label={alt}>?</S.KolAvatarPlaceholder>
  ) : (
    <S.KolAvatarImage src={src} alt={alt} onError={handleError} />
  );
};

// --- Component ---
const KolTracker: FC<KolTrackerProps> = ({ onClose }) => {
  const [kolData, setKolData] = useState<KolTokenData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // --- *** Modify fetchData to get both data and metadata *** ---
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setKolData([]); // Clear previous data
      setLastUpdateTime(null); // Clear previous time

      try {
        // Fetch both endpoints concurrently
        const [dataResponse, metaResponse] = await Promise.all([
          fetch(KOL_DATA_ENDPOINT),
          fetch(KOL_RUN_META_ENDPOINT),
        ]);

        // --- Process Metadata Response ---
        if (!metaResponse.ok) {
          console.warn(
            // Warn instead of throwing immediately, maybe data is still useful
            `Failed to fetch run metadata (Status: ${metaResponse.status})`,
          );
        } else {
          const metaData = await metaResponse.json();
          if (metaData?.data?.finishedAt) {
            setLastUpdateTime(new Date(metaData.data.finishedAt));
          } else {
            console.warn(
              "Could not find 'finishedAt' in run metadata response.",
            );
          }
        }

        // --- Process Data Response ---
        if (!dataResponse.ok) {
          // If data fails, it's a more critical error
          throw new Error(
            `Failed to fetch KOL data (Status: ${dataResponse.status})`,
          );
        }
        const data: KolTokenData[] = await dataResponse.json();
        setKolData(data);
      } catch (err: any) {
        console.error("Error fetching KOL tracker data:", err);
        setError(err.message || "Could not load KOL data.");
        setLastUpdateTime(null); // Clear time on error
      } finally {
        setIsLoading(false);
      }
    };
    // --- *** End fetchData modification *** ---

    fetchData();
    // Fetch only once on mount
  }, []);

  // --- Copy Address Handler ---
  const handleCopyAddress = async (address: string) => {
    if (!navigator.clipboard) {
      toast.error("Clipboard not available.");
      return;
    }
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address); // Set the copied address
      toast.success("Token Address Copied!"); // Specific message
      // Reset the copied state after a short delay
      setTimeout(() => {
        setCopiedAddress(null);
      }, 1500); // Reset after 1.5 seconds
    } catch (err) {
      console.error("Failed to copy token address:", err);
      toast.error("Failed to copy token address.");
      setCopiedAddress(null); // Ensure reset on error
    }
  };

  return (
    <S.OverlayContainer
      key="koltracker-overlay"
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
        <S.CloseButton onClick={onClose} aria-label="Close KOL Tracker">
          &times;
        </S.CloseButton>

        <S.Title>KOL Tracker</S.Title>
        {/* --- *** Update Subtitle to use dynamic time *** --- */}
        <S.Subtitle>
          Tokens recently bought by tracked KOLs
          <br /> {/* Optional: line break for clarity */}
          (Last Updated: {formatUpdateTime(lastUpdateTime)})
        </S.Subtitle>
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

          {!isLoading && !error && kolData.length > 0 && (
            <AnimatePresence>
              <S.KolGrid
                variants={gridVariants}
                initial="hidden"
                animate="visible"
              >
                {kolData.map((token) => {
                  // Filter wallets to find actual KOLs with twitter usernames
                  const kols = token.wallets.filter(
                    (wallet) =>
                      wallet.tags.includes("kol") && wallet.twitter_username,
                  );
                  const isCopied = copiedAddress === token.address;
                  const marketCapValue = token.market_cap
                    ? parseFloat(token.market_cap)
                    : null;
                  return (
                    <S.TokenCard key={token.address} variants={cardVariants}>
                      {/* Token Info */}
                      <S.TokenInfoSection>
                        <S.TokenLogo
                          src={token.logo}
                          alt={`${token.name} logo`}
                        />
                        <S.TokenDetails>
                          <S.TokenName title={token.name}>
                            {token.name}
                          </S.TokenName>
                          <S.TokenSymbol>{token.symbol}</S.TokenSymbol>
                          <S.TokenMarketCapContainer>
                            <S.TokenMarketCapLabel>MCap:</S.TokenMarketCapLabel>
                            <S.TokenMarketCapValue>
                              ${formatCompactNumber(marketCapValue)}
                            </S.TokenMarketCapValue>
                          </S.TokenMarketCapContainer>
                          <S.AddressContainer>
                            <S.AddressText title={token.address}>
                              {" "}
                              {/* Add title for full address on hover */}
                              {token.address}
                            </S.AddressText>
                            <S.CopyButton
                              onClick={() => handleCopyAddress(token.address)}
                              disabled={isCopied} // Disable briefly after copying
                              title="Copy Token Address" // Tooltip
                            >
                              {isCopied ? "Copied!" : "Copy CA"}
                            </S.CopyButton>
                          </S.AddressContainer>
                          {/* --- End Address and Copy Button --- */}
                        </S.TokenDetails>
                      </S.TokenInfoSection>

                      {/* KOL Section */}
                      <S.KolSection>
                        <S.KolSectionTitle>
                          Tracked KOLs That Aped 🦍
                        </S.KolSectionTitle>
                        {kols.length > 0 ? (
                          <S.KolAvatarGrid>
                            {kols.map((kol) => (
                              <S.KolAvatarLink
                                key={kol.wallet_address} // Use wallet address as key
                                href={`https://x.com/${kol.twitter_username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`${kol.twitter_name || kol.name} (@${kol.twitter_username})`} // Tooltip
                              >
                                <KolAvatarWithFallback
                                  src={kol.avatar}
                                  alt={`${kol.twitter_name || kol.name} avatar`}
                                />
                              </S.KolAvatarLink>
                            ))}
                          </S.KolAvatarGrid>
                        ) : (
                          <S.NoKolsMessage>
                            No tracked KOLs found holding this token recently.
                          </S.NoKolsMessage>
                        )}
                      </S.KolSection>
                    </S.TokenCard>
                  );
                })}
              </S.KolGrid>
            </AnimatePresence>
          )}

          {/* Message if API returns empty array */}
          {!isLoading && !error && kolData.length === 0 && (
            <S.ErrorMessage>No KOL activity data available.</S.ErrorMessage>
          )}
        </S.ContentContainer>
      </S.ModalWindow>
    </S.OverlayContainer>
  );
};

export default KolTracker;

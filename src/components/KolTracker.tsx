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

// --- API Endpoint (Replace with your actual endpoint) ---
const KOL_API_ENDPOINT =
  "https://api.apify.com/v2/datasets/UT7cv892FcvvZDACt/items?token=apify_api_CydE3y3Iz0e9Uk1dr3vxmGZZS0xVf93cn8mN"; // TODO: Replace this!

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(KOL_API_ENDPOINT);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch KOL data (Status: ${response.status})`,
          );
        }
        const data: KolTokenData[] = await response.json();
        setKolData(data);
      } catch (err: any) {
        console.error("Error fetching KOL tracker data:", err);
        setError(err.message || "Could not load KOL data.");
      } finally {
        setIsLoading(false);
      }
    };

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
        <S.Subtitle>Tokens recently bought by tracked KOLs</S.Subtitle>

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
                  const marketCapValue = token.market_cap ? parseFloat(token.market_cap) : null;
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
                          Tracked KOLs Holding
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

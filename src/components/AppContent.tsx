// src/components/AppContent.tsx
import React, { FC, useEffect, useState } from "react";
// *** Import useWallet correctly ***
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react"; // Import WalletContextState type
import { AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

// Import styles
import * as S from "./AppContent.styles";
import IconBar, { DrawerItemType } from "./IconBar"; // Import the new drawer
import WalletInfo from "./WalletInfo";

import XIcon from "../icons/XIcon";

import TorrentSearchGames from "./TorrentSearchGames";
import TorrentSearchMovies from "./TorrentSearchMovies";
import DexScreenerLatest from "./DexScreenerLatest";
import ImageGenerator from "./ImageGenerator";
import Roadmap from "./Roadmap";
import AIChat, { Message, Personality } from "./AIChat";
import DexScreenerVolume from "./DexScreenerVolume";
import { PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import CryptoMarketTracker from "./CryptoMarketTracker";
import { FaTelegramPlane } from "react-icons/fa";
import AxiomIcon from "../icons/AxiomIcon"; // Import Message and Personality types
import BullXIcon from "../icons/BullXIcon";
import KolTracker from "./KolTracker";
import GlobalChat from "./GlobalChat"; // <-- Import the new component
// --- Type Definition for window.Jupiter ---
declare global {
  interface Window {
    Jupiter: {
      init: (options: any) => void;
      // *** ADD syncProps based on documentation ***
      syncProps: (props: {
        passthroughWalletContextState?: WalletContextState;
      }) => void; // Use WalletContextState type
    };
  }
}
// --- End Type Definition ---
const CONTRACT_ADDRESS = "2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump";
const PLIO_MINT_ADDRESS = new PublicKey(
  "2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump",
);
const REQUIRED_PLIO_BALANCE = 1000000; // 1,000,000
const PLIO_SYMBOL = "$Plio"; // Define symbol for messages
const MOBILE_BREAKPOINT = 769; // Define breakpoint constant

// --- *** Define Restricted Features List Here *** ---
const restrictedFeatures: DrawerItemType[] = [
  "image",
  "dex",
  "volume",
  "kol",
   // "globalChat"
];
// --- *** End Definition *** ---

// --- App Content Component ---
const AppContent: FC = () => {
  const walletState = useWallet();
  const { connected, publicKey } = walletState; // Destructure publicKey
  const { connection } = useConnection(); // Get connection here

  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [activeOverlay, setActiveOverlay] = useState<DrawerItemType | null>(
    null,
  );

  // Chat State (Keep as is)
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatPersonality, setChatPersonality] = useState<Personality>("nice");

  // --- **** Add State for Plio Balance (Lifted from WalletInfo) **** ---
  const [plioNumericBalance, setPlioNumericBalance] = useState<number | null>(
    null,
  );
  const [isPlioBalanceLoading, setIsPlioBalanceLoading] =
    useState<boolean>(false); // Start false, set true when fetching
  const [plioBalanceError, setPlioBalanceError] = useState<string | null>(null);
  // --- **** End Chat State **** ---

  useEffect(() => {
    const fetchPlioBalance = async () => {
      if (!publicKey || !connection) {
        setPlioNumericBalance(null);
        setIsPlioBalanceLoading(false);
        setPlioBalanceError(null);
        return;
      }

      setIsPlioBalanceLoading(true);
      setPlioBalanceError(null);
      setPlioNumericBalance(null); // Reset before fetching

      try {
        const associatedTokenAddress = getAssociatedTokenAddressSync(
          PLIO_MINT_ADDRESS,
          publicKey,
        );

        let decimals = 9; // Default decimals
        try {
          const mintInfo = await getMint(connection, PLIO_MINT_ADDRESS);
          decimals = mintInfo.decimals;
        } catch (mintError) {
          console.warn(
            `Could not fetch mint info for ${PLIO_SYMBOL}, using default decimals:`,
            mintError,
          );
        }

        let fetchedNumericBalance = 0; // Default to 0

        try {
          const accountInfo = await getAccount(
            connection,
            associatedTokenAddress,
          );
          const rawAmount = Number(accountInfo.amount);
          fetchedNumericBalance = rawAmount / 10 ** decimals;
        } catch (accountError: any) {
          if (
            accountError.message.includes("could not find account") ||
            accountError.message.includes("Account does not exist")
          ) {
            console.log(`No ${PLIO_SYMBOL} token account found. Balance is 0.`);
            // Balance remains 0
          } else {
            throw accountError; // Rethrow other account errors
          }
        }

        setPlioNumericBalance(fetchedNumericBalance);
      } catch (err: any) {
        setPlioBalanceError(
          "You have no $PLIO 😑. You will be restricted from using the Image Generation & Dex Screener Features. You are free to use all other features.",
        );
      } finally {
        setIsPlioBalanceLoading(false);
      }
    };

    fetchPlioBalance();
    // Re-fetch if connection or publicKey changes
  }, [connection, publicKey]);

  // New handler for when an item is selected in the drawer
  const handleSelectItem = (itemType: DrawerItemType) => {

    if (restrictedFeatures.includes(itemType)) {
      // 1. Check if wallet is connected
      if (!connected) {
        toast.error("Please connect your wallet to access this feature.");
        return; // Stop processing
      }

      // 2. Check if balance is still loading
      if (isPlioBalanceLoading) {
        toast.loading("Checking $Plio balance...", { duration: 1500 });
        return; // Stop processing
      }

      // 3. Check if balance is loaded and meets requirement (>= 1,000,000)
      // Handle null (error or not loaded) and < 1 cases
      if (plioNumericBalance === null || plioNumericBalance < 1000000) {
        toast.error(`Requires at least 1000000 ${PLIO_SYMBOL} to access.`);
        return; // Stop processing
      }

      // If all checks pass for restricted features
      console.log(
        `Access granted to ${itemType}. Balance: ${plioNumericBalance}`,
      );
    }

    // If checks passed OR the feature is not restricted, set the overlay
    setActiveOverlay(itemType);
  };

  // Handler to close the currently active overlay
  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const handleCopyAddress = () => {
    if (!navigator.clipboard) {
      // Clipboard API not available (older browsers, insecure context)
      console.error("Clipboard API not supported");
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000); // Reset after 2s
      return;
    }

    navigator.clipboard
      .writeText(CONTRACT_ADDRESS)
      .then(() => {
        // Success!
        setCopyStatus("copied");
        // Reset back to idle after a short delay
        setTimeout(() => setCopyStatus("idle"), 1500); // 1.5 seconds
      })
      .catch((err) => {
        // Error!
        console.error("Failed to copy address: ", err);
        setCopyStatus("error");
        setTimeout(() => setCopyStatus("idle"), 2000); // Reset after 2s
      });
  };

  useEffect(() => {
    const initializeJupiter = () => {
      if (window.Jupiter) {
        // --- HIDE ON MOBILE ---
        // Check screen width before initializing
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          console.log(
            "Skipping Jupiter Terminal initialization on mobile screen size.",
          );
          return; // Exit initialization
        }
        // --- END HIDE ON MOBILE ---
        console.log("Initializing Jupiter Terminal (Widget Mode)...");
        try {
          window.Jupiter.init({
            // --- For Widget Mode ---
            displayMode: "widget", // Keep this
            enableWalletPassthrough: true, // Keep for wallet integration

            // --- Essential Props ---
            endpoint: process.env.REACT_APP_SOLANA_RPC_HOST, // Your RPC

            // --- Optional: Widget-specific settings ---
            widgetStyle: {
              zIndex: 99,
              position: "bottom-left", // 'bottom-left', 'top-left', 'top-right'
              size: "sm", // 'sm', 'default'
            },
            // --- Other Optional Props ---
            strictTokenList: false,
            formProps: {
              fixedOutputMint: true,
              initialInputMint: "So11111111111111111111111111111111111111112",
              initialOutputMint: "2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump", //TODO
            },
            // containerClassName: '...', // Might apply to the modal opened by widget
            // onSwapError: ({ error }) => { /* ... */ },
            // onSuccess: ({ txid, swapResult }) => { /* ... */ },
          });
          console.log("Jupiter Terminal Initialized (Widget Mode Complete).");
        } catch (error) {
          console.error(
            "Failed to initialize Jupiter Terminal (Widget Mode):",
            error,
          );
        }
      } else {
        console.log("Jupiter script not ready for init, retrying...");
        setTimeout(initializeJupiter, 500);
      }
    };

    initializeJupiter();
  }, []); // Runs once

  // --- Step 2: Synchronize Wallet State (Runs when walletState changes) ---
  useEffect(() => {
    // Check if the syncProps function exists (init might not be finished)
    if (window.Jupiter?.syncProps) {
      console.log(
        "Syncing Jupiter props with wallet state:",
        walletState.connected,
      );
      try {
        // Pass the whole wallet state object as expected by syncProps documentation
        window.Jupiter.syncProps({
          passthroughWalletContextState: walletState,
        });
      } catch (error) {
        console.error("Failed to sync Jupiter props:", error);
      }
    } else {
      console.log("window.Jupiter.syncProps not available yet.");
      // No automatic retry here, relies on the effect re-running when walletState changes
    }
  }, [walletState]);

  // --- End Jupiter Integration ---

  const renderActiveOverlay = () => {
    switch (activeOverlay) {
      case "games":
        return <TorrentSearchGames key="game-search" onClose={closeOverlay} />;
      case "movies":
        return (
          <TorrentSearchMovies key="movie-search" onClose={closeOverlay} />
        );
      case "dex":
        return <DexScreenerLatest key="dex-tokens" onClose={closeOverlay} />;
      case "volume":
        return <DexScreenerVolume key="dex-volume" onClose={closeOverlay} />;
      case "market":
        return (
          <CryptoMarketTracker key="market-tracker" onClose={closeOverlay} />
        );
      case "kol":
        return <KolTracker key="kol-tracker" onClose={closeOverlay} />;
      case "image":
        return <ImageGenerator key="image-generator" onClose={closeOverlay} />;
      case "roadmap":
        return <Roadmap key="roadmap-overlay" onClose={closeOverlay} />;
      case "globalChat":
        return <GlobalChat key="global-chat-overlay" onClose={closeOverlay}  />;
      case "chat":
        return (
          <AIChat
            key="ai-chat-overlay"
            onClose={closeOverlay}
            messages={chatMessages}
            setMessages={setChatMessages}
            personality={chatPersonality}
            setPersonality={setChatPersonality}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster
        position="top-center" // Or "top-right", "bottom-right", etc.
        reverseOrder={false}
        toastOptions={{
          // Default options
          duration: 2000, // How long toasts stay visible
          style: {
            background: "#363636", // Dark background
            color: "#fff", // White text
            zIndex: 2,
          },
          // Default options for specific types
          success: {
            duration: 1500,
          },
          error: {
            duration: 1500, // Keep errors visible a bit longer
            style: {
              background: "#a41d2e", // Error background color
              color: "#fff",
              zIndex: 2,
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#a41d2e",
            },
          },
          loading: {
            style: {
              background: "#4b5563", // Loading background color
            },
          },
        }}
      />
      <IconBar onSelectItem={handleSelectItem} closeOverlay={closeOverlay}  restrictedFeatures={restrictedFeatures} />
      <S.AppContentWrapper
        variants={S.containerVariants}
        initial="hidden"
        animate="visible"
      >
        <S.Header variants={S.itemVariants}>
          <S.Logo
            src={process.env.PUBLIC_URL + "/plio-logo.png"}
            alt="Plio Logo"
          />
          <S.SocialLinksContainer>
            <S.SocialLink
              href="https://x.com/PlioSol"
              target="_blank"
              rel="noopener noreferrer"
              title="Plio on X"
            >
              <XIcon />
            </S.SocialLink>
            <S.SocialLink
              href={`https://t.me/pliosol`}
              target="_blank"
              rel="noopener noreferrer"
              title="Plio Community on Telegram"
            >
              <FaTelegramPlane></FaTelegramPlane>
            </S.SocialLink>
            <S.SocialLink
              href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Plio on pump.fun"
            >
              <img
                src={process.env.PUBLIC_URL + "/pumpfun.png"}
                alt={"pump.fun logo"}
                style={{ width: "24px", height: "24px" }}
              />
            </S.SocialLink>
            <S.SocialLink
              href={`https://axiom.trade/t/${CONTRACT_ADDRESS}/@plio`}
              target="_blank"
              rel="noopener noreferrer"
              title="Plio on Axiom"
            >
              <AxiomIcon></AxiomIcon>
            </S.SocialLink>
            <S.SocialLink
              href={`https://neo.bullx.io/terminal?chainId=1399811149&address=${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Plio on BullX Neo"
            >
              <BullXIcon></BullXIcon>
            </S.SocialLink>
            <S.SocialLink
              href={`https://dexscreener.com/solana/2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump`}
              target="_blank"
              rel="noopener noreferrer"
              title="Plio on Dex Screener"
            >
              <img
                src={process.env.PUBLIC_URL + "/dex_bria.png"}
                alt={"dex logo"}
                style={{ width: "24px", height: "24px" }}
              />
            </S.SocialLink>
          </S.SocialLinksContainer>
          <S.ContractAddress
            onClick={handleCopyAddress}
            title="Click to copy address"
          >
            {copyStatus === "idle" && `${CONTRACT_ADDRESS}`}
            {copyStatus === "copied" && "Copied!"}
            {copyStatus === "error" && "Copy Failed"}
          </S.ContractAddress>
          <S.Title>Dive deep into advanced Solana insights, AI-powered tools, and unique utilities, exclusively enhanced for $Plio token holders.</S.Title>
        </S.Header>

        <S.StyledWalletMultiButton />

        <S.Description variants={S.itemVariants}>
          Exclusive tools are indicated by{" "}
          <S.GlowingText>glowing icons</S.GlowingText>. {/* <-- Wrap text */}
          <br /> {/* Added line break for clarity */}
          Current Requirement: {REQUIRED_PLIO_BALANCE.toLocaleString()}{" "}
          {PLIO_SYMBOL}.
          <br /> Connect your wallet to view token details and use tools.
        </S.Description>

        {/* --- Wallet Info --- */}
        <AnimatePresence>
          {connected && ( // Only render WalletInfo if connected
            <S.WalletInfoWrapper
              key="wallet-info"
              variants={S.componentFadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* **** Pass Balance State Down to WalletInfo **** */}
              <WalletInfo
                numericBalance={plioNumericBalance}
                isBalanceLoading={isPlioBalanceLoading}
                balanceError={plioBalanceError}
                isConnected={connected} // Pass connection status
              />
            </S.WalletInfoWrapper>
          )}
        </AnimatePresence>
      </S.AppContentWrapper>
      {/* Render the Active Overlay Component */}
      <AnimatePresence>{renderActiveOverlay()}</AnimatePresence>
    </>
  );
};

export default AppContent;

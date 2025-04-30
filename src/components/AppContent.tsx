// src/components/AppContent.tsx
import React, { FC, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

// Import styles
import * as S from "./AppContent.styles";
import IconBar, { DrawerItemType } from "./IconBar"; // Import the new drawer

import XIcon from "../icons/XIcon";

import DexScreenerLatest from "./DexScreenerLatest";
import ImageGenerator from "./ImageGenerator";
import Roadmap from "./Roadmap";
import AIChat, { Message, Personality } from "./AIChat";
import DexScreenerVolume from "./DexScreenerVolume";

import { FaTelegramPlane } from "react-icons/fa";
import AxiomIcon from "../icons/AxiomIcon"; // Import Message and Personality types
import BullXIcon from "../icons/BullXIcon";
import KolTracker from "./KolTracker";
import GlobalChat from "./GlobalChat"; // <-- Import the new component
// --- Type Definition for window.Jupiter ---

// --- End Type Definition ---
const CONTRACT_ADDRESS = "2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump";



// --- *** Define Restricted Features List Here *** ---
const restrictedFeatures: DrawerItemType[] = [

];
// --- *** End Definition *** ---

// --- App Content Component ---
const AppContent: FC = () => {


  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [activeOverlay, setActiveOverlay] = useState<DrawerItemType | null>(
    null,
  );

  // Chat State (Keep as is)
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatPersonality, setChatPersonality] = useState<Personality>("nice");



  // New handler for when an item is selected in the drawer
  const handleSelectItem = (itemType: DrawerItemType) => {
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

  // --- End Jupiter Integration ---

  const renderActiveOverlay = () => {
    switch (activeOverlay) {
      case "dex":
        return <DexScreenerLatest key="dex-tokens" onClose={closeOverlay} />;
      case "volume":
        return <DexScreenerVolume key="dex-volume" onClose={closeOverlay} />;
      case "kol":
        return <KolTracker key="kol-tracker" onClose={closeOverlay} />;
      case "image":
        return <ImageGenerator key="image-generator" onClose={closeOverlay} />;
      case "roadmap":
        return <Roadmap key="roadmap-overlay" onClose={closeOverlay} />;
      case "globalChat":
        return <GlobalChat key="global-chat-overlay" onClose={closeOverlay} />;
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
      <IconBar
        onSelectItem={handleSelectItem}
        closeOverlay={closeOverlay}
        restrictedFeatures={restrictedFeatures}
      />
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
          <S.Title>
            Dive deep into advanced Solana insights, AI-powered tools, and
            unique utilities, exclusively enhanced for $Plio token holders.
          </S.Title>
        </S.Header>

        <S.StyledWalletMultiButton />

        <S.Description variants={S.itemVariants}>
          Exclusive tools are indicated by{" "}
          <S.GlowingText>glowing icons</S.GlowingText>.
        </S.Description>

        {/* --- Wallet Info --- */}
        <AnimatePresence>
        </AnimatePresence>
      </S.AppContentWrapper>
      <AnimatePresence>{renderActiveOverlay()}</AnimatePresence>
    </>
  );
};

export default AppContent;

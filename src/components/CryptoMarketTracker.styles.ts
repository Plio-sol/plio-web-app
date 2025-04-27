// src/components/CryptoMarketTracker.styles.ts
import styled from "styled-components";
import { motion } from "framer-motion";

// Assuming IconBar width is around 70px on desktop
const SIDEBAR_WIDTH_DESKTOP = "65px"; // Adjust if your sidebar width is different

export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  /* Default: Start from the very left edge (mobile) */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 47, 0.85);
  display: flex;
  z-index: 1000;
  backdrop-filter: blur(5px);

  /* --- Desktop Adjustment --- */
  /* On desktop, start the overlay AFTER the sidebar */
  @media (min-width: 769px) {
    // Use your actual desktop breakpoint
    left: ${SIDEBAR_WIDTH_DESKTOP};
  }
  /* --- End Desktop Adjustment --- */
`;

export const ModalWindow = styled(motion.div)`
  background-color: #0a192f; // Darker background for full screen
  width: 100%; // Fill OverlayContainer width
  height: 100%; // Fill OverlayContainer height
  border: none;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* --- Padding Adjustments --- */
  /* Consistent padding on all sides now, as overlay handles the offset */
  padding-top: 30px;
  padding-right: 40px;
  padding-bottom: 30px;
  padding-left: 40px; // Default left padding

  /* Desktop: Adjust general padding slightly if desired, but NO sidebar calc needed */
  @media (min-width: 769px) {
    padding-top: 40px;
    padding-bottom: 40px;
    padding-right: 50px;
    padding-left: 50px; // Just use regular padding
    /* REMOVED: padding-left: calc(${SIDEBAR_WIDTH_DESKTOP} + 40px); */
  }
  /* --- End Padding Adjustments --- */
`;

// --- CloseButton remains the same ---
export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #8892b0;
  cursor: pointer;
  line-height: 1;
  padding: 5px;
  z-index: 1001; // Ensure it's above modal content
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #61dafb;
    transform: scale(1.1);
  }

  @media (min-width: 769px) {
    top: 20px;
    right: 25px;
  }
`;

// --- Title, Subtitle remain the same ---
export const Title = styled.h2`
  color: #ccd6f6;
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.8em;
  font-weight: 600;
  padding-right: 40px; // Keep padding to avoid close button overlap
  flex-shrink: 0;
`;

export const Subtitle = styled.p`
  color: #8892b0;
  text-align: center;
  margin-right: 32px;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1em;
  flex-shrink: 0;
`;

// --- ContentContainer remains the same ---
export const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #0a192f;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #8892b0;
    border-radius: 4px;
    border: 2px solid #0a192f;
  }
`;

// --- MarketGrid remains the same ---
export const MarketGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  padding-bottom: 20px;
`;

// --- Tab Styles remain the same ---
export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #233554;
  flex-shrink: 0;
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1em;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => (props.isActive ? "#61dafb" : "#8892b0")};
  position: relative;
  transition: color 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #61dafb;
    transform: ${(props) => (props.isActive ? "scaleX(1)" : "scaleX(0)")};
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${(props) => (props.isActive ? "#61dafb" : "#ccd6f6")};
  }
`;

// --- CoinCard, CoinIcon, CoinInfo, etc. remain the same ---
export const CoinCard = styled(motion.div)`
  background-color: #112240; // Lighter card background
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #1d2d44;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition:
    transform 0.2s ease-out,
    box-shadow 0.2s ease-out,
    border-color 0.2s ease-out; // Added border-color transition

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
    border-color: #61dafb; // Keep hover border color
  }
`;

export const CoinIcon = styled.div`
  font-size: 2.5em;
  margin-bottom: 15px;
  color: #61dafb;

  img {
    width: 40px;
    height: 40px;
    display: block;
  }
`;

export const CoinInfo = styled.div`
  margin-bottom: 10px;
`;

export const CoinName = styled.h4`
  color: #ccd6f6;
  font-size: 1.1em;
  margin: 0 0 5px 0;
  font-weight: 600;
`;

export const CoinSymbol = styled.span`
  color: #8892b0;
  font-size: 0.9em;
  text-transform: uppercase;
`;

export const CoinPrice = styled.div`
  color: #ffffff;
  font-size: 1.4em;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

// --- LoadingContainer, LoadingSpinner, ErrorMessage remain the same ---
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-grow: 1;
`;

export const LoadingSpinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.2);
  border-left-color: #61dafb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;

export const ErrorMessage = styled.p`
  color: #ff7b7b;
  font-size: 1em;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(255, 123, 123, 0.1);
  border: 1px solid rgba(255, 123, 123, 0.3);
  border-radius: 4px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

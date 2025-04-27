// src/components/CryptoMarketTracker.styles.ts
import styled from "styled-components";
import { motion } from "framer-motion";

// Re-use overlay and modal structure from Roadmap/ImageGenerator if possible,
// or define them here if they need specific adjustments.
// Assuming generic OverlayContainer, ModalWindow, CloseButton, Title, Subtitle exist
// If not, copy them from Roadmap.styles.ts or similar

export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 47, 0.85); // Dark overlay
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // Ensure it's above other content
  backdrop-filter: blur(5px);
`;

export const ModalWindow = styled(motion.div)`
  background-color: #112240; // Slightly lighter than deep background
  padding: 30px 40px;
  border-radius: 8px;
  width: 90%;
  max-width: 700px; // Adjust width as needed
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7);
  border: 1px solid #233554; // Subtle border

  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #0a192f; // Background of the scrollbar track
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #8892b0; // Color of the scrollbar thumb
    border-radius: 4px;
    border: 2px solid #0a192f; // Creates padding around thumb
  }
`;

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
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #61dafb; // Accent color on hover
  }
`;

export const Title = styled.h2`
  color: #ccd6f6;
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.8em;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  color: #8892b0;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1em;
`;

// Specific styles for the market tracker
export const MarketGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); // Responsive grid
  gap: 20px;
`;

export const CoinCard = styled(motion.div)`
  background-color: #0a192f; // Deep background for cards
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #1d2d44; // Slightly visible border
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }
`;

export const CoinIcon = styled.div`
  font-size: 2.5em; // Icon size
  margin-bottom: 15px;
  color: #61dafb; // Default icon color (can be overridden)

  img {
    width: 40px; // Size for image icons
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

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; // Ensure spinner is visible
`;

// Re-use LoadingSpinner from WalletInfo.styles or define here
export const LoadingSpinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.2);
  border-left-color: #61dafb; // Use accent color
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;

// Re-use ErrorMessage or define here
export const ErrorMessage = styled.p`
  color: #ff7b7b;
  font-size: 1em;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(255, 123, 123, 0.1);
  border: 1px solid rgba(255, 123, 123, 0.3);
  border-radius: 4px;
`;

// *** NEW: Styles for Tabs ***
export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px; // Space between tabs and grid
  border-bottom: 2px solid #233554; // Separator line below tabs
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1em;
  font-weight: 500;
  cursor: pointer;
  color: ${(props) => (props.isActive ? "#61dafb" : "#8892b0")}; // Active vs inactive color
  position: relative;
  transition: color 0.2s ease;

  /* Underline effect for active tab */
  &::after {
    content: "";
    position: absolute;
    bottom: -2px; // Position just below the border-bottom of TabContainer
    left: 0;
    right: 0;
    height: 2px;
    background-color: #61dafb; // Accent color for underline
    transform: ${(props) => (props.isActive ? "scaleX(1)" : "scaleX(0)")};
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${(props) => (props.isActive ? "#61dafb" : "#ccd6f6")}; // Hover color
  }`;
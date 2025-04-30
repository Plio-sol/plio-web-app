// src/components/KolTracker.styles.ts
import styled from "styled-components";
import { motion } from "framer-motion";

// --- Reusable styles from other components ---
const SIDEBAR_WIDTH_DESKTOP = "65px"; // Adjust if your sidebar width is different

export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0; // Mobile default
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 47, 0.85);
  display: flex;
  z-index: 1000;
  backdrop-filter: blur(5px);

  @media (min-width: 769px) {
    // Desktop: Start after sidebar
    left: ${SIDEBAR_WIDTH_DESKTOP};
  }
`;

export const ModalWindow = styled(motion.div)`
  background-color: #0a192f;
  width: 100%;
  height: 100%;
  border: none;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 30px 40px;

  @media (min-width: 769px) {
    padding: 40px 50px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #8892b0;
  cursor: pointer;
  line-height: 1;
  padding: 5px;
  z-index: 1001;
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

export const Title = styled.h2`
  color: #ccd6f6;
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px; // Reduced margin
  font-size: 1.8em;
  font-weight: 600;
  padding-right: 40px; // Avoid close button overlap
  flex-shrink: 0;
`;

export const Subtitle = styled.p`
  color: #8892b0;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px; // Space below subtitle
  margin-right: 2.5%;
  font-size: 1em;
  flex-shrink: 0;
`;

export const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 5px; // Space for scrollbar

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

// --- Specific styles for KolTracker ---

export const KolGrid = styled(motion.div)`
  display: grid;
  // Adjust columns - maybe fewer columns as cards might be taller
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px; // Slightly larger gap
  padding-bottom: 20px;
`;

export const TokenCard = styled(motion.div)`
  background-color: #112240;
  padding: 20px;
  border-radius: 8px; // Slightly more rounded
  border: 1px solid #1d2d44;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease-out,
    box-shadow 0.2s ease-out,
    border-color 0.2s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
    border-color: #61dafb;
  }
`;

export const TokenInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #233554;
`;

export const TokenLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #0a192f; // Fallback background
  flex-shrink: 0;
`;

export const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0; // Prevent overflow issues
`;

export const TokenName = styled.h4`
  color: #ccd6f6;
  font-size: 1.15em;
  margin: 0 0 4px 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TokenSymbol = styled.span`
  color: #8892b0;
  font-size: 0.9em;
  text-transform: uppercase;
`;

// --- Add Address and Copy Button Styles ---
export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 5px; // Space above this section within TokenDetails
  // Removed background/border for cleaner look within TokenDetails
`;

export const AddressText = styled.span`
  color: #8892b0;
  font-size: 0.8em; // Smaller font for address
  font-family:
    "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace; // Monospace font
  overflow: hidden; // Prevent long addresses from breaking layout
  text-overflow: ellipsis; // Add ellipsis for overflow
  white-space: nowrap; // Keep address on one line
  flex-grow: 1; // Allow text to take available space
  min-width: 0; // Ensure shrinking is possible
`;

export const CopyButton = styled.button`
  background-color: #233554; // Button background
  color: #61dafb; // Text color
  border: none;
  border-radius: 4px;
  padding: 4px 8px; // Smaller padding
  font-size: 0.75em; // Smaller font size
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  white-space: nowrap; // Prevent text wrapping
  flex-shrink: 0; // Prevent button from shrinking

  &:hover {
    background-color: #61dafb;
    color: #0a192f;
  }

  &:disabled {
    background-color: #172a45;
    color: #8892b0;
    cursor: not-allowed;
  }
`;
// --- End Address and Copy Button Styles ---
export const TokenMarketCapContainer = styled.div`
  display: flex;
  align-items: baseline; // Align text baselines
  gap: 5px; // Space between label and value
  margin-top: 2px; // Small space above
`;

export const TokenMarketCapLabel = styled.span`
  color: #8892b0;
  font-size: 0.85em; // Slightly smaller than symbol
  font-weight: 500;
  flex-shrink: 0; // Prevent label from shrinking
`;

export const TokenMarketCapValue = styled.span`
  color: #ccd6f6; // Same as TokenName
  font-size: 0.95em; // Slightly larger than label
  font-weight: 500;
`;
export const KolSection = styled.div`
  margin-top: 10px;
`;

export const KolSectionTitle = styled.h5`
  color: #8892b0;
  font-size: 0.9em;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 15px;
  border-bottom: 1px dashed #304a6d;
  padding-bottom: 5px;
`;

export const KolAvatarGrid = styled.div`
  display: flex;
  flex-wrap: wrap; // Allow avatars to wrap
  gap: 12px; // Gap between avatars
`;

export const KolAvatarLink = styled.a`
  display: block; // Make the link a block for easier styling
  border-radius: 50%;
  transition: transform 0.2s ease-out;

  &:hover {
    transform: scale(1.1);
  }
`;

export const KolAvatarPlaceholder = styled.div`
  width: 36px; // Match KolAvatarImage size
  height: 36px; // Match KolAvatarImage size
  border-radius: 50%;
  border: 2px solid #304a6d; // Match KolAvatarImage border
  background-color: #172a45; // Darker background for placeholder
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8892b0; // Placeholder text color
  font-size: 1.2em;
  font-weight: bold;
  line-height: 1;
  user-select: none; // Prevent text selection
`;

export const KolAvatarImage = styled.img`
  width: 36px; // Size of the avatar
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #304a6d; // Add a small border
  background-color: #0a192f; // Fallback background
`;

export const NoKolsMessage = styled.p`
  color: #8892b0;
  font-style: italic;
  font-size: 0.9em;
  text-align: center;
  margin-top: 10px;
`;

// src/components/DexScreenerVolume.styles.ts
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
  margin-bottom: 10px;
  font-size: 1.8em;
  font-weight: 600;
  padding-right: 40px; // Avoid close button overlap
  flex-shrink: 0;
`;

// --- Add Switch Container ---
export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px; // Space below header block
  flex-shrink: 0;
`;

export const Subtitle = styled.p`
  color: #8892b0;
  text-align: center;
  margin-top: 0;
  margin-bottom: 15px; // Space below subtitle
  font-size: 1em;
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 5px; // Space below switch
`;

export const SwitchLabel = styled.span`
  color: #8892b0;
  font-size: 0.9em;
  font-weight: 500;
`;

export const SwitchToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px; // Width of the toggle background
  height: 26px; // Height of the toggle background
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #233554; // Inactive background
    border-radius: 34px;
    transition: background-color 0.3s;

    &:before {
      position: absolute;
      content: "";
      height: 20px; // Height of the slider knob
      width: 20px; // Width of the slider knob
      left: 3px; // Initial position from left
      bottom: 3px; // Position from bottom
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }
  }

  input:checked + span {
    background-color: #61dafb; // Active background
  }

  input:checked + span:before {
    transform: translateX(
      24px
    ); // Move knob to the right (width - knob_width - 2*padding)
  }
`;
// --- End Switch Styles ---

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

// --- Specific styles for DexScreenerVolume ---

export const VolumeGrid = styled(motion.div)`
  display: grid;
  // Adjust columns for more data per card
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding-bottom: 20px; // Padding at the bottom of the grid
`;

export const TokenCard = styled(motion.div)`
  background-color: #112240;
  padding: 20px;
  border-radius: 6px;
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

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  border-bottom: 1px solid #233554;
  padding-bottom: 10px;
`;

export const TokenRank = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  color: #61dafb;
  margin-right: 15px;
`;

export const TokenNameSymbol = styled.div`
  flex-grow: 1;
  text-align: left; // Align left within its container
`;

export const TokenName = styled.h4`
  color: #ccd6f6;
  font-size: 1.2em;
  margin: 0 0 3px 0;
  font-weight: 600;
  word-break: break-word; // Handle long names
`;

export const TokenSymbol = styled.span`
  color: #8892b0;
  font-size: 0.95em;
  text-transform: uppercase;
`;

export const TokenDataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Two columns for data
  gap: 10px 15px; // Row gap, Column gap
  margin-bottom: 15px;
`;

export const DataRow = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

export const DataLabel = styled.span`
  color: #8892b0;
  font-size: 0.8em;
  margin-bottom: 3px;
  text-transform: uppercase;
`;

export const DataValue = styled.span`
  color: #ccd6f6;
  font-size: 1em;
  font-weight: 500;
`;

export const PriceChange = styled(DataValue)<{ value: number | null }>`
  color: ${(props) =>
    props.value === null || props.value === 0
      ? "#8892b0" // Grey for no change or null
      : props.value > 0
        ? "#33cc99" // Green for positive
        : "#ff7b7b"}; // Red for negative
`;

export const DexLink = styled.a`
  color: #61dafb;
  background-color: #172a45;
  padding: 8px 15px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9em;
  text-align: center;
  margin-top: auto; // Push link to the bottom
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #233554;
    color: #ffffff;
  }
`;

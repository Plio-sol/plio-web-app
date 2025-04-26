// src/components/Roadmap.styles.ts
import styled from "styled-components";
import { motion } from "framer-motion";

// --- Base Modal Styles (Copied & Adapted) ---
export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //background-color: rgba(10, 25, 47, 0.9);
  display: flex;
  flex-direction: column; // Align modal window at the top
  align-items: center;
  justify-content: flex-start; // Start content from top
  z-index: 1000;
  backdrop-filter: blur(5px);
  margin: auto;
  //color: #ccd6f6;

  /* Mobile Styles */
  padding: 10px 10px 10px 10px;
  width: 90%;
  max-width: 90vw;
  max-height: 85vh; // Allow modal to take most of the height

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 20px; // More padding around modal on desktop
    width: 900px;
    max-width: 900px;
    max-height: 80vh; // Slightly less height on desktop
    justify-content: center; // Center modal vertically on desktop
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const ModalWindow = styled(motion.div)`
  background-color: #0a192f; // Dark background
  border: 1px solid rgba(100, 116, 139, 0.4);
  border-radius: 12px;
  width: 100%; // Take full width of OverlayContainer's constraints
  max-height: 100%; // Take full height of OverlayContainer's constraints
  display: flex;
  flex-direction: column;
  overflow: hidden; // Important: Prevents content overflow, allows internal scroll
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  /* Mobile Styles */
  padding: 20px 15px; // Padding inside the modal

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 30px 35px;
  }
`;

export const CloseButton = styled(motion.button)`
  position: absolute;
  background: none;
  border: none;
  color: #a8b2d1;
  cursor: pointer;
  line-height: 1;
  z-index: 2;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
    color: #ff69b4; // Accent color on hover
  }

  /* Mobile Styles */
  top: 10px; // Adjust position
  right: 10px; // Adjust position
  font-size: 2.1em;
  padding: 4px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    top: 15px;
    right: 15px;
    font-size: 2.5em;
    padding: 5px 10px;
  }
`;

// --- Roadmap Specific Styles ---

export const Title = styled.h1`
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  width: 100%;
  padding-right: 30px; // Space for close button

  /* Mobile Styles */
  margin-bottom: 5px; // Less space below title
  font-size: 1.6em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 8px;
    font-size: 1.9em;
    padding-right: 40px;
  }
`;

export const Subtitle = styled.p`
  color: #a8b2d1;
  text-align: center;
  width: 100%;
  font-weight: 400;

  /* Mobile Styles */
  margin-bottom: 20px;
  font-size: 0.95em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 30px;
    font-size: 1.05em;
  }
`;

export const RoadmapGrid = styled(motion.div)`
  width: 100%;
  flex-grow: 1; // Take remaining space
  min-height: 0; // Needed for flex-grow and overflow
  overflow-y: auto; // Enable scrolling for the grid area
  display: grid;
  padding: 5px; // Small padding around the grid items

  /* Mobile Styles */
  grid-template-columns: 1fr; // Single column
  gap: 15px; // Reduced gap

  /* Desktop Overrides */
  @media (min-width: 769px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(350px, 1fr)
    ); // Responsive multi-column
    gap: 25px; // Restore desktop gap
    padding: 10px;
  }

  /* Custom Scrollbar styling (optional but nice) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(42, 61, 88, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(138, 43, 226, 0.6); // Use an accent color
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(138, 43, 226, 0.8);
  }
`;

export const RoadmapCard = styled(motion.div)`
  background-color: #172a45; // Slightly different background for cards
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #8a2be2; // Accent border on hover
  }

  /* Mobile Styles */
  padding: 18px 15px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 20px 25px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center; // Align icon, title, badge vertically
  gap: 10px; // Spacing between items
  margin-bottom: 12px;
  width: 100%; // Ensure header takes full width for flexbox calculations
  overflow: hidden; // Prevent content from spilling out if absolutely necessary

  /* --- Explicitly prevent flex items from wrapping --- */
  flex-wrap: nowrap;
  /* --- End nowrap --- */
`;
// --- End UPDATED CardHeader ---

export const FeatureIcon = styled.div`
  color: #8a2be2; // Accent color for icon
  font-size: 1.4em;
  flex-shrink: 0; // Prevent icon from shrinking
`;

// --- CardTitle (Keep previous change with min-width: 0) ---
export const CardTitle = styled.h3`
  flex-grow: 1; // Allow title to take available space when possible
  margin: 0;
  color: #ffffff;
  font-weight: 600;
  line-height: 1.3;

  /* Allows the element to shrink below its default minimum content size */
  min-width: 0;
  /* Text *within* the title can wrap if needed (default white-space: normal) */

  /* Mobile Styles */
  font-size: 1.1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 1.2em;
  }
`;
// --- End CardTitle ---

// Define status colors/styles
const getStatusColor = (status: string) => {
  switch (status) {
    case "planned":
      return "#facc15"; // Yellow
    case "in-progress":
      return "#61dafb"; // Blue
    case "completed":
      return "#50fa7b"; // Green
    default:
      return "#a8b2d1"; // Default grey
  }
};
const getStatusBackgroundColor = (status: string) => {
  switch (status) {
    case "planned":
      return "rgba(250, 204, 21, 0.15)";
    case "in-progress":
      return "rgba(97, 218, 251, 0.15)";
    case "completed":
      return "rgba(80, 250, 123, 0.15)";
    default:
      return "rgba(168, 178, 209, 0.15)";
  }
};

export const StatusBadge = styled.span<{ status: string }>`
  padding: 3px 8px;
  border-radius: 12px; // Pill shape
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => getStatusColor(props.status)};
  background-color: ${(props) => getStatusBackgroundColor(props.status)};
  white-space: nowrap; // Prevent wrapping
  flex-shrink: 0; // Prevent badge from shrinking

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.8em;
    padding: 4px 10px;
  }
`;

export const CardDescription = styled.p`
  color: #a8b2d1;
  line-height: 1.6;
  margin: 0; // Remove default margin

  /* Mobile Styles */
  font-size: 0.9em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.95em;
  }
`;

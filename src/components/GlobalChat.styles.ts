// src/components/GlobalChat.styles.ts
import styled, { css } from "styled-components"; // Import css for conditional styles
import { motion } from "framer-motion";

// --- Reusable styles (Assume these exist or define them) ---
const SIDEBAR_WIDTH_DESKTOP = "65px"; // Match IconBar width
const neonColor = "#61dafb"; // Your accent color
const primaryBg = "#0a192f"; // Deep dark blue/navy
const secondaryBg = "#112240"; // Lighter dark blue/navy
const tertiaryBg = "#0e1f34"; // Background for message list
const lightText = "#ccd6f6"; // Lightest text
const mediumText = "#8892b0"; // Greyish text
const borderColor = "#1d2d44"; // Subtle border
const darkerBorderColor = "#233554"; // Slightly darker border/bg

// --- Overlay & Modal (Reused) ---
export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0; // Mobile default
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 47, 0.85); // primaryBg with alpha
  display: flex;
  z-index: 1000;
  backdrop-filter: blur(5px);

  @media (min-width: 769px) {
    left: ${SIDEBAR_WIDTH_DESKTOP};
  }
`;


export const ModalWindow = styled(motion.div)`
    background-color: ${primaryBg};
    width: 100%; // Keep width 100%
    // height: 100%; // <-- REMOVE height: 100%
    border: none;
    // position: relative; // <-- REMOVE position: relative

    position: absolute; // <-- ADD absolute positioning
    top: 0;           // <-- ADD top: 0
    left: 0;          // <-- ADD left: 0
    right: 0;         // <-- ADD right: 0
    bottom: 0;        // <-- ADD bottom: 0
    box-sizing: border-box; // <-- ADD box-sizing

    display: flex;
    flex-direction: column;
    overflow: hidden; // Keep this to hide potential overflow during transitions etc.
    padding: 20px; // Keep padding

    @media (min-width: 769px) {
        padding: 30px 40px; // Keep responsive padding
    }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: ${mediumText};
  cursor: pointer;
  line-height: 1;
  padding: 5px;
  z-index: 1001;
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: ${neonColor};
    transform: scale(1.1);
  }

  @media (min-width: 769px) {
    top: 15px;
    right: 20px;
  }
`;

// --- Chat Specific Styles ---

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-right: 40px; // Avoid close button overlap
  flex-shrink: 0; // Prevent shrinking
`;

export const Title = styled.h2`
  color: ${lightText};
  font-size: 1.6em;
  font-weight: 600;
  margin: 0;
`;

export const SetNameButton = styled.button`
  background: none;
  border: 1px solid ${mediumText};
  color: ${mediumText};
  padding: 5px 10px;
  font-size: 0.8em;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; // Prevent wrapping

  &:hover {
    border-color: ${neonColor};
    color: ${neonColor};
    background-color: rgba(97, 218, 251, 0.1); // Slight neon bg on hover
  }
`;

export const NameInputContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px; // Default margin when visible
  flex-shrink: 0;
`;

export const NameInput = styled.input`
  flex-grow: 1;
  padding: 8px 12px;
  background-color: ${secondaryBg};
  border: 1px solid ${darkerBorderColor};
  color: ${lightText};
  border-radius: 4px;
  font-size: 0.9em;
  &:focus {
    outline: none;
    border-color: ${neonColor};
  }
`;

export const SaveNameButton = styled.button`
  background-color: ${neonColor};
  color: ${primaryBg};
  border: none;
  padding: 8px 15px;
  font-size: 0.9em;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

export const MessageListContainer = styled.div`
  flex-grow: 1; // Take available vertical space
  overflow-y: auto; // Enable vertical scrolling
  margin-bottom: 15px; // Space before input area
  padding: 10px 5px 10px 10px; // Padding inside scroll area (less on right for scrollbar)
  border: 1px solid ${borderColor};
  border-radius: 4px;
  background-color: ${tertiaryBg}; // Slightly different background for contrast
    min-height: 0;
  /* Custom Scrollbar Styles */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent; // Track blends with container background
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${mediumText};
    border-radius: 4px;
    border: 2px solid ${tertiaryBg}; // Creates padding around thumb
  }
`;

// Props interface for styled components needing conditional styles
interface MessageStyleProps {
    issender?: boolean;
    isbot?: boolean;
}

export const MessageItem = styled(motion.div)<MessageStyleProps>`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  /* Align self based on sender */
  align-items: ${(props) => (props.issender ? "flex-end" : "flex-start")};
`;

export const MessageBubble = styled.div<MessageStyleProps>`
  max-width: 75%; // Prevent bubbles from taking full width
  padding: 8px 14px;
  border-radius: 18px; // Bubble shape
  color: ${lightText};
  word-wrap: break-word; // Allow long words to break
  line-height: 1.4;
  font-size: 0.95em;

  /* Conditional Background Colors */
  ${(props) => {
    if (props.isbot) {
        return css`
        background-color: #2a4c6d; // Distinct bot color
        color: #a6c8e8; // Lighter text for bot
      `;
    } else if (props.issender) {
        return css`
        background-color: #1d3a5f; // Sender color (e.g., slightly darker blue)
        border-bottom-right-radius: 4px; // Tail effect for sender
      `;
    } else {
        return css`
        background-color: ${darkerBorderColor}; // Receiver color
        border-bottom-left-radius: 4px; // Tail effect for receiver
      `;
    }
}}
`;

export const SenderName = styled.span<MessageStyleProps>`
  font-size: 0.75em;
  margin-bottom: 3px;
  padding: 0 5px; // Horizontal padding to align with bubble edge
  font-weight: 600;

  /* Conditional Color */
  color: ${(props) =>
    props.isbot
        ? "#a6c8e8" // Bot name color matches bot text
        : props.issender
            ? neonColor // Highlight sender's name
            : mediumText}; // Default color for others
`;

export const Timestamp = styled.span`
  font-size: 0.65em;
  color: ${mediumText};
  opacity: 0.8;
  margin-top: 4px;
  padding: 0 5px; // Horizontal padding
`;

export const InputArea = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0; // Prevent shrinking
`;

export const MessageInput = styled.input`
  flex-grow: 1; // Take available horizontal space
  padding: 10px 15px;
  background-color: ${secondaryBg};
  border: 1px solid ${darkerBorderColor};
  color: ${lightText};
  border-radius: 20px; // Rounded input field
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: ${neonColor};
  }

  &::placeholder {
    color: ${mediumText};
    opacity: 0.7;
  }

  &:disabled {
    background-color: ${borderColor}; // Indicate disabled state
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  background-color: ${neonColor};
  color: ${primaryBg};
  border: none;
  border-radius: 50%; // Circular button
  width: 40px;
  height: 40px;
  font-size: 1.2em; // Icon size
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  flex-shrink: 0; // Prevent shrinking

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BotButton = styled(SendButton)`
  background-color: #2a4c6d; // Bot button color matches bot bubble
  color: #a6c8e8; // Bot button icon color

  &:hover:not(:disabled) {
    opacity: 0.85; // Consistent hover effect
  }
`;

// --- Loading & Error (Reused) ---
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; // Ensure it takes some space
  flex-grow: 1; // Allow it to fill message list if empty
`;

export const LoadingSpinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.2); // lightText with alpha
  border-left-color: ${neonColor};
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;

export const ErrorMessage = styled.p`
  color: #ff7b7b; // Standard error red
  font-size: 1em;
  text-align: center;
  margin: 20px;
  padding: 10px;
  background-color: rgba(255, 123, 123, 0.1);
  border: 1px solid rgba(255, 123, 123, 0.3);
  border-radius: 4px;
  flex-grow: 1; // Allow it to fill message list if empty
  display: flex;
  align-items: center;
  justify-content: center;
`;
// src/components/AIChat.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// --- Base Modal Styles (Copied & Adapted) ---
export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; // Full screen overlay
  background-color: rgba(10, 25, 47, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // Center modal vertically and horizontally
  z-index: 1000;
  backdrop-filter: blur(5px);
  margin: auto;
  color: #ccd6f6;

  /* Mobile Styles */
  padding: 10px; // Padding around the modal

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 20px;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const ModalWindow = styled(motion.div)`
  background-color: #0a192f;
  border: 1px solid rgba(100, 116, 139, 0.4);
  border-radius: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Crucial for internal scrolling
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  /* Mobile Styles */
  max-width: 95vw;
  height: 90vh; // Take up most of the screen height
  padding: 15px 10px 10px 10px; // Tighter padding

  /* Desktop Overrides */
  @media (min-width: 769px) {
    max-width: 700px; // Max width for chat on desktop
    height: 75vh; // Max height on desktop
    padding: 25px 20px 15px 20px; // More padding
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
  top: 8px;
  right: 8px;
  font-size: 2.1em;
  padding: 4px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    top: 12px;
    right: 12px;
    font-size: 2.5em;
    padding: 5px 10px;
  }
`;

export const Title = styled.h1`
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  width: 100%;
  padding: 0 30px; // Space for close button
  flex-shrink: 0; // Prevent shrinking

  /* Mobile Styles */
  margin-bottom: 15px;
  font-size: 1.5em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 20px;
    font-size: 1.7em;
    padding: 0 40px;
  }
`;

// --- Chat Specific Styles ---

export const ChatArea = styled.div`
  flex-grow: 1; // Takes up available vertical space
  overflow-y: auto; // Enables vertical scrolling
  padding: 10px 5px; // Padding inside the scrollable area
  display: flex;
  flex-direction: column;
  gap: 12px; // Space between messages
  width: 100%;

  /* Custom Scrollbar styling (optional) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(42, 61, 88, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(97, 218, 251, 0.5);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(97, 218, 251, 0.7);
  }
`;

export const PlaceholderText = styled.p`
  color: #8892b0;
  font-style: italic;
  text-align: center;
  margin: auto; /* Center vertically and horizontally */
  padding: 20px;
`;

export const MessageBubble = styled(motion.div)<{
  role: "user" | "model";
  isLoading?: boolean;
}>`
  padding: 10px 15px;
  border-radius: 18px; // More rounded bubbles
  max-width: 80%; // Prevent bubbles from being full width
  word-wrap: break-word; // Break long words
  line-height: 1.5;
  font-size: 0.95em;

  ${({ role }) =>
    role === "user"
      ? `
        background-color: #61dafb; // User bubble color (e.g., blue)
        color: #0a192f; // Dark text on light bubble
        align-self: flex-end; // Align user messages to the right
        border-bottom-right-radius: 4px; // Slightly flatten corner
      `
      : `
        background-color: #172a45; // Model bubble color (e.g., darker blue)
        color: #ccd6f6; // Light text on dark bubble
        align-self: flex-start; // Align model messages to the left
        border-bottom-left-radius: 4px; // Slightly flatten corner
      `}

  /* Style links within bubbles */
    a {
    color: ${({ role }) =>
      role === "user" ? "#0a192f" : "#8be9fd"}; // Link color based on bubble
    text-decoration: underline;
    &:hover {
      opacity: 0.8;
    }
  }

  /* Loading specific style */
  ${({ isLoading }) =>
    isLoading &&
    `
        font-style: italic;
        color: #a8b2d1;
    `}

  /* Desktop Overrides */
    @media (min-width: 769px) {
    font-size: 1em;
    max-width: 75%;
  }
`;

const pulse = keyframes`
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
`;

export const LoadingIndicator = styled.div`
  display: inline-block;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

export const InputArea = styled.form`
  display: flex;
  align-items: center;
  padding: 10px 5px 5px 5px; // Padding around input/button
  gap: 10px;
  border-top: 1px solid rgba(100, 116, 139, 0.3); // Separator line
  flex-shrink: 0; // Prevent shrinking
  width: 100%;
`;

export const ChatInput = styled.input`
  flex-grow: 1;
  border-radius: 20px; // Pill shape input
  border: 1px solid #304a6d;
  background-color: #0a192f;
  color: #ccd6f6;
  outline: none;
  padding: 10px 15px;
  font-size: 1em;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #61dafb;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

export const SendButton = styled(motion.button)`
  flex-shrink: 0; // Prevent shrinking
  cursor: pointer;
  background-color: #61dafb;
  color: #0a192f;
  border: none;
  border-radius: 50%; // Circular button
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #4ac7e8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff7b7b;
  text-align: center;
  font-size: 0.9em;
  padding: 5px 10px;
  margin: 5px 0;
  width: 100%;
  flex-shrink: 0;
`;

// --- Personality Toggle Styles ---
export const PersonalityToggleContainer = styled.div`
  position: absolute;
  top: 10px; // Align with close button roughly
  left: 10px;
  display: flex;
  gap: 5px;
  background-color: rgba(23, 42, 69, 0.8); // Slightly transparent background
  padding: 4px;
  border-radius: 15px; // Rounded container
  z-index: 3; // Above modal content but below close button if needed

  @media (min-width: 769px) {
    top: 15px;
    left: 15px;
    gap: 8px;
    padding: 5px;
    border-radius: 18px;
  }
`;

export const ToggleButton = styled.button<{ isActive: boolean }>`
  background-color: ${({ isActive }) => (isActive ? "#61dafb" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#0a192f" : "#a8b2d1")};
  border: none;
  border-radius: 12px; // Rounded buttons
  padding: 5px 10px;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ isActive }) =>
      isActive ? "#4ac7e8" : "rgba(100, 116, 139, 0.2)"};
  }

  svg {
    font-size: 1.1em; // Make icon slightly larger than text
  }

  @media (min-width: 769px) {
    font-size: 0.85em;
    padding: 6px 12px;
    border-radius: 15px;
  }
`;

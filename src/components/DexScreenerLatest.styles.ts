// src/components/DexScreenerLatest.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 47, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  z-index: 1000; // Ensure modals are above IconBar
  backdrop-filter: blur(5px);
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  color: #ccd6f6; // Added default color

  /* Mobile Styles */
  padding: 10px 10px 10px 10px; // Further reduced padding
  width: 90%; // Use slightly less width
  max-width: 90vw; // Use slightly less width
  max-height: 85vh; // Reduced max height

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 10px 20px 20px 20px; // Restore desktop padding
    width: 900px; /* Restore specific width */
  }

  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
  }
`;

export const CloseButton = styled(motion.button)`
  position: absolute;
  background: transparent;
  border: none;
  color: #a8b2d1;
  cursor: pointer;
  line-height: 1;
  z-index: 2;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  /* Mobile Styles */
  right: 45%;
  top: 0.2%;
  font-size: 2.1em; // Slightly smaller maybe

  /* Desktop Overrides */
  @media (min-width: 769px) {
    top: 15px;
    right: 45%;
    font-size: 2.5em;
    padding: 5px 10px;
  }
`;

export const DisplayTitle = styled.h1`
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;
  width: 100%;
  padding-right: 25px; // Space for close button

  /* Mobile Styles */
  margin-bottom: 20px;
  font-size: 1.6em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 25px;
    font-size: 1.8em;
    padding-right: 30px;
  }
`;

export const ResultsArea = styled.div`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 5px; // Less space for scrollbar on mobile
  padding-left: 5px;
  padding-top: 5px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding-right: 8px;
    padding-left: 4px;
  }

  /* Custom Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(42, 61, 88, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(97, 218, 251, 0.6);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(97, 218, 251, 0.8);
  }
`;

export const ResultsGrid = styled(motion.div)`
  width: 100%;
  display: grid;
  padding-bottom: 10px;
  padding-top: 5px;

  /* Mobile Styles */
  grid-template-columns: 1fr; // Single column
  gap: 15px; // Reduced gap

  /* Desktop Overrides */
  @media (min-width: 769px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(375px, 1fr)
    ); // Restore multi-column
    gap: 25px; // Restore desktop gap
  }
`;

export const Spinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.3);
  border-left-color: #facc15;
  border-radius: 50%;
  width: 40px; // Slightly smaller spinner
  height: 40px;
  margin: 30px auto;
  animation: ${spin} 1s linear infinite;
  flex-shrink: 0;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    width: 50px;
    height: 50px;
    margin: 40px auto;
  }
`;

export const TokenCard = styled(motion.div)`
  background-color: #172a45;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Mobile Styles */
  padding: 15px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 20px 22px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;

  /* Mobile Styles */
  gap: 10px;
  margin-bottom: 12px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    gap: 12px;
    margin-bottom: 15px;
  }
`;

export const TokenIcon = styled.img`
  display: block;
  border-radius: 50%;
  object-fit: cover;
  background-color: #0a192f;
  flex-shrink: 0;

  /* Mobile Styles */
  width: 36px;
  height: 36px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    width: 40px;
    height: 40px;
  }
`;

export const TokenInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TokenAddress = styled.p`
  font-family:
    "SFMono-Regular", Consolas, "Roboto Mono", "Droid Sans Mono",
    "Liberation Mono", Menlo, Courier, monospace;
  color: #8892b0;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Mobile Styles */
  font-size: 0.8em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.85em;
  }
`;

export const ChainBadge = styled.span`
  display: inline-block;
  background-color: rgba(250, 204, 21, 0.15);
  color: #facc15;
  border-radius: 5px;
  font-weight: 600;
  text-transform: capitalize;

  /* Mobile Styles */
  padding: 2px 6px;
  font-size: 0.7em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 3px 8px;
    font-size: 0.75em;
  }
`;

export const TokenDescription = styled.p`
  color: #ccd6f6;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Mobile Styles */
  font-size: 0.9em;
  margin-bottom: 15px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.95em;
    margin-bottom: 18px;
  }
`;

export const LinksContainer = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;

  /* Mobile Styles */
  gap: 8px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    gap: 10px;
  }
`;

export const LinkButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #233554;
  color: #ccd6f6;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  /* Mobile Styles */
  padding: 5px 10px;
  font-size: 0.8em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 6px 12px;
    font-size: 0.85em;
  }

  &:hover {
    background-color: #304a6d;
  }

  &.website::before {
    content: "🌐";
  }
  &.twitter::before {
    content: "𝕏";
  }
  &.telegram::before {
    content: "📱";
  }
`;

export const ErrorMessage = styled.p`
  color: #ff7b7b;
  text-align: center;
  margin: 20px auto;
  flex-shrink: 0;

  /* Mobile Styles */
  font-size: 1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 1.1em;
    margin: 30px auto;
  }
`;

export const NoDataMessage = styled.p`
  color: #a8b2d1;
  text-align: center;
  margin: 20px auto;
  flex-shrink: 0;

  /* Mobile Styles */
  font-size: 1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 1.1em;
    margin: 30px auto;
  }
`;

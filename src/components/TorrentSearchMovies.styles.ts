// src/components/TorrentSearchMovies.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// --- Keyframes (Spinner) ---
export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// --- Styled Components ---

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
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
  color: #ccd6f6;

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
    right: 45%; // Restore desktop position
    font-size: 2.5em;
    padding: 5px 10px;
  }
`;

export const SearchTitle = styled.h1`
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
    font-size: 2em;
    padding-right: 30px;
  }
`;

export const SearchForm = styled.form`
  width: 100%;
  max-width: 700px;
  display: flex;
  border-radius: 8px;
  background-color: rgba(23, 42, 69, 0.8);
  border: 1px solid #4a5568;
  transition: border-color 0.3s ease;
  flex-shrink: 0;
  margin-left: auto;
  margin-right: auto;

  /* Mobile Styles */
  margin-bottom: 10px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 10px; // Keep same or adjust if needed
  }

  &:focus-within {
    border-color: #61dafb;
  }
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  background-color: transparent;
  color: #ccd6f6;
  border: none;
  border-radius: 8px 0 0 8px;
  outline: none;

  /* Mobile Styles */
  padding: 12px 15px;
  font-size: 1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 14px 18px;
    font-size: 1.1em;
  }
`;

export const SearchButton = styled(motion.button)`
  cursor: pointer;
  background-color: #61dafb;
  color: #0a192f;
  border: none;
  border-radius: 0 8px 8px 0;
  font-weight: 600;

  /* Mobile Styles */
  padding: 12px 20px;
  font-size: 1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 14px 25px;
    font-size: 1.1em;
  }

  &:disabled {
    background-color: #555;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const HintText = styled.p`
  color: #a8b2d1;
  max-width: 700px;
  text-align: center;
  flex-shrink: 0;
  margin-left: auto;
  margin-right: auto;

  /* Mobile Styles */
  font-size: 0.85em;
  margin-top: 5px;
  margin-bottom: 20px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.9em;
    margin-bottom: 30px;
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

  /* Mobile Styles */
  grid-template-columns: 1fr; // Single column
  gap: 15px; // Reduced gap

  /* Desktop Overrides */
  @media (min-width: 769px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(340px, 1fr)
    ); // Restore multi-column
    gap: 30px; // Restore desktop gap
  }
`;

export const Spinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.3);
  border-left-color: #61dafb;
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

export const MovieResultCard = styled(motion.div)`
  background-color: #172a45;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  /* Mobile Styles */
  padding: 15px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 20px 25px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;

  /* Mobile Styles */
  gap: 10px;
  margin-bottom: 10px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    gap: 15px;
    margin-bottom: 15px;
  }
`;

export const CoverImage = styled.img`
  display: block;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
  background-color: #0a192f;
  flex-shrink: 0; // Prevent shrinking

  /* Mobile Styles */
  width: 65px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    width: 80px;
  }
`;

export const HeaderText = styled.div`
  flex: 1;
  min-width: 0; // Prevent overflow issues
`;

export const CardTitle = styled.h3`
  margin-top: 0;
  color: #ffffff;
  line-height: 1.3;

  /* Mobile Styles */
  margin-bottom: 3px;
  font-size: 1.1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 5px;
    font-size: 1.2em;
  }
`;

export const CardSubTitle = styled.p`
  color: #a8b2d1;
  margin: 0 0 8px 0;

  /* Mobile Styles */
  font-size: 0.85em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.9em;
    margin: 0 0 10px 0;
  }
`;

export const CardInfo = styled.div`
  color: #a8b2d1;
  line-height: 1.6;
  display: flex;
  flex-wrap: wrap;

  /* Mobile Styles */
  margin-bottom: 10px;
  font-size: 0.85em;
  gap: 6px 12px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 15px;
    font-size: 0.9em;
    gap: 8px 18px;
  }
`;

export const InfoItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px; // Reduced gap
  white-space: nowrap;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    gap: 5px; // Restore desktop gap
  }

  &.quality::before {
    content: "🎬";
    margin-right: 2px;
  }
  &.rating::before {
    content: "⭐";
    margin-right: 2px;
  }
  &.size::before {
    content: "💾";
    margin-right: 2px;
  }
  &.seeds::before {
    content: "▲";
    color: #50fa7b;
  }
  &.peers::before {
    content: "▼";
    color: #ffb86c;
  }
`;

export const MagnetLink = styled(motion.a)`
  display: block;
  margin-top: auto;
  background: linear-gradient(45deg, #61dafb, #8be9fd);
  color: #0a192f;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(97, 218, 251, 0.3);

  /* Mobile Styles */
  padding: 8px 12px;
  font-size: 0.9em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 10px 15px;
    font-size: 0.95em;
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

export const NoResultsMessage = styled.p`
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

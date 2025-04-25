// src/components/TorrentSearchGames.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export interface SourceTagProps {
  source: "DODI" | "FitGirl";
}

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
    right: 45%;
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
    border-color: #8a2be2;
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
  background-color: #8a2be2;
  color: white;
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
    background-color: rgba(138, 43, 226, 0.6);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(138, 43, 226, 0.8);
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
      minmax(300px, 1fr)
    ); // Restore multi-column
    gap: 25px; // Restore desktop gap
  }
`;

export const Spinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.3);
  border-left-color: #8a2be2;
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

export const ResultCard = styled(motion.div)`
  background-color: #172a45;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  /* Mobile Styles */
  padding: 15px;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 20px 22px;
  }
`;

export const CardTitle = styled.h3`
  margin-top: 0;
  color: #ffffff;
  line-height: 1.4;

  /* Mobile Styles */
  margin-bottom: 10px;
  font-size: 1.1em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 12px;
    font-size: 1.2em;
  }
`;

export const CardInfo = styled.p`
  color: #a8b2d1;
  line-height: 1.5;

  /* Mobile Styles */
  margin-bottom: 15px;
  font-size: 0.9em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 20px;
    font-size: 0.95em;
  }
`;

export const SourceTag = styled.span<SourceTagProps>`
  font-weight: bold;
  color: ${(props) => (props.source === "DODI" ? "#e67e22" : "#9b59b6")};
  margin-left: 8px;
  padding: 3px 8px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.source === "DODI"
      ? "rgba(230, 126, 34, 0.15)"
      : "rgba(155, 89, 182, 0.15)"};
  font-size: 0.85em; // Slightly smaller

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.9em; // Restore desktop size
  }
`;

export const DownloadLink = styled(motion.a)`
  display: block;
  margin-top: auto;
  background: linear-gradient(45deg, #8a2be2, #9932cc);
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(138, 43, 226, 0.3);

  /* Mobile Styles */
  padding: 10px 15px;
  font-size: 0.95em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 12px 15px;
    font-size: 1em;
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

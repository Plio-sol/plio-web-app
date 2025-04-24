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
  background-color: rgba(10, 25, 47, 0.98);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  overflow-y: auto;
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
`;

export const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 25px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 2.5em;
  background: transparent;
  border: none;
  color: #a8b2d1;
  line-height: 1;
`;

export const SearchTitle = styled.h1`
  color: #ffffff;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 2em;
`;

export const SearchForm = styled.form`
  width: 100%;
  max-width: 700px;
  display: flex;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: rgba(23, 42, 69, 0.8);
  border: 1px solid #4a5568;
  transition: border-color 0.3s ease;
  &:focus-within {
    border-color: #61dafb;
  } // YTS Blue?
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  padding: 14px 18px;
  font-size: 1.1em;
  background-color: transparent;
  color: #ccd6f6;
  border: none;
  border-radius: 8px 0 0 8px;
  outline: none;
`;

export const SearchButton = styled(motion.button)`
  padding: 14px 25px;
  font-size: 1.1em;
  cursor: pointer;
  background-color: #61dafb; // YTS Blue?
  color: #0a192f; // Dark text
  border: none;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  &:disabled {
    background-color: #555;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const HintText = styled.p`
  font-size: 0.9em;
  color: #a8b2d1;
  margin-top: 5px;
  margin-bottom: 30px;
  max-width: 700px;
  text-align: center;
`;

export const ResultsArea = styled.div`
  width: 100%;
  max-width: 1100px; // Wider for movie cards potentially
  margin-top: 20px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const ResultsGrid = styled(motion.div)`
  width: 100%;
  display: grid;
  // Adjust grid: maybe fewer columns, wider cards?
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 30px; // Increase gap slightly
`;

export const Spinner = styled(motion.div)`
  border: 4px solid rgba(204, 214, 246, 0.3);
  border-left-color: #61dafb; // YTS Blue
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-top: 40px;
`;

// Updated Card Style
export const MovieResultCard = styled(motion.div)`
  background-color: #172a45;
  border-radius: 10px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden; // Hide overflowing parts of image/content
  display: flex;
  flex-direction: column;
`;

export const CardContent = styled.div`
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; // Allow content to fill space
`;

export const CardHeader = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: flex-start;
`;

export const CoverImage = styled.img`
  display: block;
  width: 80px; // Adjust size
  height: auto;
  border-radius: 4px;
  object-fit: cover;
  background-color: #0a192f; // Placeholder bg
`;

export const HeaderText = styled.div`
  flex: 1;
`;

export const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 5px;
  color: #ffffff;
  font-size: 1.2em;
  line-height: 1.3;
`;

export const CardSubTitle = styled.p`
  font-size: 0.9em;
  color: #a8b2d1;
  margin: 0 0 10px 0;
`;

// Updated Info line
export const CardInfo = styled.div`
  margin-bottom: 15px;
  color: #a8b2d1;
  font-size: 0.9em;
  line-height: 1.6;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px; // Spacing between info items
`;

// Specific styles for info items
export const InfoItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;

  // Example icons (using text, replace with actual icons later if desired)
  &.quality::before {
    content: "🎬";
    margin-right: 3px;
  }
  &.rating::before {
    content: "⭐";
    margin-right: 3px;
  }
  &.size::before {
    content: "💾";
    margin-right: 3px;
  }
  &.seeds::before {
    content: "▲";
    color: #50fa7b;
  }
  &.peers::before {
    content: "▼";
    color: #ffb86c;
  } // Orange for peers?
`;

export const MagnetLink = styled(motion.a)`
  display: block;
  margin-top: auto; // Pushes to bottom of CardContent
  padding: 10px 15px;
  background: linear-gradient(45deg, #61dafb, #8be9fd); // YTS Blue gradient
  color: #0a192f;
  text-decoration: none;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95em;
  box-shadow: 0 4px 10px rgba(97, 218, 251, 0.3);
`;

// Error/No Results messages (can reuse)
export const ErrorMessage = styled.p`
  color: #ff7b7b;
  text-align: center;
  font-size: 1.1em;
  margin-top: 30px;
`;

export const NoResultsMessage = styled.p`
  color: #a8b2d1;
  text-align: center;
  font-size: 1.1em;
  margin-top: 30px;
`;

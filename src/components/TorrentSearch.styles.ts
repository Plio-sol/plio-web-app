// src/components/TorrentSearch.styles.ts
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// --- Props Interface Needed for Styling ---
export interface SourceTagProps {
    source: 'DODI' | 'FitGirl';
}

// --- Keyframes (Spinner) ---
export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// --- Styled Components ---

// Use motion.div for the main container
export const OverlayContainer = styled(motion.div)`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(10, 25, 47, 0.98);
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40px 20px;
    overflow-y: auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #ccd6f6;
`;

export const CloseButton = styled(motion.button)` // Make button motion component
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
    &:focus-within { border-color: #8A2BE2; }
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

export const SearchButton = styled(motion.button)` // Make button motion component
    padding: 14px 25px;
    font-size: 1.1em;
    cursor: pointer;
    background-color: #8A2BE2;
    color: white;
    border: none;
    border-radius: 0 8px 8px 0;
    font-weight: 600;
    &:disabled { background-color: #555; cursor: not-allowed; }
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
    max-width: 950px;
    margin-top: 20px;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`;

// Use motion.div for staggering children
export const ResultsGrid = styled(motion.div)`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
`;

export const Spinner = styled(motion.div)` // Make spinner motion component
    border: 4px solid rgba(204, 214, 246, 0.3);
    border-left-color: #61DAFB;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-top: 40px;
`;

// Use motion.div for list item animation
export const ResultCard = styled(motion.div)`
    background-color: #172a45;
    border-radius: 10px;
    padding: 25px;
    border: 1px solid rgba(100, 116, 139, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

export const CardTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 12px;
    color: #ffffff;
    font-size: 1.2em;
    line-height: 1.4;
`;

export const CardInfo = styled.p`
    margin-bottom: 20px;
    color: #a8b2d1;
    font-size: 0.95em;
    line-height: 1.5;
`;

export const SourceTag = styled.span<SourceTagProps>`
    font-weight: bold;
    color: ${(props) => props.source === 'DODI' ? '#e67e22' : '#9b59b6'};
    margin-left: 8px;
    padding: 3px 8px;
    border-radius: 5px;
    background-color: ${(props) => props.source === 'DODI' ? 'rgba(230, 126, 34, 0.15)' : 'rgba(155, 89, 182, 0.15)'};
    font-size: 0.9em;
`;

export const DownloadLink = styled(motion.a)` // Make link motion component
    display: block;
    margin-top: auto;
    padding: 12px 15px;
    background: linear-gradient(45deg, #61DAFB, #8A2BE2);
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(97, 218, 251, 0.3);
`;

// Add styled components for messages previously using inline styles
export const ErrorMessage = styled.p`
    color: #ff7b7b;
    text-align: center;
    font-size: 1.1em;
    margin-top: 30px; // Consistent margin
`;

export const NoResultsMessage = styled.p`
    color: #a8b2d1;
    text-align: center;
    font-size: 1.1em;
    margin-top: 30px;
`;
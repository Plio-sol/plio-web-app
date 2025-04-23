// src/components/DexScreenerLatest.styles.ts
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// --- Keyframes (Spinner) ---
export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// --- Styled Components ---

// Overlay structure (similar to others)
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

// Title for this display
export const DisplayTitle = styled.h1`
    color: #ffffff;
    margin-bottom: 35px; // More space as there's no search bar
    font-weight: 600;
    font-size: 2em;
    text-align: center;
`;

// Results Area (similar)
export const ResultsArea = styled.div`
    width: 100%;
    max-width: 1000px; // Adjust as needed
    margin-top: 0; // No search bar above
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`;

// Results Grid (similar)
export const ResultsGrid = styled(motion.div)`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); // Adjust card size
    gap: 25px;
`;

// Spinner (similar)
export const Spinner = styled(motion.div)`
    border: 4px solid rgba(204, 214, 246, 0.3);
    border-left-color: #facc15; // DexScreener Yellow?
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-top: 40px;
`;

// Card for each token profile
export const TokenCard = styled(motion.div)`
    background-color: #172a45;
    border-radius: 10px;
    border: 1px solid rgba(100, 116, 139, 0.3);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 20px 22px; // Adjust padding
`;

export const CardHeader = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    align-items: center; // Center icon and text vertically
`;

export const TokenIcon = styled.img`
    display: block;
    width: 40px; // Adjust size
    height: 40px;
    border-radius: 50%; // Circular icons
    object-fit: cover;
    background-color: #0a192f; // Placeholder bg
    flex-shrink: 0; // Prevent icon from shrinking
`;

export const TokenInfo = styled.div`
    flex: 1;
    min-width: 0; // Prevent text overflow issues in flex
`;

export const TokenAddress = styled.p`
    font-family: 'SFMono-Regular', Consolas, 'Roboto Mono', 'Droid Sans Mono', 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.85em;
    color: #8892b0; // Lighter secondary color
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; // Add ellipsis if address is too long
`;

export const ChainBadge = styled.span`
    display: inline-block;
    background-color: rgba(250, 204, 21, 0.15); // DexScreener Yellow tint
    color: #facc15; // DexScreener Yellow
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: capitalize; // Capitalize chain name
`;

export const TokenDescription = styled.p`
    font-size: 0.95em;
    color: #ccd6f6;
    line-height: 1.6;
    margin-bottom: 18px;
    // Limit description lines if needed
    display: -webkit-box;
    -webkit-line-clamp: 3; // Show max 3 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const LinksContainer = styled.div`
    margin-top: auto; // Push links to the bottom
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

// Style for individual links
export const LinkButton = styled(motion.a)`
    display: inline-flex; // Align icon and text
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: #233554; // Button background
    color: #ccd6f6;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.85em;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #304a6d;
    }

    // Add icons based on type/label (simple example)
    &.website::before { content: '🌐'; }
    &.twitter::before { content: '𝕏'; }
    &.telegram::before { content: '📱'; }
    // Add more as needed
`;

// Error/No Results messages (can reuse)
export const ErrorMessage = styled.p`
    color: #ff7b7b;
    text-align: center;
    font-size: 1.1em;
    margin-top: 30px;
`;

// Use a different message since it's not a search
export const NoDataMessage = styled.p`
    color: #a8b2d1;
    text-align: center;
    font-size: 1.1em;
    margin-top: 30px;
`;
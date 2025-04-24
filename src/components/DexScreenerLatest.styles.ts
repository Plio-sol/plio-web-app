// src/components/DexScreenerLatest.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// --- Keyframes (Spinner) ---
export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// --- Styled Components ---

// MODIFIED: Replaced with the exact style from ImageGenerator.styles.ts
export const OverlayContainer = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(10, 25, 47, 0.9); // Kept specific background
    display: flex;
    flex-direction: column; // Use column layout for content inside
    align-items: center; // Center content horizontally
    justify-content: flex-start; // Align content to top
    padding: 10px 20px 20px 20px; // Add padding top for close button etc.
    z-index: 1000;
    backdrop-filter: blur(5px); // Optional blur effect

    /* Add max-width/height and scrolling if needed */
    max-width: 95vw; // Max width relative to viewport
    max-height: 90vh; // Max height relative to viewport
    width: 900px; /* Specific width like ImageGenerator */
    margin: auto; /* Center the container horizontally if viewport is wider */
    border-radius: 12px; /* Rounded corners for the modal */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); // Shadow like ImageGenerator

    /* Ensure direct children are layered correctly if needed */
    /* This might need adjustment based on how content is structured */
    & > * {
        position: relative; /* Content positioned normally within flex */
        z-index: 1;
        width: 100%; /* Make direct children take full width */
    }

    /* Add overflow handling for the container itself if content exceeds max-height */
    /* overflow-y: auto; // Add this if the *whole* modal should scroll */
`;

// REMOVED: ModalWindow style is no longer needed with the single container approach
// export const ModalWindow = styled(motion.div)` ... `;


// MODIFIED: CloseButton positioning adjusted relative to the new OverlayContainer
export const CloseButton = styled(motion.button)`
    position: absolute; // Position relative to OverlayContainer
    top: 15px; // Position inside OverlayContainer padding
    right: -430px;
    padding: 5px 10px; // Keep padding
    cursor: pointer;
    font-size: 2.5em; // Keep size
    background: transparent; // Keep style
    border: none; // Keep style
    color: #a8b2d1; // Keep color
    line-height: 1; // Keep style
    z-index: 2; // Ensure it's above other direct children
    opacity: 0.7; // Match ImageGenerator style
    transition: opacity 0.2s ease; // Match ImageGenerator style

    &:hover {
        opacity: 1; // Match ImageGenerator style
    }
`;

// Title for this display (should work fine within the flex column)
export const DisplayTitle = styled.h1`
    color: #ffffff;
    margin-bottom: 25px; // Adjust spacing
    font-weight: 600;
    font-size: 1.8em;
    text-align: center;
    flex-shrink: 0; // Prevent title from shrinking
    width: 100%; // Ensure it takes full width for centering
`;

// Results Area (MODIFIED FOR SCROLLING within the single container)
export const ResultsArea = styled.div`
    width: 100%; // Take full width of the container
    flex-grow: 1; // Allow this area to take up remaining vertical space
    min-height: 0; // Crucial for flex-grow to work correctly with overflow
    overflow-y: auto; // Enable vertical scrolling ONLY when content overflows
    display: flex; // Keep flex for centering spinner/messages inside
    flex-direction: column; // Stack spinner/grid vertically
    align-items: center; // Center spinner/grid horizontally
    /* justify-content: flex-start; // Align content to top */
    padding-right: 8px; // Add padding to prevent scrollbar overlap
    padding-left: 4px; // Balance padding slightly
    padding-top: 5px; // Add some space above the grid/spinner

    /* Custom Scrollbar styling */
    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background: rgba(42, 61, 88, 0.3); border-radius: 4px; }
    &::-webkit-scrollbar-thumb { background-color: rgba(97, 218, 251, 0.6); border-radius: 4px; border: 2px solid transparent; background-clip: content-box; }
    &::-webkit-scrollbar-thumb:hover { background-color: rgba(97, 218, 251, 0.8); }
`;

// Results Grid (lives inside ResultsArea)
export const ResultsGrid = styled(motion.div)`
    width: 100%; // Take full width of ResultsArea
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(375px, 1fr)); /* Adjust 300px if needed */    gap: 25px;
    padding-bottom: 10px; 
    padding-top: 5px;
`;

// Spinner (add animation)
export const Spinner = styled(motion.div)`
    border: 4px solid rgba(204, 214, 246, 0.3);
    border-left-color: #facc15; // DexScreener Yellow
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: 40px auto; // Center spinner within ResultsArea
    animation: ${spin} 1s linear infinite; // Apply spin animation
    flex-shrink: 0; // Prevent spinner from shrinking
`;

// --- TokenCard and inner styles remain largely the same ---
// (No changes needed below this line based on the request)
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
    font-family:
            "SFMono-Regular", Consolas, "Roboto Mono", "Droid Sans Mono",
            "Liberation Mono", Menlo, Courier, monospace;
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
    &.website::before {
        content: "🌐";
    }
    &.twitter::before {
        content: "𝕏";
    }
    &.telegram::before {
        content: "📱";
    }
    // Add more as needed
`;

// Error/No Results messages (can reuse)
export const ErrorMessage = styled.p`
    color: #ff7b7b;
    text-align: center;
    font-size: 1.1em;
    margin: 30px auto; // Center within ResultsArea
    flex-shrink: 0; // Prevent message from shrinking
`;

// Use a different message since it's not a search
export const NoDataMessage = styled.p`
    color: #a8b2d1;
    text-align: center;
    font-size: 1.1em;
    margin: 30px auto; // Center within ResultsArea
    flex-shrink: 0; // Prevent message from shrinking
`;
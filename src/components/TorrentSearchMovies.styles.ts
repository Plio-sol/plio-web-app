// src/components/TorrentSearchMovies.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// --- Keyframes (Spinner) ---
export const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

// --- Styled Components ---

// MODIFIED: Replaced with the exact style from GifGenerator.styles.ts
export const OverlayContainer = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(10, 25, 47, 0.9); // Match GifGenerator/DexScreener background
    display: flex;
    flex-direction: column; // Use column layout for content inside
    align-items: center; // Center content horizontally
    justify-content: flex-start; // Align content to top
    padding: 10px 20px 20px 20px; // Match GifGenerator/DexScreener padding
    z-index: 1000;
    backdrop-filter: blur(5px); // Optional blur effect

    /* Add max-width/height and scrolling if needed */
    max-width: 95vw; // Max width relative to viewport
    max-height: 90vh; // Max height relative to viewport
    width: 900px; /* Specific width like GifGenerator/DexScreener */
    margin: auto; /* Center the container horizontally if viewport is wider */
    border-radius: 12px; /* Rounded corners for the modal */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); // Shadow like GifGenerator/DexScreener

    /* Ensure direct children are layered correctly if needed */
    & > * {
        position: relative; /* Content positioned normally within flex */
        z-index: 1;
        width: 100%; /* Make direct children take full width */
    }

    /* Remove overflow-y: auto from here; scrolling handled by ResultsArea */
    /* overflow-y: auto; */
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

// MODIFIED: CloseButton positioning adjusted relative to the new OverlayContainer
export const CloseButton = styled(motion.button)`
    position: absolute; // Position relative to OverlayContainer
    top: 15px; // Match GifGenerator/DexScreener position
    right: -430px;
    padding: 5px 10px; // Keep padding
    cursor: pointer;
    font-size: 2.5em; // Keep size
    background: transparent; // Keep style
    border: none; // Keep style
    color: #a8b2d1; // Keep color
    line-height: 1; // Keep style
    z-index: 2; // Ensure it's above other direct children
    opacity: 0.7; // Match GifGenerator/DexScreener style
    transition: opacity 0.2s ease; // Match GifGenerator/DexScreener style

    &:hover {
        opacity: 1; // Match GifGenerator/DexScreener style
    }
`;

// Title (should work fine within the flex column)
export const SearchTitle = styled.h1`
    color: #ffffff;
    margin-bottom: 25px;
    font-weight: 600;
    font-size: 2em; // Keep original size
    text-align: center; // Center title
    flex-shrink: 0; // Prevent shrinking
    width: 100%; // Ensure it takes full width for centering
`;

// Search Form (should work fine, adjust max-width if needed)
export const SearchForm = styled.form`
    width: 100%;
    max-width: 700px; // Keep original max-width
    display: flex;
    margin-bottom: 10px;
    border-radius: 8px;
    background-color: rgba(23, 42, 69, 0.8);
    border: 1px solid #4a5568;
    transition: border-color 0.3s ease;
    flex-shrink: 0; // Prevent shrinking
    margin-left: auto; // Center form within the flex container
    margin-right: auto; // Center form within the flex container

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

// Hint Text (should work fine)
export const HintText = styled.p`
    font-size: 0.9em;
    color: #a8b2d1;
    margin-top: 5px;
    margin-bottom: 30px;
    max-width: 700px; // Keep original max-width
    text-align: center;
    flex-shrink: 0; // Prevent shrinking
    margin-left: auto; // Center hint text
    margin-right: auto; // Center hint text
`;

// Results Area (MODIFIED FOR SCROLLING within the single container)
export const ResultsArea = styled.div`
    width: 100%; // Take full width of the container
    /* max-width: 1100px; // Max width is handled by OverlayContainer now */
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

    /* Custom Scrollbar styling (Match DexScreener) */
    &::-webkit-scrollbar { width: 8px; }
    &::-webkit-scrollbar-track { background: rgba(42, 61, 88, 0.3); border-radius: 4px; }
    &::-webkit-scrollbar-thumb { background-color: rgba(97, 218, 251, 0.6); border-radius: 4px; border: 2px solid transparent; background-clip: content-box; }
    &::-webkit-scrollbar-thumb:hover { background-color: rgba(97, 218, 251, 0.8); }
`;

// Results Grid (lives inside ResultsArea)
// KEPT ORIGINAL RESPONSIVE LAYOUT
export const ResultsGrid = styled(motion.div)`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); // Keep original minmax
    gap: 30px; // Keep original gap
    padding-bottom: 10px; // Add space at the very bottom
`;

// Spinner (add animation)
export const Spinner = styled(motion.div)`
    border: 4px solid rgba(204, 214, 246, 0.3);
    border-left-color: #61dafb; // YTS Blue
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: 40px auto; // Center spinner within ResultsArea
    animation: ${spin} 1s linear infinite; // Apply spin animation
    flex-shrink: 0; // Prevent spinner from shrinking
`;

// --- MovieResultCard and inner styles remain largely the same ---
// (No changes needed below this line based on the request)
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
    margin: 30px auto; // Center within ResultsArea
    flex-shrink: 0; // Prevent message from shrinking
`;

export const NoResultsMessage = styled.p`
    color: #a8b2d1;
    text-align: center;
    font-size: 1.1em;
    margin: 30px auto; // Center within ResultsArea
    flex-shrink: 0; // Prevent message from shrinking
`;
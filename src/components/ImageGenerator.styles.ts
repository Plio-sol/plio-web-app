import styled, { keyframes } from 'styled-components'; // Added keyframes
import { motion } from 'framer-motion';

// --- Define Keyframes directly ---
const spin = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

// --- Define OverlayContainer directly (Example definition, adjust as needed) ---
export const OverlayContainer = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(10, 25, 47, 0.9); // Kept specific background
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; // Align content to top
    padding: 10px 20px 20px 20px; // Add padding top for close button etc.
    z-index: 1000;
    backdrop-filter: blur(5px); // Optional blur effect

    /* Add max-width/height and scrolling if needed */
    max-width: 95vw;
    max-height: 90vh;
    width: 900px; /* Example max width */
    margin: auto; /* Center the container */
    border-radius: 12px; /* Rounded corners for the modal */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    /* Ensure direct children are layered correctly if needed */
    & > * {
        position: relative;
        z-index: 1;
    }
`;
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

// --- Define CloseButton directly (Example definition, adjust as needed) ---
export const CloseButton = styled(motion.button)`
    position: absolute; // Position relative to OverlayContainer
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: #ccd6f6;
    font-size: 2.5rem; // Larger close button
    cursor: pointer;
    line-height: 1;
    padding: 5px;
    z-index: 2; // Ensure close button is definitely above everything
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 1;
    }
`;

// --- Rest of the styles (unchanged from previous version) ---
export const Title = styled.h2`
    color: #ccd6f6;
    margin-bottom: 20px;
    font-size: 1.8em;
    font-weight: 600;
    text-align: center;
`;

export const PromptSection = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 600px; // Adjust width as needed
    margin-bottom: 20px;
`;

export const PromptInput = styled.input`
    flex-grow: 1;
    padding: 10px 15px;
    border-radius: 6px;
    border: 1px solid #304a6d;
    background-color: #0a192f;
    color: #ccd6f6;
    font-size: 1em;
    outline: none;

    &:focus {
        border-color: #61dafb;
    }
`;

export const GenerateButton = styled(motion.button)`
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    background-color: #50fa7b; // Green theme
    color: #0a192f;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.2s ease;
    position: relative; // For spinner

    &:hover:not(:disabled) {
        background-color: #3ddc67;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &.loading span {
        visibility: hidden; // Hide text when loading
    }
`;

export const ButtonSpinner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 3px solid rgba(10, 25, 47, 0.3);
    border-left-color: #0a192f;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: ${spin} 1s linear infinite; // Use locally defined spin
`;

export const StatusDisplay = styled.div`
    text-align: center;
    color: #8892b0;
    min-height: 1.2em; // Reserve space
    margin-top: 5px;
    margin-bottom: 15px;
`;

export const ImageContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    width: 100%;
    max-width: 512px; // Max width for the image display area

    img {
        display: block;
        max-width: 100%;
        max-height: 60vh; // Limit image height
        border-radius: 8px;
        border: 1px solid #304a6d;
        background-color: #0a192f; // Background while loading/if transparent
    }
`;

export const DownloadButton = styled.button`
    padding: 8px 15px;
    cursor: pointer;
    background-color: #61dafb;
    color: #0a192f;
    border: none;
    border-radius: 6px;
    font-size: 0.9em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background-color: #4ac7e8;
    }
`;

export const ErrorMessage = styled.div`
    color: #ff7b7b;
    text-align: center;
    margin-top: 10px;
    font-size: 0.9em;
`;
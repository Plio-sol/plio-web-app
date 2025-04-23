// src/components/WalletInfo.styles.ts
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Container for internal structure - ensure it fills the wrapper from AppContent
export const WalletInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center; // Center items horizontally
    justify-content: flex-start; // Center vertically if needed, or flex-start
    text-align: center;
    width: 100%;
    margin-top: -20px;
    min-height: 120px; // Increased min-height for more content
`;

export const BalanceTitle = styled.h3`
    color: #a8b2d1;
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 10px; // Reduced margin
    letter-spacing: 0.5px;
`;

// Container for the main balance display (Token Amount + Symbol)
export const BalanceDisplayContainer = styled(motion.div)`
    display: flex; // Use flex to align number and symbol
    align-items: baseline; // Align text along the baseline
    justify-content: center; // Center the flex items
    color: #ffffff;
    margin-bottom: 5px; // Reduced margin
    width: 100%; // Ensure it takes full width for centering text
`;

export const BalanceAmount = styled.span`
    font-size: 3em; // Slightly larger
    font-weight: 700;
    line-height: 1.1;
    margin-right: 10px; // Space between amount and symbol
`;

export const TokenSymbol = styled.span`
    color: #61DAFB;
    font-size: 1.5em; // Larger symbol, relative to BalanceAmount baseline
    font-weight: 600;
`;

// New component for USD Value
export const UsdValueDisplay = styled(motion.div)`
    color: #a8b2d1; // Lighter color, less prominent than token amount
    font-size: 1.2em;
    font-weight: 500;
    margin-top: 5px; // Space above USD value
    height: 25px; // Reserve space to prevent layout shifts during loading
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Spinner remains the same, but adjust margin if needed
export const LoadingSpinner = styled(motion.div)`
    border: 4px solid rgba(204, 214, 246, 0.2);
    border-left-color: #8A2BE2;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    margin: 30px auto; // Adjusted margin
`;

// Small spinner for price loading
export const PriceLoadingIndicator = styled(motion.div)`
    border: 2px solid rgba(204, 214, 246, 0.2);
    border-left-color: #61DAFB; // Use accent blue
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: inline-block; // Allow it to sit within text flow if needed
`;


export const ErrorMessage = styled.p`
    color: #ff7b7b;
    font-size: 0.95em;
    margin-top: 20px; // Adjusted margin
    max-width: 90%;
`;

export const ConnectPrompt = styled.p`
    color: #a8b2d1;
    font-size: 1em;
    margin-top: 20px; // Adjusted margin
`;
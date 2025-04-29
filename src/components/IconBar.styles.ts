// src/components/IconBar.styles.ts
import styled, { css, keyframes } from "styled-components";

// --- Constants ---
const SIDEBAR_WIDTH_DESKTOP = "65px";
const primaryBg = "#0a192f"; // Or your actual background
const mediumText = "#8892b0";
const neonColor = "#61dafb"; // Use your accent color

// --- Keyframes ---
const neonGlow = keyframes`
    0%, 100% {
        /* Slightly less intense base glow */
        filter: drop-shadow(0 0 4px ${neonColor}) drop-shadow(0 0 8px ${neonColor});
        color: ${neonColor}; /* Keep icon color consistent */
    }
    50% {
        /* More intense peak glow */
        filter: drop-shadow(0 0 6px ${neonColor}) drop-shadow(0 0 12px ${neonColor});
        color: #ffffff; /* Optional: Flash icon to white at peak */
    }
`;

// --- Main Container ---
export const IconBarContainer = styled.div`
    /* Default styles are mobile-first */
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 60px; /* Height of the bottom bar */
    background-color: ${primaryBg}; /* Match app background */
    border-top: 1px solid rgba(100, 116, 139, 0.3); /* Border on top */
    display: flex;
    flex-direction: row; /* Horizontal layout */
    align-items: center;
    justify-content: space-around; /* Distribute icons evenly */
    padding: 0 10px; /* Horizontal padding */
    /* Removed gap, space-around handles distribution */
    z-index: 1000;

    /* Desktop Overrides */
    @media (min-width: 769px) {
        top: 0;
        bottom: 0; /* Stretch full height */
        left: 0;
        right: auto; /* Reset right */
        width: ${SIDEBAR_WIDTH_DESKTOP}; /* Width of the icon bar */
        height: 100vh; /* Explicitly set height */
        box-sizing: border-box; /* Include padding in height */
        border-top: none; /* Remove top border */
        border-right: 1px solid rgba(100, 116, 139, 0.3); /* Add right border */
        flex-direction: column; /* Vertical layout */
        justify-content: flex-start; /* Align to top */
        padding: 20px 0 0 0; /* Top padding only, scroll area handles bottom */
        /* Removed gap, handled by logo margin and scroll area margin */
    }
`;

// --- Logo ---
export const Logo = styled.img`
    /* Mobile: Hide the logo in the bottom bar */
    display: none;

    /* Desktop Overrides */
    @media (min-width: 769px) {
        display: block; /* Show on desktop */
        max-width: 45px;
        height: auto;
        margin-bottom: 20px; // Space below logo
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        cursor: pointer;
        transition: transform 0.2s ease;
        flex-shrink: 0; // Prevent logo shrinking

        &:hover {
            transform: scale(1.05);
        }
    }
`;

// --- Button Scroll Area ---
export const ButtonScrollArea = styled.div`
  /* Mobile (Default): Act as a simple horizontal container */
  display: flex;
  flex-direction: row;
  justify-content: space-around; /* Match parent's mobile justification */
  align-items: center;
  width: 100%; // Take full width on mobile
  height: 100%; // Take full height of mobile bar

  /* Desktop Overrides: Apply scrolling and vertical layout */
  @media (min-width: 769px) {
    flex-grow: 1; // Allow this area to take up remaining vertical space
    width: 100%; // Ensure it takes full width of the bar
    overflow-y: auto; // Enable vertical scrolling ONLY when needed
    overflow-x: hidden; // Prevent horizontal scrolling
    /* display: flex; // Already flex from mobile */
    flex-direction: column; // Change direction to column
    align-items: center; // Align icons center vertically
    justify-content: flex-start; // Reset justification
    padding-bottom: 15px; // Add padding at the bottom of the scroll area
    min-height: 0; // Crucial for flex-grow and overflow to work correctly

    /* Custom Scrollbar Styles */
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${mediumText};
      border-radius: 3px;
      border: 1px solid ${primaryBg};
    }

    /* Add vertical gap between buttons ONLY on desktop */
    & > button:not(:last-child) {
      margin-bottom: 15px; // Adjust spacing as needed
    }
  }
`;

// --- Icon Button ---
export const IconButton = styled.button<{ isGated?: boolean }>`
    background: none;
    border: none;
    color: ${mediumText}; // Default icon color
    font-size: 1.6rem; // Adjust icon size
    /* Removed base margin-bottom */
    cursor: pointer;
    padding: 8px; // Add some padding for easier clicking
    border-radius: 50%; // Make the click area rounded
    transition:
            color 0.2s ease,
            transform 0.2s ease,
            filter 0.3s ease; /* Add filter transition */
    display: flex; // Ensure icon is centered
    align-items: center; // Ensure icon is centered
    justify-content: center; // Ensure icon is centered
    flex-shrink: 0; // Prevent shrinking on mobile row

    &:hover {
        color: ${neonColor}; // Hover color for non-gated
        transform: scale(1.15);
    }

    /* No longer need last-child override */

    /* Specific Mobile Adjustments */
    @media (max-width: 768px) {
        font-size: 1.5rem; // Slightly smaller icons on mobile
        padding: 10px; // Adjust padding for horizontal layout
    }

    /* Conditional Glow */
    ${(props) =>
            props.isGated &&
            css`
      /* Apply a base glow immediately */
      filter: drop-shadow(0 0 4px ${neonColor}) drop-shadow(0 0 8px ${neonColor});
      color: ${neonColor}; /* Make the icon itself glowy */
      /* Apply the pulsing animation */
      animation: ${neonGlow} 2s infinite ease-in-out;

      &:hover {
        /* Enhance glow on hover for gated icons */
        filter: drop-shadow(0 0 7px ${neonColor}) drop-shadow(0 0 14px ${neonColor});
        color: #ffffff; /* Ensure hover color is bright */
      }
    `}
`;
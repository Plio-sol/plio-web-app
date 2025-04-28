// src/components/IconBar.styles.ts
import styled, {css, keyframes} from "styled-components";

// --- Desktop Styles (Screen width > 768px) ---
export const IconBarContainer = styled.div`
  /* Default styles are now mobile-first */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px; /* Height of the bottom bar */
  background-color: #0a192f; /* Match app background */
  border-top: 1px solid rgba(100, 116, 139, 0.3); /* Border on top */
  display: flex;
  flex-direction: row; /* Horizontal layout */
  align-items: center;
  justify-content: space-around; /* Distribute icons evenly */
  padding: 0 10px; /* Horizontal padding */
  gap: 10px; /* Space between icons */
  z-index: 1000;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    top: 0;
    bottom: 0;
    left: 0;
    right: auto; /* Reset right */
    width: 65px; /* Width of the icon bar */
    height: auto; /* Reset height */
    border-top: none; /* Remove top border */
    border-right: 1px solid rgba(100, 116, 139, 0.3); /* Add right border */
    flex-direction: column; /* Vertical layout */
    justify-content: flex-start; /* Align to top */
    padding: 20px 0; /* Vertical padding */
    gap: 25px; /* Restore desktop gap */
  }
`;

export const Logo = styled.img`
  /* Mobile: Hide the logo in the bottom bar */
  display: none;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    display: block; /* Show on desktop */
    max-width: 45px;
    height: auto;
    margin-bottom: 30px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const neonColor = "#61dafb"; // Use your accent color

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

// --- Update IconButton to accept isGated prop ---
export const IconButton = styled.button<{ isGated?: boolean }>`
    background: none;
    border: none;
    color: #8892b0; // Default icon color
    font-size: 1.6rem; // Adjust icon size
    margin-bottom: 25px; // Spacing between icons
    cursor: pointer;
    padding: 8px; // Add some padding for easier clicking
    border-radius: 50%; // Make the click area rounded
    transition:
            color 0.2s ease,
            transform 0.2s ease,
            filter 0.3s ease; /* Add filter transition */

    &:hover {
        color: ${neonColor}; // Hover color for non-gated
        transform: scale(1.15);
    }

    &:last-child {
        margin-bottom: 0; // No margin for the last icon
    }

    @media (max-width: 768px) {
        margin-bottom: 0; // No vertical margin on mobile
        font-size: 1.5rem; // Slightly smaller icons on mobile
        padding: 10px; // Adjust padding for horizontal layout
    }

    /* --- Apply Glow Conditionally --- */
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
        /* Optional: Pause animation on hover if distracting */
        /* animation-play-state: paused; */
      }
    `}
        /* --- End Conditional Glow --- */
`;


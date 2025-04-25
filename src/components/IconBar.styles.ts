// src/components/IconBar.styles.ts
import styled from "styled-components";

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

export const IconButton = styled.button`
  /* Shared styles */
  background: none;
  border: none;
  color: #a8b2d1;
  padding: 8px; /* Adjusted padding for mobile */
  cursor: pointer;
  border-radius: 8px;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em; /* Slightly smaller icons for mobile bar */
  width: 40px; /* Mobile button size */
  height: 40px; /* Mobile button size */

  &:hover {
    color: #ffffff;
    background-color: rgba(58, 80, 107, 0.7);
  }

  &:active {
    transform: scale(0.95);
  }

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 1.6em; /* Restore desktop icon size */
    padding: 10px; /* Restore desktop padding */
    width: 44px; /* Restore desktop button size */
    height: 44px; /* Restore desktop button size */
  }
`;

// src/components/AppContent.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// --- Framer Motion Variants ---

// Variants for the main container to stagger children
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1, // Start staggering after a small delay
      staggerChildren: 0.15, // Time between each child animation
    },
  },
};

// Variants for individual items fading/floating in
export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Variants for components appearing/disappearing (like WalletInfo)
export const componentFadeSlideVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
};

// --- Styled Components ---
// --- Keyframes for Rainbow Effect ---
const rainbowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const AppContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 900px; /* Keep max-width for desktop */
  margin: 0 auto; /* Center the content */

  /* Mobile Padding (consider bottom bar height) */
  padding: 60px 15px 80px 0px; /* top right bottom left - more bottom padding */

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 40px 20px 40px 20px; /* top right bottom left (restore desktop left padding) */
    margin-left: 65px; /* Restore desktop margin */
    margin-right: 0; /* Reset right margin */
  }
`;

export const Header = styled(motion.header)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Ensure header takes full width */
  margin-bottom: 30px; /* Reduced margin for mobile */

  @media (min-width: 769px) {
    margin-bottom: 40px; /* Restore desktop margin */
  }
`;

// Logo within the main Header (NOT the IconBar logo)
export const Logo = styled.img`
  max-width: 140px; /* Smaller logo for mobile */
  height: auto;
  margin-bottom: 20px; /* Reduced margin */
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));

  @media (min-width: 769px) {
    max-width: 180px; /* Restore desktop size */
    margin-bottom: 25px; /* Restore desktop margin */
  }
`;

// --- ADDED: Social Links Styling ---
export const SocialLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px; /* Space between icons */
  margin-bottom: 15px; /* Space below icons */
`;

export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px; /* Icon container size */
  height: 38px; /* Icon container size */
  border-radius: 50%; /* Circular background */
  background-color: rgba(42, 63, 90, 0.7); /* Semi-transparent background */
  color: #a8b2d1; /* Icon color */
  font-size: 1.1em; /* Adjust as needed if using text/icons */
  font-weight: bold;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  border: 1px solid rgba(100, 116, 139, 0.3); /* Subtle border */

  &:hover {
    background-color: rgba(58, 80, 107, 0.9); /* Darker on hover */
    transform: translateY(-2px); /* Slight lift on hover */
    color: #ffffff;
  }
`;
// --- END: Social Links Styling ---
// --- Define Neon Glow (can be shared or redefined) ---
const neonColor = "#61dafb"; // Use your accent color

const neonGlow = keyframes`
  0%, 100% {
    /* Slightly less intense base glow */
    filter: drop-shadow(0 0 3px ${neonColor}) drop-shadow(0 0 6px ${neonColor});
    color: ${neonColor}; /* Keep text color consistent */
    text-shadow: 0 0 3px ${neonColor}; /* Add text-shadow for better inline glow */
  }
  50% {
    /* More intense peak glow */
    filter: drop-shadow(0 0 5px ${neonColor}) drop-shadow(0 0 10px ${neonColor});
     color: #ffffff; /* Optional: Flash text to white at peak */
     text-shadow: 0 0 5px #ffffff, 0 0 10px ${neonColor}; /* Enhance text-shadow */
  }
`;
// --- *** Add GlowingText Style *** ---
export const GlowingText = styled.span`
  /* Apply a base glow immediately */
  filter: drop-shadow(0 0 3px ${neonColor}) drop-shadow(0 0 6px ${neonColor});
  color: ${neonColor}; /* Make the text itself glowy */
  text-shadow: 0 0 3px ${neonColor};
  /* Apply the pulsing animation */
  animation: ${neonGlow} 2s infinite ease-in-out;
  /* Ensure it behaves like normal text */
  display: inline;
  font-weight: 600; // Make it slightly bolder to stand out
`;
// ---
// --- ADDED: Contract Address Styling ---
export const ContractAddress = styled.p`
  font-size: 0.95em;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.2);
  }

  /* Rainbow Text Effect - Use your preferred high-contrast gradient */
  background: linear-gradient(
    90deg,
    #39ff14,
    #ffdd57,
    #ff7f50,
    #ff69b4,
    #00ffff,
    #90ee90,
    #39ff14
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${rainbowAnimation} 5s linear infinite;
`;

export const Title = styled.h1`
  color: #ffffff;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center; /* Ensure centered */
  font-size: 1.5em; /* Reduced font size for mobile */
  letter-spacing: -0.5px;

  @media (min-width: 769px) {
    font-size: 1.8em; /* Restore desktop font size */
  }
`;

export const Description = styled(motion.p)`
  color: #a8b2d1;
  margin-bottom: 30px; /* Reduced margin */
  font-size: 1.05em; /* Slightly smaller font for mobile */
  max-width: 550px;
  text-align: center;
  line-height: 1.6; /* Slightly tighter line height */

  @media (min-width: 769px) {
    margin-bottom: 40px; /* Restore desktop margin */
    font-size: 1.15em; /* Restore desktop font size */
    line-height: 1.7; /* Restore desktop line height */
  }
`;

// Apply motion hover/tap effects directly if preferred over CSS :hover/:active
export const StyledWalletMultiButton = styled(WalletMultiButton)`
  &&& {
    background-color: #8a2be2;
    color: #ffffff;
    font-weight: 600;
    /* UPDATED: Adjust border-radius */
    border-radius: 10px; /* Slightly more rounded */
    padding: 12px 20px; /* Adjust padding for size */
    font-size: 1em; /* Adjust font size if needed */
    transition:
      background-color 0.3s ease,
      transform 0.1s ease,
      box-shadow 0.3s ease;
    /* REMOVED width: 100%; */
    min-width: 180px; /* Optional: Set a minimum width */
    text-align: center; /* Ensure text is centered */
    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);

    &:hover {
      background-color: #7a1fc2 !important;
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(138, 43, 226, 0.4);
    }
    &:active {
      transform: scale(0.98);
    }
  }
`;

export const StyledButton = styled(motion.button)`
  padding: 12px 20px; /* Adjust padding for size */
  font-size: 1em; /* Adjust font size if needed */
  cursor: pointer;
  background-color: transparent;
  color: #61dafb;
  border: 2px solid #61dafb;
  /* UPDATED: Adjust border-radius */
  border-radius: 10px; /* Slightly more rounded */
  font-weight: 600;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.1s ease,
    box-shadow 0.3s ease;
  /* REMOVED width: 100%; */
  min-width: 140px; /* Optional: Set a minimum width */
  min-height: 100px;
  text-align: center; /* Ensure text is centered */
  box-shadow: 0 4px 15px rgba(97, 218, 251, 0.2);

  /* Hover/Active effects can be handled by motion props or CSS */
  &:hover {
    background-color: rgba(97, 218, 251, 0.1);
  }

  /* Specific style overrides can still be applied inline if needed */
  &[style*="borderColor: rgb(250, 204, 21)"] {
    /* Target the yellow button specifically */
    color: #facc15;
    border-color: #facc15;
    box-shadow: 0 4px 15px rgba(250, 204, 21, 0.2);
    &:hover {
      background-color: rgba(250, 204, 21, 0.1);
    }
  }
`;

// Use motion.div for animation control
export const WalletInfoWrapper = styled(motion.div)`
  width: 80%; // Keep filling parent width
  background-color: rgba(23, 42, 69, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(100, 116, 139, 0.3);
  backdrop-filter: blur(5px);

  /* Mobile Styles (Default) */
  margin-top: 20px; // Reduced margin for mobile
  padding: 20px; // Reduced padding for mobile

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-top: 30px; // Restore desktop margin
    padding: 30px; // Restore desktop padding
  }
`;

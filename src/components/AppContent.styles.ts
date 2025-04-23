// src/components/AppContent.styles.ts
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// --- Framer Motion Variants ---

// Variants for the main container to stagger children
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1, // Start staggering after a small delay
            staggerChildren: 0.15, // Time between each child animation
        }
    }
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
        }
    }
};

// Variants for components appearing/disappearing (like WalletInfo)
export const componentFadeSlideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } }
};


// --- Styled Components ---

// Use motion for elements that need individual animation control via variants
export const AppContentWrapper = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 900px;
    padding: 40px 20px;
`;

export const Header = styled(motion.header)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
`;

export const Logo = styled.img`
    max-width: 180px;
    height: auto;
    margin-bottom: 25px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
`;

export const Title = styled.h1`
  color: #ffffff;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 2.8em;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

export const Description = styled(motion.p)`
  color: #a8b2d1;
  margin-bottom: 40px;
  font-size: 1.15em;
  max-width: 550px;
  text-align: center;
  line-height: 1.7;
`;

export const ActionsWrapper = styled(motion.div)`
    display: flex;
    /* UPDATED: Arrange in a row, wrap when needed, center items */
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center; /* Align items vertically if they wrap */
    gap: 20px; /* Adjust gap for horizontal/vertical spacing */
    margin-bottom: 50px;
    width: 100%;
    /* REMOVED max-width: 350px; */
`;

// Apply motion hover/tap effects directly if preferred over CSS :hover/:active
export const StyledWalletMultiButton = styled(WalletMultiButton)`
    &&& {
        background-color: #8A2BE2;
        color: #ffffff;
        font-weight: 600;
        /* UPDATED: Adjust border-radius */
        border-radius: 10px; /* Slightly more rounded */
        padding: 12px 20px; /* Adjust padding for size */
        font-size: 1em; /* Adjust font size if needed */
        transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
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
    color: #61DAFB;
    border: 2px solid #61DAFB;
    /* UPDATED: Adjust border-radius */
    border-radius: 10px; /* Slightly more rounded */
    font-weight: 600;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
    /* REMOVED width: 100%; */
    min-width: 180px; /* Optional: Set a minimum width */
    text-align: center; /* Ensure text is centered */
    box-shadow: 0 4px 15px rgba(97, 218, 251, 0.2);

    /* Hover/Active effects can be handled by motion props or CSS */
    &:hover {
        background-color: rgba(97, 218, 251, 0.1);
    }

    /* Specific style overrides can still be applied inline if needed */
    &[style*="borderColor: rgb(250, 204, 21)"] { /* Target the yellow button specifically */
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
    width: 100%;
    margin-top: 30px;
    background-color: rgba(23, 42, 69, 0.6);
    border-radius: 12px;
    padding: 30px;
    border: 1px solid rgba(100, 116, 139, 0.3);
    backdrop-filter: blur(5px);
`;
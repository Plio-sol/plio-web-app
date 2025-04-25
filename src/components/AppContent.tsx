// src/components/AppContent.tsx
import React, {FC, useEffect, useState} from 'react';
// *** Import useWallet correctly ***
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'; // Import WalletContextState type
import { AnimatePresence } from 'framer-motion';

// Import styles
import * as S from './AppContent.styles';
import IconBar, {DrawerItemType} from './IconBar'; // Import the new drawer
import WalletInfo from './WalletInfo';

import XIcon from "../icons/XIcon";

import TorrentSearchGames from './TorrentSearchGames';
import TorrentSearchMovies from './TorrentSearchMovies';
import DexScreenerLatest from './DexScreenerLatest';
import ImageGenerator from './ImageGenerator';

// --- Type Definition for window.Jupiter ---
declare global {
    interface Window {
        Jupiter: {
            init: (options: any) => void;
            // *** ADD syncProps based on documentation ***
            syncProps: (props: { passthroughWalletContextState?: WalletContextState }) => void; // Use WalletContextState type
        };
    }
}
// --- End Type Definition ---
const CONTRACT_ADDRESS = "2eXamy7t3kvKhfV6aJ6Uwe3eh8cuREFcTKs1mFKZpump";
// --- App Content Component ---
const AppContent: FC = () => {
    // *** Get the full wallet state object ***
    const walletState = useWallet(); // Use a different variable name to avoid confusion
    const { connected } = walletState; // Destructure connected if needed elsewhere

    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const [activeOverlay, setActiveOverlay] = useState<DrawerItemType | null>(null); // State for overlay


    // New handler for when an item is selected in the drawer
    const handleSelectItem = (itemType: DrawerItemType) => {
        setActiveOverlay(itemType); // Set which overlay to show
        // Drawer is closed by its own internal logic now via onClose prop
    };

    // Handler to close the currently active overlay
    const closeOverlay = () => {
        setActiveOverlay(null);
    };

    const handleCopyAddress = () => {
        if (!navigator.clipboard) {
            // Clipboard API not available (older browsers, insecure context)
            console.error("Clipboard API not supported");
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2s
            return;
        }

        navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
            // Success!
            setCopyStatus('copied');
            // Reset back to idle after a short delay
            setTimeout(() => setCopyStatus('idle'), 1500); // 1.5 seconds
        }).catch(err => {
            // Error!
            console.error('Failed to copy address: ', err);
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2s
        });
    };

    useEffect(() => {
        const initializeJupiter = () => {
            if (window.Jupiter) {
                console.log("Initializing Jupiter Terminal (Widget Mode)...");
                try {
                    window.Jupiter.init({
                        // --- For Widget Mode ---
                        displayMode: "widget", // Keep this
                        // integratedTargetId: "integrated-terminal", // <-- REMOVE THIS LINE
                        enableWalletPassthrough: true, // Keep for wallet integration

                        // --- Essential Props ---
                        endpoint: process.env.REACT_APP_SOLANA_RPC_HOST, // Your RPC

                        // --- Optional: Widget-specific settings ---
                        widgetStyle: {
                            position: 'bottom-right', // 'bottom-left', 'top-left', 'top-right'
                            size: 'default', // 'sm', 'default'
                        },
                        // --- Other Optional Props ---
                        strictTokenList: false,
                        formProps: {
                            fixedOutputMint: true,
                            initialInputMint: "So11111111111111111111111111111111111111112",
                            initialOutputMint: "2eXamy7t3kvKhfV6aJ6Uwe3eh8cuREFcTKs1mFKZpump",
                        },
                        // containerClassName: '...', // Might apply to the modal opened by widget
                        // onSwapError: ({ error }) => { /* ... */ },
                        // onSuccess: ({ txid, swapResult }) => { /* ... */ },
                    });
                    console.log("Jupiter Terminal Initialized (Widget Mode Complete).");
                } catch (error) {
                    console.error("Failed to initialize Jupiter Terminal (Widget Mode):", error);
                }
            } else {
                console.log("Jupiter script not ready for init, retrying...");
                setTimeout(initializeJupiter, 500);
            }
        };

        initializeJupiter();

    }, []); // Runs once

    // --- Step 2: Synchronize Wallet State (Runs when walletState changes) ---
    useEffect(() => {
        // Check if the syncProps function exists (init might not be finished)
        if (window.Jupiter?.syncProps) {
            console.log("Syncing Jupiter props with wallet state:", walletState.connected);
            try {
                // Pass the whole wallet state object as expected by syncProps documentation
                window.Jupiter.syncProps({ passthroughWalletContextState: walletState });
            } catch (error) {
                console.error("Failed to sync Jupiter props:", error);
            }
        } else {
            console.log("window.Jupiter.syncProps not available yet.");
            // No automatic retry here, relies on the effect re-running when walletState changes
        }
        // *** Depend on the entire walletState object ***
        // This ensures syncProps is called whenever connection status OR other relevant wallet details change.
    }, [walletState]);

    // --- End Jupiter Integration ---

    const renderActiveOverlay = () => {
        switch (activeOverlay) {
            case 'games':
                return <TorrentSearchGames key="game-search" onClose={closeOverlay} />;
            case 'movies':
                return <TorrentSearchMovies key="movie-search" onClose={closeOverlay} />;
            case 'dex':
                return <DexScreenerLatest key="dex-tokens" onClose={closeOverlay} />;
            case 'image':
                return <ImageGenerator key="image-generator" onClose={closeOverlay} />;
            default:
                return null;
        }
    };

    return (
        <> {/* Use Fragment because IconBar is outside the main flow */}
            <IconBar onSelectItem={handleSelectItem}
                     closeOverlay={closeOverlay}
            />
            <S.AppContentWrapper
                variants={S.containerVariants}
                initial="hidden"
                animate="visible"
            >


                <S.Header variants={S.itemVariants}>
                    <S.Logo
                        src={process.env.PUBLIC_URL + "/plio-logo.png"}
                        alt="Plio Logo"
                    />
                    <S.SocialLinksContainer>
                        <S.SocialLink href="https://x.com/PlioSol" target="_blank" rel="noopener noreferrer" title="Plio on X">
                            <XIcon />
                        </S.SocialLink>
                        <S.SocialLink href={`https://pump.fun/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" title="Plio on pump.fun">
                            <img src={process.env.PUBLIC_URL + "/pumpfun.png"} alt={'pump.fun logo'} style={{ width: '24px', height: '24px' }}/>
                        </S.SocialLink>
                    </S.SocialLinksContainer>
                    <S.ContractAddress
                        onClick={handleCopyAddress}
                        title="Click to copy address"
                    >
                        {copyStatus === 'idle' && `Contract: ${CONTRACT_ADDRESS}`}
                        {copyStatus === 'copied' && 'Copied!'}
                        {copyStatus === 'error' && 'Copy Failed'}
                    </S.ContractAddress>
                    <S.Title>$Plio Holder Panel</S.Title>
                </S.Header>

                <S.StyledWalletMultiButton />

                <S.Description variants={S.itemVariants}>
                    Access exclusive holder tools. Connect your wallet to view token details
                    and use tools.
                </S.Description>

                {/* REMOVED ActionsWrapper */}

                {/* --- Wallet Info --- */}
                <AnimatePresence>
                    {connected && (
                        <S.WalletInfoWrapper
                            key="wallet-info"
                            variants={S.componentFadeSlideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <WalletInfo />
                        </S.WalletInfoWrapper>
                    )}
                </AnimatePresence>

                {/* REMOVED Modals AnimatePresence Block */}

            </S.AppContentWrapper>


            {/* Render the Active Overlay Component */}
            <AnimatePresence>
                {renderActiveOverlay()}
            </AnimatePresence>
        </>
    );
};

export default AppContent;
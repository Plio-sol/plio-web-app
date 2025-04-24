// src/components/AppContent.tsx
import React, {FC, useEffect, useState} from 'react';
// *** Import useWallet correctly ***
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'; // Import WalletContextState type
import { AnimatePresence } from 'framer-motion';

// Import styles
import * as S from './AppContent.styles';

import WalletInfo from './WalletInfo';
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

// --- App Content Component ---
const AppContent: FC = () => {
    // *** Get the full wallet state object ***
    const walletState = useWallet(); // Use a different variable name to avoid confusion
    const { connected } = walletState; // Destructure connected if needed elsewhere

    const [showTorrentSearch, setShowTorrentSearch] = useState(false);
    const [showMovieSearch, setShowMovieSearch] = useState(false);
    const [showDexTokens, setShowDexTokens] = useState(false);
    const [showImageGenerator, setShowImageGenerator] = useState(false);

    // --- Handlers (Keep these as they are) ---
    const handleOpenTorrentSearch = () => setShowTorrentSearch(true);
    const handleCloseTorrentSearch = () => setShowTorrentSearch(false);
    // ... other handlers ...
    const handleOpenMovieSearch = () => setShowMovieSearch(true);
    const handleCloseMovieSearch = () => setShowMovieSearch(false);
    const handleOpenDexTokens = () => setShowDexTokens(true);
    const handleCloseDexTokens = () => setShowDexTokens(false);
    const handleOpenImageGenerator = () => setShowImageGenerator(true);
    const handleCloseImageGenerator = () => setShowImageGenerator(false);
    // --- End Handlers ---

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


    return (
        <S.AppContentWrapper
            variants={S.containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* ... Header, Wallet Button, Description ... */}
            <S.Header variants={S.itemVariants}>
                <S.Logo
                    src={process.env.PUBLIC_URL + "/plio-logo.png"}
                    alt="Plio Logo"
                />
                <S.Title>$Plio Holder Panel</S.Title>
            </S.Header>
            <S.StyledWalletMultiButton />
            <S.Description variants={S.itemVariants}>
                Access exclusive holder tools. Connect your wallet to view token details
                and use tools.
            </S.Description>


            {/* --- Actions Wrapper (Keep as is) --- */}
            <S.ActionsWrapper variants={S.itemVariants}>
                {/* Buttons... */}
                <S.StyledButton onClick={handleOpenTorrentSearch} /* ...props */ >
                    Open Game Torrent Search
                </S.StyledButton>
                <S.StyledButton onClick={handleOpenMovieSearch} /* ...props */ >
                    Open Movie Torrent Search
                </S.StyledButton>
                <S.StyledButton onClick={handleOpenDexTokens} /* ...props */ style={{ borderColor: "#facc15", color: "#facc15" }}>
                    Latest 'Dex Paid' Tokens
                </S.StyledButton>
                <S.StyledButton onClick={handleOpenImageGenerator} /* ...props */ style={{ borderColor: '#50fa7b', color: '#50fa7b' }}>
                    Google Gemini Image Generator
                </S.StyledButton>
            </S.ActionsWrapper>
            {/* --- End Actions Wrapper --- */}


            {/* ... Wallet Info (Keep as is) ... */}
            <AnimatePresence>
                {connected && ( // Use connected from the destructured walletState
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


            {/* --- Modals (Keep as is) --- */}
            <AnimatePresence>
                {showTorrentSearch && <TorrentSearchGames key="game-search" onClose={handleCloseTorrentSearch} />}
                {showMovieSearch && <TorrentSearchMovies key="movie-search" onClose={handleCloseMovieSearch} />}
                {showDexTokens && <DexScreenerLatest key="dex-tokens" onClose={handleCloseDexTokens} />}
                {showImageGenerator && <ImageGenerator key="image-generator" onClose={handleCloseImageGenerator} />}
            </AnimatePresence>
            {/* --- End Modals --- */}

        </S.AppContentWrapper>
    );
};

export default AppContent;
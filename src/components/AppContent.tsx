// src/components/AppContent.tsx
import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AnimatePresence } from 'framer-motion';

// Import styles
import * as S from './AppContent.styles';

import WalletInfo from './WalletInfo';
import TorrentSearchGames from './TorrentSearchGames';
import TorrentSearchMovies from "./TorrentSearchMovies";
import DexScreenerLatest from './DexScreenerLatest'; // <-- Import DexScreenerLatest

// --- App Content Component ---
const AppContent: FC = () => {
    const { connected } = useWallet();
    const [showTorrentSearch, setShowTorrentSearch] = useState(false);
    const [showMovieSearch, setShowMovieSearch] = useState(false);
    const [showDexTokens, setShowDexTokens] = useState(false); // <-- State for Dex Tokens

    const handleOpenTorrentSearch = () => { setShowTorrentSearch(true); };
    const handleCloseTorrentSearch = () => { setShowTorrentSearch(false); };

    const handleOpenMovieSearch = () => { setShowMovieSearch(true); };
    const handleCloseMovieSearch = () => { setShowMovieSearch(false); };

    // <-- Handlers for Dex Tokens -->
    const handleOpenDexTokens = () => { setShowDexTokens(true); };
    const handleCloseDexTokens = () => { setShowDexTokens(false); };
    // <-- End Handlers -->

    return (
        <S.AppContentWrapper
            variants={S.containerVariants}
            initial="hidden"
            animate="visible"
        >
            <S.Header variants={S.itemVariants}>
                <S.Logo src={process.env.PUBLIC_URL + '/plio-logo.png'} alt="Plio Logo" />
                <S.Title>$Plio Holder Panel</S.Title>
            </S.Header>

            <S.Description variants={S.itemVariants}>
                Access exclusive holder tools. Connect your wallet to view token details and use tools.
            </S.Description>

            <S.ActionsWrapper variants={S.itemVariants}>
                <S.StyledWalletMultiButton />

                {/* Game Search Button */}
                <S.StyledButton
                    onClick={handleOpenTorrentSearch}
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 7px 20px rgba(97, 218, 251, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    Open Game Search
                </S.StyledButton>

                {/* Movie Search Button */}
                <S.StyledButton
                    onClick={handleOpenMovieSearch}
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 7px 20px rgba(97, 218, 251, 0.3)" }} // Using same blue hover for consistency now
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    // style={{ borderColor: '#50fa7b', color: '#50fa7b' }} // Removed specific green style
                >
                    Open Movie Search (YTS)
                </S.StyledButton>

                {/* DexScreener Latest Tokens Button */}
                <S.StyledButton
                    onClick={handleOpenDexTokens} // <-- Use new handler
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 7px 20px rgba(250, 204, 21, 0.3)" }} // Yellow shadow
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    style={{ borderColor: '#facc15', color: '#facc15' }} // Yellow style
                >
                    Latest DexScreener Tokens
                </S.StyledButton>

            </S.ActionsWrapper>

            {/* Wallet Info */}
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

            {/* Game Search Modal */}
            <AnimatePresence>
                {showTorrentSearch && (
                    <TorrentSearchGames
                        key="game-search" // Changed key for clarity
                        onClose={handleCloseTorrentSearch}
                    />
                )}
            </AnimatePresence>

            {/* Movie Search Modal */}
            <AnimatePresence>
                {showMovieSearch && (
                    <TorrentSearchMovies
                        key="movie-search"
                        onClose={handleCloseMovieSearch}
                    />
                )}
            </AnimatePresence>

            {/* DexScreener Latest Tokens Modal */}
            <AnimatePresence>
                {showDexTokens && ( // <-- Conditional rendering for Dex Tokens
                    <DexScreenerLatest
                        key="dex-tokens"
                        onClose={handleCloseDexTokens} // <-- Use new handler
                    />
                )}
            </AnimatePresence>

        </S.AppContentWrapper>
    );
};

export default AppContent;
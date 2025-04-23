// src/components/AppContent.tsx
import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// WalletMultiButton is imported in styles file now, remove if not used directly
import { AnimatePresence } from 'framer-motion';

// Import styles
import * as S from './AppContent.styles';

import WalletInfo from './WalletInfo';
import TorrentSearchGames from './TorrentSearchGames';
import TorrentSearchMovies from "./TorrentSearchMovies";

// --- App Content Component ---
const AppContent: FC = () => {
    const { connected } = useWallet();
    const [showTorrentSearch, setShowTorrentSearch] = useState(false);
    const [showMovieSearch, setShowMovieSearch] = useState(false); // <-- State for Movie Search

    const handleOpenTorrentSearch = () => {
        setShowTorrentSearch(true);
    };

    const handleCloseTorrentSearch = () => {
        setShowTorrentSearch(false);
    };

    const handleOpenMovieSearch = () => {
        setShowMovieSearch(true);
    };
    const handleCloseMovieSearch = () => {
        setShowMovieSearch(false);
    };

    return (
        // Use imported styled components and variants
        <S.AppContentWrapper
            variants={S.containerVariants} // Use S.containerVariants
            initial="hidden"
            animate="visible"
        >
            <S.Header variants={S.itemVariants}> {/* Use S.itemVariants */}
                <S.Logo
                    src={process.env.PUBLIC_URL + '/plio-logo.png'}
                    alt="Plio Logo"
                />
                <S.Title>$Plio Holder Panel</S.Title>
            </S.Header>

            <S.Description variants={S.itemVariants}> {/* Use S.itemVariants */}
                Access exclusive holder tools. Connect your wallet to view token details or search the game torrent index.
            </S.Description>

            <S.ActionsWrapper variants={S.itemVariants}> {/* Use S.itemVariants */}
                <S.StyledWalletMultiButton />

                <S.StyledButton
                    onClick={handleOpenTorrentSearch}
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 7px 20px rgba(97, 218, 251, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    Open Torrent Game Search
                </S.StyledButton>

                {/* Movie Search Button */}
                <S.StyledButton
                    onClick={handleOpenMovieSearch} // <-- Use new handler
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 7px 20px rgba(80, 250, 123, 0.3)" }} // Different shadow?
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    // Optional: Slightly different style?
                    style={{ borderColor: '#50fa7b', color: '#50fa7b' }}
                >
                    Open Torrent Movie Search
                </S.StyledButton>
            </S.ActionsWrapper>

            <AnimatePresence>
                {connected && (
                    <S.WalletInfoWrapper
                        key="wallet-info"
                        variants={S.componentFadeSlideVariants} // Use S.componentFadeSlideVariants
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <WalletInfo />
                    </S.WalletInfoWrapper>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showTorrentSearch && (
                    <TorrentSearchGames
                        key="torrent-search"
                        onClose={handleCloseTorrentSearch}
                    />
                )}
            </AnimatePresence>

            {/* Movie Search Modal */}
            <AnimatePresence>
                {showMovieSearch && ( // <-- Conditional rendering for Movie Search
                    <TorrentSearchMovies
                        key="movie-search"
                        onClose={handleCloseMovieSearch} // <-- Use new handler
                    />
                )}
            </AnimatePresence>
        </S.AppContentWrapper>
    );
};

export default AppContent;
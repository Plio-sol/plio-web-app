// src/components/AppContent.tsx
import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// WalletMultiButton is imported in styles file now, remove if not used directly
import { AnimatePresence } from 'framer-motion';

// Import styles
import * as S from './AppContent.styles';

import WalletInfo from './WalletInfo';
import TorrentSearch from './TorrentSearch';

// --- App Content Component ---
const AppContent: FC = () => {
    const { connected } = useWallet();
    const [showTorrentSearch, setShowTorrentSearch] = useState(false);

    const handleOpenTorrentSearch = () => {
        setShowTorrentSearch(true);
    };

    const handleCloseTorrentSearch = () => {
        setShowTorrentSearch(false);
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
                    <TorrentSearch
                        key="torrent-search"
                        onClose={handleCloseTorrentSearch}
                    />
                )}
            </AnimatePresence>
        </S.AppContentWrapper>
    );
};

export default AppContent;
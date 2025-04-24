// src/components/AppContent.tsx
import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AnimatePresence } from 'framer-motion';

// Import styles
import * as S from './AppContent.styles';

import WalletInfo from './WalletInfo';
import TorrentSearchGames from './TorrentSearchGames';
import TorrentSearchMovies from './TorrentSearchMovies';
import DexScreenerLatest from './DexScreenerLatest';
import GifGenerator from './GifGenerator'; // <-- Import GifGenerator

// --- App Content Component ---
const AppContent: FC = () => {
  const { connected } = useWallet();
  const [showTorrentSearch, setShowTorrentSearch] = useState(false);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [showDexTokens, setShowDexTokens] = useState(false);
  const [showGifGenerator, setShowGifGenerator] = useState(false); // <-- State for GIF Generator

  // --- Handlers ---
  const handleOpenTorrentSearch = () => setShowTorrentSearch(true);
  const handleCloseTorrentSearch = () => setShowTorrentSearch(false);

  const handleOpenMovieSearch = () => setShowMovieSearch(true);
  const handleCloseMovieSearch = () => setShowMovieSearch(false);

  const handleOpenDexTokens = () => setShowDexTokens(true);
  const handleCloseDexTokens = () => setShowDexTokens(false);

  const handleOpenGifGenerator = () => setShowGifGenerator(true); // <-- Handler for GIF Generator
  const handleCloseGifGenerator = () => setShowGifGenerator(false); // <-- Handler for GIF Generator
  // --- End Handlers ---

  // --- REMOVED gifGeneratorUrl constant ---

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


        {/* --- Actions Wrapper --- */}
        <S.ActionsWrapper variants={S.itemVariants}>
          {/* ... Game Search Button ... */}
          <S.StyledButton
              onClick={handleOpenTorrentSearch}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 7px 20px rgba(97, 218, 251, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            Open Game Torrent Search
          </S.StyledButton>

          {/* ... Movie Search Button ... */}
          <S.StyledButton
              onClick={handleOpenMovieSearch}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 7px 20px rgba(97, 218, 251, 0.3)",
              }} // Using same blue hover for consistency now
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              // style={{ borderColor: '#50fa7b', color: '#50fa7b' }} // Removed specific green style
          >
            Open Movie Torrent Search
          </S.StyledButton>

          {/* ... DexScreener Button ... */}
          <S.StyledButton
              onClick={handleOpenDexTokens} // <-- Use new handler
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 7px 20px rgba(250, 204, 21, 0.3)",
              }} // Yellow shadow
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              style={{ borderColor: "#facc15", color: "#facc15" }} // Yellow style
          >
            Latest 'Dex Paid' Tokens
          </S.StyledButton>


          {/* --- UPDATED: GIF Generator Button (triggers modal) --- */}
          <S.StyledButton
              onClick={handleOpenGifGenerator} // <-- Use modal handler
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: '0 7px 20px rgba(80, 250, 123, 0.3)', // Green shadow
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              style={{ borderColor: '#50fa7b', color: '#50fa7b' }} // Green style
          >
            Open AI GIF Generator
          </S.StyledButton>
          {/* --- End UPDATED Button --- */}
        </S.ActionsWrapper>
        {/* --- End Actions Wrapper --- */}

        {/* ... Wallet Info ... */}
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


        {/* --- Modals --- */}
        <AnimatePresence>
          {showTorrentSearch && (
              <TorrentSearchGames
                  key="game-search"
                  onClose={handleCloseTorrentSearch}
              />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMovieSearch && (
              <TorrentSearchMovies
                  key="movie-search"
                  onClose={handleCloseMovieSearch}
              />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDexTokens && (
              <DexScreenerLatest
                  key="dex-tokens"
                  onClose={handleCloseDexTokens}
              />
          )}
        </AnimatePresence>

        {/* --- Add GifGenerator Modal --- */}
        <AnimatePresence>
          {showGifGenerator && (
              <GifGenerator
                  key="gif-generator"
                  onClose={handleCloseGifGenerator}
              />
          )}
        </AnimatePresence>
        {/* --- End Modals --- */}

      </S.AppContentWrapper>
  );
};

export default AppContent;
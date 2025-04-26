// src/App.tsx
import React, { FC, useMemo, useState, FormEvent, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// --- tsparticles Imports ---
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine"; // ISourceOptions no longer needed here
import { loadSlim } from "@tsparticles/slim";
// --- End tsparticles Imports ---

// Import the components
import PasswordForm from "./components/PasswordForm";
import AppContent from "./components/AppContent";
import styled, { createGlobalStyle } from "styled-components";

require("@solana/wallet-adapter-react-ui/styles.css");

// --- Styled Component for App Container ---
const StyledAppContainer = styled.div`
  min-height: 100vh;
  /* Consider changing min-height to height if you truly never want scrolling *within* this container either */
  /* height: 100vh; */
  /* overflow: hidden; */ /* Add this if you want to prevent scrolling *inside* StyledAppContainer */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccd6f6; // Default text color
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
  padding: 20px;
  position: relative; // Needed for z-index context with particles
  z-index: 0; // Ensure content is rendered above the particles background
  text-align: center; // Replicate the text-align from App.css if needed
  box-sizing: border-box; // Good practice to include padding in height calculation
`;
// --- End Styled Component ---

// --- Global Style to prevent body scrolling ---
const GlobalStyle = createGlobalStyle`
  body, html {
    overflow: hidden; /* Prevent scrolling on the body/html */
    margin: 0;      /* Reset default margin */
    padding: 0;     /* Reset default padding */
    height: 100%;   /* Ensure html/body take full height */
    width: 100%;    /* Ensure html/body take full width */
  }
`;

// --- Main App Component (Manages State and Renders Children) ---
const App: FC = () => {
  // --- Password Protection State ---
  const CORRECT_PASSWORD = process.env.REACT_APP_ACCESS_PASSWORD || "x";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  // --- End Password Protection State ---

  // --- Password Handling Functions ---
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(event.target.value);
    setAuthError(null);
  };

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (passwordInput === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setIsAuthenticated(false);
      setAuthError("Incorrect password.");
      setPasswordInput("");
    }
  };
  // --- End Password Handling Functions ---

  return (
    // Apply centering styles here, background is now handled by tsparticles
    <StyledAppContainer>
      {/* Conditionally render PasswordForm or AppContent */}
      {!isAuthenticated ? (
        <PasswordForm
          onSubmit={handlePasswordSubmit}
          passwordInput={passwordInput}
          onChange={handlePasswordChange}
          authError={authError}
        />
      ) : (
        <AppContent />
      )}
      <Analytics />
    </StyledAppContainer>
  );
};

// --- Wrap App with Providers (AND PARTICLES) ---
const AppWithProviders: FC = () => {
  // --- Solana Setup ---
  const endpoint =
    process.env.REACT_APP_SOLANA_RPC_HOST ||
    "https://api.mainnet-beta.solana.com";
  console.log(
    "Using RPC Endpoint:",
    endpoint.includes("solana.com") ? "Public Fallback" : "Custom RPC",
  );
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );
  // --- End Solana Setup ---

  // --- tsparticles State and Initialization ---
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Load the slim preset
      await loadSlim(engine);
    }).then(() => {
      setInit(true); // Mark initialization complete
    });
  }, []); // Empty dependency array ensures this runs only once

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container loaded:", container);
  };

  // --- REMOVED inline particlesOptions definition ---

  // --- End tsparticles Setup ---

  return (
    <>
      <GlobalStyle />
      {/* Render Particles conditionally after init */}
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          // --- UPDATED: Use url prop instead of options ---
          url="/particles.json" // Path relative to the public folder
          // --- End Update ---
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0, // Ensure it's behind other content
          }}
        />
      )}
      {/* Solana Wallet Providers */}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {/* Render the main App component */}
            <App />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

export default AppWithProviders;

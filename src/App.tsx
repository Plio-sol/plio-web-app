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

require("@solana/wallet-adapter-react-ui/styles.css");

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
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ccd6f6",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        padding: "20px",
        position: "relative",
        zIndex: 0, // Ensure content is above particles background
      }}
    >
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
    </div>
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
      {" "}
      {/* Use Fragment to wrap particles and providers */}
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

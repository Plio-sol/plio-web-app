// src/App.tsx
import React, { FC, useMemo, useState, FormEvent } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Import the components
import PasswordForm from './components/PasswordForm';
import AppContent from './components/AppContent';

require('@solana/wallet-adapter-react-ui/styles.css');
// Optional: Add a global CSS file for base styles if you prefer
// import './styles/global.css';

// --- Main App Component (Manages State and Renders Children) ---
const App: FC = () => {
    // --- Password Protection State ---
    // TODO: Use environment variable for production
    const CORRECT_PASSWORD = "x";
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
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
            setPasswordInput('');
        }
    };
    // --- End Password Handling Functions ---

    return (
        // Apply background and centering styles here
        <div
            className="App"
            style={{
                minHeight: '100vh', // Ensure it covers full viewport height
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // Dark blue gradient background
                background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)',
                color: '#ccd6f6', // Default light text color for the app
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", // Modern font stack
                padding: '20px', // Add some padding for smaller screens
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
        </div>
    );
};

// --- Wrap App with Providers (Stays in App.tsx) ---
const AppWithProviders: FC = () => {
    // Use environment variable for RPC or fallback
    const endpoint = process.env.REACT_APP_SOLANA_RPC_HOST || 'https://api.mainnet-beta.solana.com';
    console.log("Using RPC Endpoint:", endpoint.includes('solana.com') ? 'Public Fallback' : 'Custom RPC');
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <App /> {/* Render the main App component */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default AppWithProviders;
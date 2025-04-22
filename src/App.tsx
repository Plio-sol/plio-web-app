import React, { FC, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');
// import './styles/App.css'; // Keep this if you have custom App styles

// Define a type for our balance data
interface TokenBalance {
    mint: string;
    symbol: string;
    name: string;
    uiAmount: number;
    decimals: number;
    priceUsd: number | null;
    valueUsd: number | null;
}

// --- Component to Display Wallet Info ---
const WalletInfo: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balances, setBalances] = useState<TokenBalance[]>([]);
    const [solBalance, setSolBalance] = useState<TokenBalance | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!publicKey || !connection) {
            setBalances([]);
            setSolBalance(null);
            setError(null);
            setLoading(false);
            return;
        }

        const fetchBalances = async () => {
            setLoading(true);
            setError(null);
            setBalances([]);
            setSolBalance(null);

            try {
                // 1. Fetch SOL Balance
                const solLamports = await connection.getBalance(publicKey);
                const solAmount = solLamports / LAMPORTS_PER_SOL;

                // 2. Fetch SPL Token Accounts
                // Use commitment 'confirmed' for potentially faster results, 'processed' is okay too
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    publicKey,
                    { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }, // SPL Token Program ID
                    'confirmed'
                );

                const ownedMints = tokenAccounts.value
                    .map(accountInfo => accountInfo.account.data.parsed?.info?.mint) // Add safe navigation
                    .filter((mint): mint is string => typeof mint === 'string'); // Ensure mints are strings

                // Add SOL mint address placeholder
                const allMints = ['So11111111111111111111111111111111111111112', ...ownedMints];
                //const allMints = ['So11111111111111111111111111111111111111112'];

                // 3. Fetch Prices using Jupiter Price API V6
                const priceResponse = await fetch(`https://lite-api.jup.ag/price/v2?ids=${allMints.join(',')},So11111111111111111111111111111111111111112`);
                if (!priceResponse.ok) {
                    // Provide more context on price fetch failure
                    const errorBody = await priceResponse.text();
                    throw new Error(`Failed to fetch prices: ${priceResponse.status} ${priceResponse.statusText} - ${errorBody}`);
                }
                const priceData = await priceResponse.json();
                const prices: { [mint: string]: number } = {};
                if (priceData.data) {
                    Object.entries(priceData.data).forEach(([mint, data]: [string, any]) => {
                        if (data && typeof data.price === 'string') {
                            prices[mint] = data.price;
                        }
                    });
                }

                // 4. Process SOL Balance
                const solPrice = prices['So11111111111111111111111111111111111111112'] ?? null;
                const solValue = solPrice !== null ? solAmount * solPrice : null;
                // Ensure the object matches the TokenBalance interface (priceUsd can be null)
                setSolBalance({
                    mint: 'So11111111111111111111111111111111111111112',
                    symbol: 'SOL',
                    name: 'Solana',
                    uiAmount: solAmount,
                    decimals: 9, // SOL decimals
                    priceUsd: solPrice, // Assign the potentially null solPrice
                    valueUsd: solValue,
                });

                // 5. Process SPL Token Balances
                const splBalances = tokenAccounts.value
                    .map(accountInfo => {
                        // Add more robust checking for parsed data structure
                        const parsedInfo = accountInfo.account.data.parsed?.info;
                        if (!parsedInfo) return null; // Skip if info is missing

                        const mint = parsedInfo.mint;
                        const decimals = parsedInfo.tokenAmount?.decimals;
                        const uiAmount = parsedInfo.tokenAmount?.uiAmount;

                        // Check for valid mint, decimals, and non-zero uiAmount
                        if (!mint || typeof decimals !== 'number' || typeof uiAmount !== 'number' || uiAmount === 0) {
                            return null;
                        }

                        const price = prices[mint] ?? null;
                        const value = price !== null ? uiAmount * price : null;

                        // Use optional chaining for potentially missing symbol/name
                        const symbol = parsedInfo.tokenAmount?.symbol || mint.substring(0, 6) + '...';
                        const name = parsedInfo.tokenAmount?.name || 'Unknown Token';

                        // Ensure the returned object matches the TokenBalance interface
                        return {
                            mint,
                            symbol,
                            name,
                            uiAmount, // Guaranteed to be number here
                            decimals, // Guaranteed to be number here
                            priceUsd: price, // Assign the potentially null price
                            valueUsd: value,
                        };
                    })
                    // The type predicate works correctly with the updated TokenBalance interface
                    .filter((balance: TokenBalance | null): balance is TokenBalance => balance !== null) as TokenBalance[]; // <-- Add 'as TokenBalance[]' HERE
                setBalances(splBalances);

            } catch (err: any) {
                console.error("Failed to fetch balances:", err);
                // Improve error message display for common issues
                let userMessage = `Failed to fetch balances: ${err.message || 'Unknown error'}`;
                if (err.message && (err.message.includes('403') || err.message.includes('429'))) {
                    userMessage = "Failed to fetch balances: RPC request limit reached or access denied. Please try again later or ensure you're using a dedicated RPC endpoint.";
                } else if (err.message && err.message.includes('Failed to fetch prices')) {
                    userMessage = `Failed to fetch token prices: ${err.message}. Some values might be missing.`;
                }
                setError(userMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchBalances();

        // Optional: Set up an interval to refresh balances periodically
        // const intervalId = setInterval(fetchBalances, 60000); // Refresh every 60 seconds
        // return () => clearInterval(intervalId); // Cleanup interval on component unmount or publicKey change

    }, [publicKey, connection]); // Re-run effect when publicKey or connection changes

    // Display connection prompt if wallet not connected
    if (!publicKey) {
        // Don't show the loading/error state until wallet is connected
        return null; // Or return <p>Please connect your wallet above.</p>; if preferred
    }

    // Display loading/error/data state only after connection attempt
    return (
        <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '600px', margin: '30px auto' }}>
            <h2>Wallet Holdings</h2>
            {loading && <p>Loading balances...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Balance</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Price (USD)</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Value (USD)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Display SOL Balance First */}
                    {solBalance && (
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{solBalance.symbol} ({solBalance.name})</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {/* uiAmount is guaranteed non-null here, remove optional chaining */}
                                {solBalance.uiAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {solBalance.priceUsd !== null
                                    ? `$${solBalance.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}` // Allow more digits for low prices
                                    : 'N/A'}
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {solBalance.valueUsd !== null
                                    ? `$${solBalance.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : 'N/A'}
                            </td>
                        </tr>
                    )}
                    {/* Display SPL Token Balances */}
                    {balances.map((token) => (
                        <tr key={token.mint} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{token.symbol} ({token.name})</td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {/* uiAmount is guaranteed non-null here, remove optional chaining */}
                                {token.uiAmount.toLocaleString(undefined, { maximumFractionDigits: token.decimals })}
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {token.priceUsd !== null
                                    ? `$${token.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}` // Allow more digits for low prices
                                    : 'N/A'}
                            </td>
                            <td style={{ textAlign: 'right', padding: '8px' }}>
                                {token.valueUsd !== null
                                    ? `$${token.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : 'N/A'}
                            </td>
                        </tr>
                    ))}
                    {/* Show message if no tokens found (and SOL balance might also be missing/zero initially) */}
                    {!loading && !solBalance && balances.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>No token balances found or still loading.</td>
                        </tr>
                    )}
                    {/* Show message if SOL is present but no other tokens */}
                    {!loading && solBalance && balances.length === 0 && (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>No SPL token balances found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};


// --- Main App Component (Simplified) ---
const App: FC = () => {
    // No need to define network, endpoint, or wallets here
    // as they are handled by AppWithProviders

    // Use useWallet hook here to get connection status
    const { connected } = useWallet(); // We need WalletProvider context for this

    return (
        <div className="App" style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Solana Token Viewer</h1>
            <p>Connect your wallet to see your token holdings and their estimated USD value.</p>
            <WalletMultiButton />

            {/* Conditionally render WalletInfo only when connected */}
            {/* WalletInfo handles its own loading/error/empty states */}
            {connected && <WalletInfo />}
        </div>
    );
};

// --- Wrap App with Providers ---
const AppWithProviders: FC = () => {

    // Read the RPC endpoint from the environment variable, using clusterApiUrl as fallback
    const endpoint = 'https://blissful-small-county.solana-mainnet.quiknode.pro/16a5873515b5afea14862b7f39d45c806f128f6f/';
    console.log("Using RPC Endpoint:", endpoint.startsWith('https://api') ? 'Public Fallback' : endpoint); // Log endpoint (hide sensitive parts if needed)

    // Memoize wallets list
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(), // Defaults to Mainnet
            new SolflareWalletAdapter()  // Defaults to Mainnet
            // Add other wallets like BackpackAdapter etc. if needed
        ],
        [] // No dependency needed as network is fixed to Mainne
    );

    return (
        // Use the determined endpoint for the ConnectionProvider
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* Render the main App component */}
                    <App />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};


export default AppWithProviders; // Export the wrapped component
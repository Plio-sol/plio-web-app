/* config-overrides.js */
const webpack = require('webpack');

module.exports = function override(config, env) {
    console.log('Applying config overrides...');



    // --- Remove Alias for process ---
    if (config.resolve.alias && config.resolve.alias.process) {
        delete config.resolve.alias.process;
        console.log('Removed resolve.alias override for process.');
    }

    // --- Polyfill Node.js core modules using Fallback ---
    config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        'process/browser': require.resolve('process/browser'),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/"),
        "vm": require.resolve("vm-browserify"),
    };
    console.log('Added/updated resolve.fallback overrides (including vm, process points to browser.js).');


    // --- Provide global variables Buffer and process ---
    // Keep ProvidePlugin pointing to 'process/browser'
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser', // Provide process globally - using 'process/browser' often works best here
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'], // Keep Buffer ProvidePlugin
        })
    ]);
    console.log('Kept ProvidePlugin for process (using process/browser). Kept ProvidePlugin for Buffer.');

    // --- Suppress Source Map Warnings ---
    config.ignoreWarnings = [/Failed to parse source map/];
    console.log('Added ignoreWarnings for source map parsing errors.');

    console.log('Config overrides applied.');
    return config; // Return the modified config
}
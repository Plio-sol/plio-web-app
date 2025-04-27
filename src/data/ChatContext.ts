// src/data/ChatContext.ts

// --- Define Raw Data ---

const appName = "Plio";

const contractAddress = "2E7ZJe3n9mAnyW1AvouZY8EbfWBssvxov116Mma3pump"; // Make sure this is correct

const socials = [
  { name: "X (Twitter)", url: "https://x.com/PlioSol" },
  { name: "pump.fun", url: `https://pump.fun/${contractAddress}` },
];

const availableTools = [
  {
    name: "Game Torrents",
    description: "Search for PC game torrents from DODI and FitGirl.",
    icon: "FaGamepad",
  },
  {
    name: "Movie Torrents",
    description: "Search for movie torrents from 1337x.",
    icon: "FaFilm",
  },
  {
    name: "Dex Screener New Pairs",
    description:
      "View the latest token pairs promoted on DexScreener, with links.",
    icon: "FaChartLine",
  },
  {
    name: "AI Image Generator",
    description: "Generate images from text prompts using Google Gemini.",
    icon: "FaImage",
  },
  {
    name: "Project Roadmap",
    description:
      "View planned and upcoming features for the Plio Holder Panel.",
    icon: "FaMapSigns",
  },
  {
    name: "AI Chat (This tool)",
    description:
      "Chat with PlioBot for assistance and information about the panel.",
    icon: "FaComments",
  },
];

const roadmapItems = [
  {
    title: "Solana Status & Gas Tracker",
    description:
      "Display key network health indicators like current TPS and estimated priority fees (gas) for low, medium, and high priority transactions. Helps you decide the best time to transact and know when the market is heating up 🔥.",
    status: "Planned",
  },
  {
    title: "Crypto Market Dashboard",
    description:
      "Show current prices for SOL and other major cryptos (BTC, ETH, PLIO, and more trending meme coins) directly within the panel. Automatic AI price analysis by Google Gemini so you always know where the market is headed. Powered by lightening fast price APIs.",
    status: "Planned",
  },
  {
    title: "Dex Screener Volume Tracker",
    description:
        "Track real-time trading volume surges across Solana tokens on Dex Screener. Identify which coins are pumping *right now* so you don't miss the next big move.",
    status: "Planned",
  },
  {
    title: "AI Chat Context Enhancement",
    description:
      "Giving the chatbot complete, real-time context over the entire application state (like live wallet balances, dynamic API content). This involves advanced techniques like Function Calling or Retrieval-Augmented Generation (RAG), which I am exploring for future integration.",
    status: "Researching",
  },
  // Add more items here as they are defined in Roadmap.tsx
];

const personalitiesInfo = [
  { name: "Nice", description: "Friendly and helpful assistant." },
  {
    name: "Crude",
    description: "Offensive, enthusiastic, and curses frequently.",
  },
];

const mainPageInfo = `
The main page displays the $Plio logo, social links (X, pump.fun), the contract address (clickable to copy), the main title "${appName}", a button to connect the wallet, and a brief description. If the user connects their wallet, a Wallet Info section appears showing their $Plio balance and estimated USD value. A Jupiter swap widget is also available on desktop.
`.trim();

// --- Format Data for Prompt ---

function formatAppContextForPrompt(): string {
  let contextString = `**Application Information:**\n`;
  contextString += `- App Name: ${appName}\n`;
  contextString += `- Contract Address: ${contractAddress}\n`;
  contextString += `- Main Page Summary: ${mainPageInfo}\n`;

  contextString += `\n**Available Tools:**\n`;
  availableTools.forEach((tool) => {
    contextString += `- ${tool.name}: ${tool.description}\n`;
  });

  contextString += `\n**Project Roadmap (${roadmapItems.length} items):**\n`;
  roadmapItems.forEach((item) => {
    contextString += `- ${item.title} (${item.status}): ${item.description}\n`;
  });

  contextString += `\n**Chatbot Personalities:**\n`;
  personalitiesInfo.forEach((p) => {
    contextString += `- ${p.name}: ${p.description}\n`;
  });

  contextString += `\n**Social Links:**\n`;
  socials.forEach((s) => {
    contextString += `- ${s.name}: ${s.url}\n`;
  });

  return contextString;
}

// --- Export Formatted Context ---

export const APP_CONTEXT_FOR_PROMPT = formatAppContextForPrompt();

// Optional: Export raw data if needed elsewhere
// export { appName, contractAddress, socials, availableTools, roadmapItems, personalitiesInfo, mainPageInfo };

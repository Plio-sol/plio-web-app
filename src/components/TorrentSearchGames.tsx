// src/components/TorrentSearchGames.tsx
import React, { FC, useState, FormEvent } from "react";
// Remove styled, keyframes imports as they are in the .styles file
import { AnimatePresence } from "framer-motion";

// Import all styled components using an alias 'S'
import * as S from "./TorrentSearchGames.styles";

// --- Types ---
interface SearchResultItem {
  id: string;
  name: string;
  size: string;
  link: string;
  source: "DODI" | "FitGirl";
}

// Make properties optional to handle potential missing data from API
interface RawDownloadItem {
  title?: string;
  fileSize?: string;
  uris?: string[];
}

interface TorrentSearchProps {
  onClose?: () => void;
}

// SourceTagProps is now imported via S if needed by other logic,
// but primarily used within TorrentSearchGames.styles.ts

// --- Framer Motion Variants (Defined within the component file) ---
const overlayVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const resultsGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Stagger results cards
    },
  },
};

const resultCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// --- TorrentSearchGames Component ---
const TorrentSearchGames: FC<TorrentSearchProps> = ({ onClose }) => {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // URLs
  const dodiUrl = "https://hydralinks.cloud/sources/dodi.json";
  const fitgirlUrl = "https://hydralinks.cloud/sources/fitgirl.json";

  // --- Event Handlers ---
  const handleSearch = async (event?: FormEvent) => {
    console.log("handleSearch triggered. Event:", event); // Debug log

    if (event) {
      event.preventDefault(); // Prevent default form submission
      console.log("Default prevented:", event.defaultPrevented); // Debug log
    } else {
      console.log("handleSearch called without event (e.g., from Enter key)"); // Debug log
    }

    if (!searchTerm.trim()) {
      setResults([]);
      setError("Please enter something to search for.");
      setSearched(true);
      return;
    }

    console.log("Setting loading state and starting fetch..."); // Debug log
    setIsLoading(true);
    setError(null);
    setResults([]); // Clear previous results immediately
    setSearched(true);

    try {
      const [dodiResponse, fitgirlResponse] = await Promise.all([
        fetch(dodiUrl),
        fetch(fitgirlUrl),
      ]);

      if (!dodiResponse.ok)
        throw new Error(
          `Failed to fetch DODI data: ${dodiResponse.statusText}`,
        );
      if (!fitgirlResponse.ok)
        throw new Error(
          `Failed to fetch FitGirl data: ${fitgirlResponse.statusText}`,
        );

      const dodiData = await dodiResponse.json();
      const fitgirlData = await fitgirlResponse.json();

      const decodedSearchTerm = decodeURIComponent(searchTerm);
      const searchTerms = decodedSearchTerm
        .toLowerCase()
        .split(" ")
        .filter((term) => term);

      // --- Data Processing Function ---
      const filterAndMap = (
        data: any,
        source: "DODI" | "FitGirl",
      ): SearchResultItem[] => {
        if (!data || !Array.isArray(data.downloads)) {
          console.warn(
            `Invalid or missing 'downloads' array received from ${source}`,
          );
          return [];
        }

        const mappedResults: SearchResultItem[] = [];

        data.downloads.forEach((item: RawDownloadItem, index: number) => {
          // Check for essential properties
          if (
            !item ||
            typeof item.title !== "string" ||
            !Array.isArray(item.uris) ||
            item.uris.length === 0
          ) {
            // console.warn(`Skipping invalid item from ${source}:`, item);
            return; // Skip invalid item
          }

          const titleLower = item.title.toLowerCase();
          const matchesSearch = searchTerms.some((term) =>
            titleLower.includes(term),
          );

          if (matchesSearch) {
            // Construct the result safely
            const result: SearchResultItem = {
              id: `${source}-${item.title.slice(0, 20)}-${index}`, // Unique ID
              name: item.title,
              size: typeof item.fileSize === "string" ? item.fileSize : "N/A", // Handle missing size
              link: item.uris[0], // Safe to access due to check above
              source: source,
            };
            mappedResults.push(result);
          }
        });

        return mappedResults;
      };
      // --- End of Data Processing ---

      const dodiResults = filterAndMap(dodiData, "DODI");
      const fitgirlResults = filterAndMap(fitgirlData, "FitGirl");

      console.log("Fetch successful, setting results."); // Debug log
      setResults([...dodiResults, ...fitgirlResults]);
    } catch (err: any) {
      console.error("Search failed inside handleSearch:", err); // Debug log
      setError(err.message || "An unknown error occurred during search.");
      setResults([]); // Clear results on error
    } finally {
      console.log("Setting loading state to false."); // Debug log
      setIsLoading(false); // Ensure loading is set to false
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Form onSubmit handles the search, no need for separate call here if input is inside form
    }
  };

  // --- Render Logic ---
  return (
    // Use imported styled components with 'S.' prefix
    <S.OverlayContainer
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Close Button */}
      {onClose && (
        <S.CloseButton
          onClick={onClose}
          aria-label="Close Search"
          whileHover={{ scale: 1.1, rotate: 90, color: "#61DAFB" }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          &times;
        </S.CloseButton>
      )}

      <S.SearchTitle>Torrent Game Search</S.SearchTitle>

      {/* Search Form */}
      <S.SearchForm onSubmit={handleSearch}>
        <S.SearchInput
          type="text"
          placeholder="Search for PC Games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress} // Keep for accessibility if needed, but form submit handles Enter
        />
        <S.SearchButton
          type="submit"
          disabled={isLoading}
          whileHover={
            !isLoading ? { scale: 1.03, backgroundColor: "#7a1fc2" } : {}
          }
          whileTap={!isLoading ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isLoading ? "Searching..." : "Search"}
        </S.SearchButton>
      </S.SearchForm>

      <S.HintText>
        Tip: Use specific terms for better results (e.g., 'spider-man' works,
        'spiderman' might not).
      </S.HintText>

      {/* Results Area */}
      <S.ResultsArea>
        {/* Spinner Animation */}
        <AnimatePresence>
          {isLoading && (
            <S.Spinner
              key="spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
            />
          )}
        </AnimatePresence>

        {/* Error and No Results Messages - Use new styled components */}
        {!isLoading && error && <S.ErrorMessage>Error: {error}</S.ErrorMessage>}
        {!isLoading && !error && searched && results.length === 0 && (
          <S.NoResultsMessage>
            No results found for "{searchTerm}".
          </S.NoResultsMessage>
        )}

        {/* Results Grid */}
        {!isLoading && !error && results.length > 0 && (
          <S.ResultsGrid
            variants={resultsGridVariants}
            initial="hidden"
            animate="visible"
          >
            {results.map((item) => (
              <S.ResultCard
                key={item.id}
                variants={resultCardVariants}
                layout
                whileHover={{
                  y: -5,
                  borderColor: "rgba(97, 218, 251, 0.6)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div>
                  <S.CardTitle>{item.name}</S.CardTitle>
                  <S.CardInfo>
                    Size: {item.size} | Source:
                    <S.SourceTag source={item.source}>
                      {item.source}
                    </S.SourceTag>
                  </S.CardInfo>
                </div>
                <S.DownloadLink
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    boxShadow: "0 7px 15px rgba(138, 43, 226, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  Download Link
                </S.DownloadLink>
              </S.ResultCard>
            ))}
          </S.ResultsGrid>
        )}
      </S.ResultsArea>
    </S.OverlayContainer>
  );
};

export default TorrentSearchGames;

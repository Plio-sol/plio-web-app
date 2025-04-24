// src/components/TorrentSearchMovies.tsx
import React, { FC, useState, FormEvent } from "react";
import { AnimatePresence } from "framer-motion";

// Import all styled components using an alias 'S'
import * as S from "./TorrentSearchMovies.styles";

// --- Types ---

// Structure of a single torrent object within the YTS API response
interface YtsTorrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

// Structure of a single movie object within the YTS API response
interface YtsMovie {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  synopsis: string;
  yt_trailer_code: string;
  language: string;
  mpa_rating: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  state: string;
  torrents: YtsTorrent[]; // Array of torrents for different qualities
  date_uploaded: string;
  date_uploaded_unix: number;
}

// Structure of the main YTS API response
interface YtsApiResponse {
  status: "ok" | "error";
  status_message: string;
  data?: {
    // Data might be missing on error
    movie_count: number;
    limit: number;
    page_number: number;
    movies?: YtsMovie[]; // Movies array might be missing if no results
  };
  "@meta": {
    server_time: number;
    server_timezone: string;
    api_version: number;
    execution_time: string;
  };
}

// Our internal structure for displaying results (one item per torrent quality)
interface MovieResultItem {
  id: string; // Unique ID for React key (e.g., movie_id + hash)
  movieId: number;
  title: string;
  year: number;
  rating: number;
  coverImage: string;
  size: string;
  seeds: number;
  peers: number; // YTS uses 'peers' instead of 'leeches'
  quality: string;
  link: string; // Magnet link
  ytsUrl: string; // Link to YTS movie page
}

interface MovieSearchProps {
  onClose?: () => void;
}

// --- Framer Motion Variants ---
const overlayVariants = {
  /* ... (same as before) ... */
};
const resultsGridVariants = {
  /* ... (same as before) ... */
};
const resultCardVariants = {
  /* ... (same as before) ... */
};

// --- MovieSearch Component ---
const TorrentSearchMovies: FC<MovieSearchProps> = ({ onClose }) => {
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<MovieResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // --- YTS API Endpoint ---
  const YTS_API_URL = "https://yts.mx/api/v2/list_movies.json";

  // --- Event Handlers ---
  const handleSearch = async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (!searchTerm.trim()) {
      setResults([]);
      setError("Please enter a movie title to search for.");
      setSearched(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);

    console.log(`Searching YTS API for: ${searchTerm}`);

    try {
      // Construct the API URL with query parameters
      // Common params: query_term, limit, sort_by, quality, page
      const apiUrl = `${YTS_API_URL}?query_term=${encodeURIComponent(searchTerm)}&limit=30&sort_by=seeds`; // Fetch more, sort by seeds

      const response = await fetch(apiUrl);

      if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        throw new Error(
          `YTS API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data: YtsApiResponse = await response.json();

      // Check API status
      if (data.status !== "ok") {
        throw new Error(`YTS API Error: ${data.status_message}`);
      }

      // Check if movies data exists and is an array
      const movies = data.data?.movies;
      if (!movies || movies.length === 0) {
        setResults([]); // No results found
      } else {
        // Map the data: Create one result item for each TORRENT available
        const mappedResults: MovieResultItem[] = movies.flatMap((movie) =>
          movie.torrents.map((torrent) => {
            // Construct Magnet Link
            const encodedTitle = encodeURIComponent(movie.title_long);
            const magnetLink = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodedTitle}&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce`; // Added common trackers

            return {
              id: `${movie.id}-${torrent.hash}`, // Unique ID
              movieId: movie.id,
              title: movie.title_long, // Use the long title
              year: movie.year,
              rating: movie.rating,
              coverImage: movie.medium_cover_image || movie.small_cover_image, // Use medium or fallback to small
              size: torrent.size,
              seeds: torrent.seeds,
              peers: torrent.peers,
              quality: torrent.quality,
              link: magnetLink,
              ytsUrl: movie.url,
            };
          }),
        );

        // Optional: Sort results further if needed (e.g., by seeds descending)
        mappedResults.sort((a, b) => b.seeds - a.seeds);

        setResults(mappedResults);
      }
    } catch (err: any) {
      console.error("YTS Movie search failed:", err);
      // Check if the error message indicates a CORS issue, although less likely with YTS API
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        setError(
          `Network error or potential CORS issue fetching from YTS API. ${err.message}`,
        );
      } else {
        setError(err.message || "An unknown error occurred during search.");
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(); // Trigger search on Enter
    }
  };

  // --- Render Logic ---
  return (
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
          aria-label="Close Movie Search"
          whileHover={{ scale: 1.1, rotate: 90, color: "#61DAFB" }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          &times;
        </S.CloseButton>
      )}

      <S.SearchTitle>Movie Search</S.SearchTitle>

      {/* Search Form */}
      <S.SearchForm onSubmit={handleSearch}>
        <S.SearchInput
          type="text"
          placeholder="Search for Movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <S.SearchButton
          type="submit"
          disabled={isLoading}
          whileHover={
            !isLoading ? { scale: 1.03, backgroundColor: "#4aabbd" } : {}
          }
          whileTap={!isLoading ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isLoading ? "Searching..." : "Search Movies"}
        </S.SearchButton>
      </S.SearchForm>

      <S.HintText>
        Tip: Use specific terms for better results (e.g., 'spider-man' works,
        'spiderman' might not).
      </S.HintText>

      {/* Results Area */}
      <S.ResultsArea>
        <AnimatePresence>
          {isLoading && (
            <S.Spinner
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                opacity: { duration: 0.2 },
              }}
            />
          )}
        </AnimatePresence>

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
              <S.MovieResultCard
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
                <S.CardContent>
                  <S.CardHeader>
                    {item.coverImage && (
                      <S.CoverImage
                        src={item.coverImage}
                        alt={`${item.title} cover`}
                      />
                    )}
                    <S.HeaderText>
                      <S.CardTitle>{item.title}</S.CardTitle>
                      {/* <S.CardSubTitle>Year: {item.year}</S.CardSubTitle> */}
                    </S.HeaderText>
                  </S.CardHeader>

                  <S.CardInfo>
                    <S.InfoItem className="quality">{item.quality}</S.InfoItem>
                    <S.InfoItem className="rating">{item.rating}/10</S.InfoItem>
                    <S.InfoItem className="seeds">{item.seeds}</S.InfoItem>
                    <S.InfoItem className="peers">{item.peers}</S.InfoItem>
                    <S.InfoItem className="size">{item.size}</S.InfoItem>
                  </S.CardInfo>

                  <S.MagnetLink
                    href={item.link}
                    title={`Download ${item.title} (${item.quality})`}
                    whileHover={{
                      scale: 1.03,
                      y: -2,
                      boxShadow: "0 6px 12px rgba(97, 218, 251, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    Magnet Link ({item.quality})
                  </S.MagnetLink>
                </S.CardContent>
              </S.MovieResultCard>
            ))}
          </S.ResultsGrid>
        )}
      </S.ResultsArea>
    </S.OverlayContainer>
  );
};

export default TorrentSearchMovies;

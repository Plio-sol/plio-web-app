import React, { FC, useState, useCallback, FormEvent } from "react";
import { AnimatePresence } from "framer-motion";
import * as S from "./TorrentSearchMovies.styles";

// --- Interfaces (Assuming these exist based on styles) ---
interface YtsMovieTorrent {
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
  torrents: YtsMovieTorrent[];
  date_uploaded: string;
  date_uploaded_unix: number;
}

interface TorrentSearchMoviesProps {
  onClose: () => void;
}

// --- Framer Motion Variants ---
// *** Define variants for the overlay container ***
const overlayVariants = {
  hidden: { opacity: 0, scale: 0.98 }, // Start slightly scaled down and invisible
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }, // Smooth transition in
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" }, // Smooth transition out
  },
};

// Optional: Variants for the results grid and cards if you want stagger effects
const resultsGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Stagger card animation
    },
  },
};

const movieCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- Component ---
const TorrentSearchMovies: FC<TorrentSearchMoviesProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<YtsMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false); // Track if a search has been performed

  const YTS_API_URL = "https://yts.mx/api/v2/list_movies.json";

  const handleSearch = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault(); // Prevent default form submission
      if (!searchTerm.trim()) {
        setError("Please enter a movie title to search.");
        setMovies([]);
        setSearched(true);
        return;
      }

      setIsLoading(true);
      setError(null);
      setMovies([]);
      setSearched(true); // Mark that a search was attempted

      try {
        const queryParams = new URLSearchParams({
          limit: "20", // Limit results
          query_term: searchTerm.trim(),
          sort_by: "seeds", // Sort by seeds for better availability
          order_by: "desc",
        });
        const response = await fetch(
          `${YTS_API_URL}?${queryParams.toString()}`,
        );

        if (!response.ok) {
          throw new Error(`YTS API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== "ok") {
          throw new Error(data.status_message || "YTS API returned an error.");
        }

        if (data.data.movie_count === 0 || !data.data.movies) {
          setMovies([]); // Ensure empty array for no results
        } else {
          setMovies(data.data.movies);
        }
      } catch (err: any) {
        console.error("Movie search failed:", err);
        setError(err.message || "An unknown error occurred during search.");
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm],
  );

  // Helper to create magnet link
  const createMagnetLink = (hash: string, title: string): string => {
    const trackers = [
      // Add reliable trackers
      "udp://tracker.opentrackr.org:1337/announce",
      "udp://tracker.openbittorrent.com:6969/announce",
      "udp://open.demonii.com:1337/announce",
      "udp://tracker.coppersurfer.tk:6969/announce",
      "udp://tracker.leechers-paradise.org:6969/announce",
      "udp://exodus.desync.com:6969/announce",
      "udp://tracker.torrent.eu.org:451/announce",
      "udp://tracker.dler.org:6969/announce",
    ];
    const trackerParams = trackers
      .map((t) => `tr=${encodeURIComponent(t)}`)
      .join("&");
    return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&${trackerParams}`;
  };

  return (
    // *** Apply animation props to OverlayContainer ***
    <S.OverlayContainer
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      // onClick={onClose} // Optional: Close on backdrop click
    >
      {/* Prevent clicks inside modal from closing it if backdrop click is enabled */}
      {/* <div onClick={(e) => e.stopPropagation()}> NO - OverlayContainer IS the modal */}

      <S.CloseButton
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        &times;
      </S.CloseButton>

      <S.SearchTitle>Search Movie Torrents</S.SearchTitle>

      <S.SearchForm onSubmit={handleSearch}>
        <S.SearchInput
          type="text"
          placeholder="Enter movie title (e.g., Inception, Dune 2021)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        <S.SearchButton
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          whileHover={!isLoading && searchTerm.trim() ? { scale: 1.05 } : {}}
          whileTap={!isLoading && searchTerm.trim() ? { scale: 0.98 } : {}}
        >
          {isLoading ? "Searching..." : "Search"}
        </S.SearchButton>
      </S.SearchForm>

      <S.HintText>
        Tip: Use specific terms for better results (e.g., 'spider-man' works,
        'spiderman' might not).
      </S.HintText>

      <S.ResultsArea>
        <AnimatePresence mode="wait">
          {" "}
          {/* Use mode="wait" for smoother transitions between states */}
          {isLoading && (
            <S.Spinner
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
          {!isLoading && error && (
            <S.ErrorMessage key="error">{error}</S.ErrorMessage>
          )}
          {!isLoading && !error && searched && movies.length === 0 && (
            <S.NoResultsMessage key="no-results">
              No movies found matching "{searchTerm}". Try a different title.
            </S.NoResultsMessage>
          )}
        </AnimatePresence>

        {!isLoading && !error && movies.length > 0 && (
          <S.ResultsGrid
            variants={resultsGridVariants} // Apply grid variants
            initial="hidden"
            animate="visible"
            // No exit needed here usually, cards handle exit
          >
            {/* Wrap mapped items in AnimatePresence for exit animations */}
            <AnimatePresence>
              {movies.map((movie) => (
                <S.MovieResultCard
                  key={movie.id} // Use movie ID as key
                  variants={movieCardVariants} // Apply card variants
                  // initial, animate are handled by grid stagger
                  exit="exit" // Define exit animation
                  layout // Enable smooth layout changes on add/remove
                >
                  <S.CardContent>
                    <S.CardHeader>
                      <S.CoverImage
                        src={movie.medium_cover_image}
                        alt={`${movie.title} cover`}
                      />
                      <S.HeaderText>
                        <S.CardTitle>{movie.title_long}</S.CardTitle>
                        <S.CardSubTitle>
                          {movie.genres?.join(", ")}
                        </S.CardSubTitle>
                      </S.HeaderText>
                    </S.CardHeader>

                    <S.CardInfo>
                      {/* Display best available torrent info */}
                      {movie.torrents && movie.torrents.length > 0 && (
                        <>
                          <S.InfoItem className="quality">
                            {movie.torrents[0].quality}
                          </S.InfoItem>
                          <S.InfoItem className="size">
                            {movie.torrents[0].size}
                          </S.InfoItem>
                          <S.InfoItem className="seeds">
                            {movie.torrents[0].seeds}
                          </S.InfoItem>
                          <S.InfoItem className="peers">
                            {movie.torrents[0].peers}
                          </S.InfoItem>
                        </>
                      )}
                      <S.InfoItem className="rating">
                        {movie.rating}/10
                      </S.InfoItem>
                    </S.CardInfo>

                    {/* Magnet Link for best torrent */}
                    {movie.torrents && movie.torrents.length > 0 && (
                      <S.MagnetLink
                        href={createMagnetLink(
                          movie.torrents[0].hash,
                          movie.title_long,
                        )}
                        title={`Download ${movie.title_long} (${movie.torrents[0].quality})`}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 6px 15px rgba(97, 218, 251, 0.4)",
                        }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Get Torrent ({movie.torrents[0].quality})
                      </S.MagnetLink>
                    )}
                  </S.CardContent>
                </S.MovieResultCard>
              ))}
            </AnimatePresence>
          </S.ResultsGrid>
        )}
      </S.ResultsArea>
    </S.OverlayContainer>
  );
};

export default TorrentSearchMovies;

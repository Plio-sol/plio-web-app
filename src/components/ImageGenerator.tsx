import React, { FC, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Updated Style Import ---
import * as S from "./ImageGenerator.styles";

// --- Renamed Props Interface ---
interface ImageGeneratorProps {
  onClose: () => void;
}

// --- Framer Motion Variants ---
const overlayVariants = {
  /* ... as before ... */ hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const contentVariants = {
  /* ... as before ... */ hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } },
};
const imageVariants = {
  /* ... as before ... */ hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

// --- Helper: Parse Error (Keep for fetch errors) ---
function parseError(error: any): string {
  console.error("Image Generation UI Error:", error); // Log frontend errors distinctly
  return String(error?.message || error || "An unknown error occurred.");
}

// --- Renamed Component ---
const ImageGenerator: FC<ImageGeneratorProps> = ({ onClose }) => {
  // --- State ---
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = useCallback(async () => {
    // Check only for prompt and loading state
    if (!prompt.trim() || isLoading) {
      return;
    }

    const currentPromptValue = prompt.trim(); // Use consistent variable if needed

    // Reset state
    setIsLoading(true);
    setStatus("Generating image...");
    setError(null);
    setImageUrl(null);

    try {
      console.log(
        `Frontend: Sending prompt to backend: "${currentPromptValue}"`,
      );

      // --- Call the backend Netlify function ---
      const response = await fetch("https://plio.fun/.netlify/functions/image-generator", {
        method: "POST",
        mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentPromptValue }), // Send prompt
      });
      // --- End fetch call ---

      const data = await response.json(); // Always try parsing JSON

      console.log("Frontend: Backend Response:", data);

      if (!response.ok) {
        // Handle errors reported by the backend function
        throw new Error(
          data.error || `API request failed: ${response.statusText}`,
        );
      }

      // --- Process successful response from backend ---
      if (data.imageData && data.mimeType) {
        // Construct data URL in the frontend
        const dataUrl = `data:${data.mimeType};base64,${data.imageData}`;
        setImageUrl(dataUrl);
        setStatus("Done!"); // Update status on success
      } else {
        // If backend succeeded (200 OK) but didn't return expected data
        console.error(
          "Frontend: Backend returned success but missing image data.",
        );
        throw new Error("Received invalid image data from server.");
      }
      // --- End processing response ---
    } catch (err: any) {
      console.error("Frontend: Error generating image:", err);
      const message = parseError(err); // Use parseError for fetch/JSON errors
      setError(`Error: ${message}`);
      setStatus("Failed"); // Update status on failure
    } finally {
      setIsLoading(false);
      // Refocus input after attempt
      inputRef.current?.focus();
    }
  }, [prompt, isLoading]); // Dependencies remain prompt and isLoading

  // --- Event Handlers (handleKeyDown, handleDownload) remain the same ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleGenerate();
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    const filename =
      prompt
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .substring(0, 30) || "generated_image";
    // Try to get extension from mimeType
    const extension = imageUrl.split(";")[0]?.split("/")[1] || "png";
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // --- JSX Rendering (remains the same) ---
  return (
    <S.OverlayContainer
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <S.CloseButton onClick={onClose}>&times;</S.CloseButton>

      <motion.div
        variants={contentVariants}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <S.Title>AI Image Generator</S.Title>

        <S.PromptSection>
          <S.PromptInput
            ref={inputRef}
            type="text"
            placeholder="Enter a prompt (e.g., 'astronaut riding a horse')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <S.GenerateButton
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={isLoading ? "loading" : ""}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <span>Generate</span>
            {isLoading && <S.ButtonSpinner />}
          </S.GenerateButton>
        </S.PromptSection>
        <S.HintText>
          If image fails to load, It was probably deemed inappropriate or the
          API is overloaded.
        </S.HintText>
        <S.StatusDisplay>{status}</S.StatusDisplay>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        {/* Image Display Area */}
        <AnimatePresence>
          {imageUrl && (
            <S.ImageContainer
              key="generated-image"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <img src={imageUrl} alt={`Generated for: ${prompt}`} />
              <S.DownloadButton onClick={handleDownload}>
                <span>Download Image</span>
              </S.DownloadButton>
            </S.ImageContainer>
          )}
        </AnimatePresence>

        {!imageUrl && !isLoading && !error && (
          <div style={{ marginTop: "50px", color: "#8892b0" }}>
            Enter a prompt to generate an image.
          </div>
        )}
      </motion.div>
    </S.OverlayContainer>
  );
};

// --- Updated Default Export ---
export default ImageGenerator;

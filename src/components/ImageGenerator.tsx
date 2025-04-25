import React, { FC, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Updated Style Import ---
import * as S from "./ImageGenerator.styles";
// --- Updated GenAI Import ---
import { GoogleGenAI, Modality } from "@google/genai";

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

// --- Constants ---
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
// Use the model from the new example
const IMAGE_MODEL_NAME = "gemini-2.0-flash-exp-image-generation";

// --- Helper: Parse Error ---
function parseError(error: any): string {
  // Simplified error parsing
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

  // --- Refs ---
  // No need for aiRef if we initialize inside handleGenerate based on example
  // const aiRef = useRef<GoogleGenerativeAI | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Effect only needed now to check for API Key existence on load
    if (!API_KEY) {
      setError(
        "Google API Key not found. Please set REACT_APP_GOOGLE_API_KEY.",
      );
      console.error("Google API Key missing!");
    }
  }, []); // Check only once

  // --- Generation Logic (Using generateImages) ---
  const handleGenerate = useCallback(async () => {
    // Check for prompt and API key before starting
    if (!prompt.trim() || isLoading || !API_KEY) {
      if (!API_KEY) setError("API Key is missing.");
      return;
    }

    const currentPromptValue = prompt.trim();

    // Reset state
    setIsLoading(true);
    setStatus("Generating image...");
    setError(null);
    setImageUrl(null);

    // Initialize AI client inside the handler, as per the example structure
    // Using vertexai: false for direct API key usage
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
      console.log(
        `Sending prompt to ${IMAGE_MODEL_NAME}: "${currentPromptValue}"`,
      );

      // --- Use ai.models.generateImages ---
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });
      // --- End generateImages call ---

      console.log("API Response:", response);

      // @ts-ignore
      for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          console.log("Image saved as gemini-native-image.png");
        }

        const mimeType = part?.inlineData?.mimeType;

        const base64Data = part?.inlineData?.data;
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        setImageUrl(dataUrl);
      }

      setStatus("Done!");
    } catch (err: any) {
      console.error("Error generating image:", err);
      // Attempt to parse specific API errors if possible
      const message = parseError(err);
      setError(`Error: ${message}`);
      setStatus("Failed");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]); // Dependencies: prompt and isLoading

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
            type="text"
            placeholder="Enter a prompt (e.g., 'astronaut riding a horse')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !API_KEY} // Also disable if no API key
          />
          <S.GenerateButton
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || !API_KEY}
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

        {!imageUrl &&
          !isLoading &&
          !error &&
          API_KEY && ( // Only show placeholder if API key exists
            <div style={{ marginTop: "50px", color: "#8892b0" }}>
              Enter a prompt to generate an image.
            </div>
          )}
        {!API_KEY && ( // Show API key error prominently if missing
          <S.ErrorMessage style={{ marginTop: "50px" }}>
            API Key is missing. Please configure REACT_APP_GOOGLE_API_KEY.
          </S.ErrorMessage>
        )}
      </motion.div>
    </S.OverlayContainer>
  );
};

// --- Updated Default Export ---
export default ImageGenerator;

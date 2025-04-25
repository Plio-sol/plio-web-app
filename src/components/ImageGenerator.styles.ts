// src/components/ImageGenerator.styles.ts
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const spin = keyframes`
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
`;

export const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 10%;
  background-color: rgba(10, 25, 47, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  z-index: 1000; // Ensure modals are above IconBar
  backdrop-filter: blur(5px);
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  color: #ccd6f6; // Added default color

  /* Mobile Styles */
  padding: 10px 10px 10px 10px; // Further reduced padding
  width: 90%; // Use slightly less width
  max-width: 90vw; // Use slightly less width
  max-height: 85vh; // Reduced max height

  /* Desktop Overrides */
  @media (min-width: 769px) {
      bottom: 0;
      top: 0;
    padding: 10px 20px 20px 20px; // Restore desktop padding
    width: 900px; /* Restore specific width */
  }

  & > * {
    position: relative;
    z-index: 1;
    width: 100%; // Make children take full width by default
  }
`;

export const CloseButton = styled(motion.button)`
  position: absolute;
  background: none;
  border: none;
  color: #ccd6f6; // Match text color
  cursor: pointer;
  line-height: 1;
  padding: 5px;
  z-index: 2;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  /* Mobile Styles */
  right: 45%;
  top: 0.2%;
  font-size: 2.1em; // Slightly smaller maybe

  /* Desktop Overrides */
  @media (min-width: 769px) {
    top: 15px;
    right: 45%;
    font-size: 2.5rem;
  }
`;

export const Title = styled.h2`
  color: #ccd6f6;
  font-weight: 600;
  text-align: center;
  width: 100%;
  padding-right: 25px; // Space for close button

  /* Mobile Styles */
  margin-bottom: 15px;
  font-size: 1.6em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 20px;
    font-size: 1.8em;
    padding-right: 30px;
  }
`;

export const PromptSection = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 15px auto; // Center and add margin
  flex-shrink: 0; // Prevent shrinking

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 20px;
  }
`;

export const PromptInput = styled.input`
  flex-grow: 1;
  border-radius: 6px;
  border: 1px solid #304a6d;
  background-color: #0a192f;
  color: #ccd6f6;
  outline: none;

  /* Mobile Styles */
  padding: 10px 12px;
  font-size: 0.95em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 10px 15px;
    font-size: 1em;
  }

  &:focus {
    border-color: #61dafb;
  }
`;

export const GenerateButton = styled(motion.button)`
  cursor: pointer;
  background-color: #50fa7b;
  color: #0a192f;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s ease;
  position: relative;
  flex-shrink: 0; // Prevent shrinking

  /* Mobile Styles */
  padding: 10px 15px;
  font-size: 0.95em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 10px 20px;
    font-size: 1em;
  }

  &:hover:not(:disabled) {
    background-color: #3ddc67;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.loading span {
    visibility: hidden;
  }
`;

export const ButtonSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(10, 25, 47, 0.3);
  border-left-color: #0a192f;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
`;

export const StatusDisplay = styled.div`
  text-align: center;
  color: #8892b0;
  min-height: 1.2em;
  margin-top: 5px;
  margin-bottom: 10px; // Reduced margin
  font-size: 0.9em; // Slightly smaller

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-bottom: 15px;
    font-size: 1em;
  }
`;

// Added HintText style definition
export const HintText = styled.p`
  color: #a8b2d1;
  max-width: 600px;
  text-align: center;
  flex-shrink: 0;
  margin: 0 auto 15px auto; // Center and add margin

  /* Mobile Styles */
  font-size: 0.85em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    font-size: 0.9em;
    margin-bottom: 20px; // Restore desktop margin
  }
`;

export const ImageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // Center content vertically if space allows
  gap: 15px;
  width: 100%;
  max-width: 512px;
  margin: 15px auto 0 auto; // Center and add margin
  flex-grow: 1; // Allow container to grow
  overflow-y: auto; // Allow scrolling *within* this container if image + button > space
  padding-bottom: 10px; // Padding at the bottom

  /* Desktop Overrides */
  @media (min-width: 769px) {
    margin-top: 20px;
  }

  img {
    display: block;
    max-width: 100%;
    max-height: 60vh;
    border-radius: 8px;
    border: 1px solid #304a6d;
    background-color: #0a192f;
    object-fit: contain; // Ensure whole image is visible
  }
`;

export const DownloadButton = styled.button`
  cursor: pointer;
  background-color: #61dafb;
  color: #0a192f;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  display: inline-flex; // Changed to inline-flex
  align-items: center;
  gap: 8px;
  margin-top: 10px; // Ensure space from image
  flex-shrink: 0; // Prevent shrinking

  /* Mobile Styles */
  padding: 8px 12px;
  font-size: 0.85em;

  /* Desktop Overrides */
  @media (min-width: 769px) {
    padding: 8px 15px;
    font-size: 0.9em;
  }

  &:hover {
    background-color: #4ac7e8;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff7b7b;
  text-align: center;
  font-size: 0.9em;
  margin-top: 10px;
  width: 100%; // Ensure it takes width for centering
  max-width: 600px; // Match prompt section width
  margin-left: auto;
  margin-right: auto;
`;

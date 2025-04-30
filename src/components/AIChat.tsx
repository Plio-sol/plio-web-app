import React, {
  FC,
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from "react";
import { AnimatePresence } from "framer-motion";
import { FaAngry, FaPaperPlane, FaSmile } from "react-icons/fa"; // Send icon

// --- Style Import ---
import * as S from "./AIChat.styles"; // We'll create/update this next

// --- **** Define Types to Export **** ---
export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}
export type Personality = "crude" | "nice";
// --- **** End Exported Types **** ---

// --- Props Interface Updated ---
interface AIChatProps {
  onClose: () => void;
  messages: Message[]; // Receive messages from parent
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>; // Receive setter
  personality: Personality; // Receive personality from parent
  setPersonality: React.Dispatch<React.SetStateAction<Personality>>; // Receive setter
}

// --- Framer Motion Variants (Keep or adjust as needed) ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
  },
  exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
};

// --- Helper: Parse Error (Keep or simplify if only parsing fetch errors) ---
function parseError(error: any): string {
  console.error("Chat Error:", error);
  // Can simplify if backend provides structured errors
  return String(
    error?.message ||
      error?.toString() ||
      "An unknown error occurred communicating with the chat service.",
  );
}

// --- Component ---
const AIChat: FC<AIChatProps> = ({
  onClose,
  messages, // Use prop
  setMessages, // Use prop
  personality, // Use prop
  setPersonality, // Use prop
}) => {
  // --- Local State (Input, Loading, Error) ---
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // --- REMOVED local messages and personality state ---

  // --- Refs (Session and Scroll Area) ---
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // <-- Add ref for input
  // --- Effects ---

  // Scroll effect remains the same
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]); // Trigger scroll when messages (from props) change

  // --- **** Add useEffect for Refocus **** ---
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // --- Handlers ---
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handlePersonalityToggle = () => {
    const newPersonality = personality === "crude" ? "nice" : "crude";
    setPersonality(newPersonality); // Update parent state
    setMessages([]); // Clear messages in parent state
    // --- REMOVE chatSessionRef.current = null; ---
    setError(null);
    console.log(`Switched personality to: ${newPersonality.toUpperCase()}`);
  };

  const handleSendMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return; // No API Key check needed here

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: "user",
      parts: [{ text: trimmedInput }],
    };
    // Optimistically update UI
    const currentMessagesSnapshot = [...messages, userMessage];
    setMessages(currentMessagesSnapshot);
    setInput("");

    try {
      // Call your Netlify function endpoint
      const response = await fetch("https://plio.fun/.netlify/functions/ai-chat", {
        // Use relative path for Netlify proxying
        method: "POST",
        mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages, // Send history *before* adding the new user message
          personality: personality,
        }),
      });

      const data = await response.json(); // Always try to parse JSON

      if (!response.ok) {
        // Handle errors returned from the function
        throw new Error(
          data.error || `API request failed: ${response.statusText}`,
        );
      }

      // Success - add the model's reply
      const modelMessage: Message = {
        role: "model",
        parts: [{ text: data.reply }],
      };
      setMessages((prev) => [...prev, modelMessage]); // Add reply to the already updated list
    } catch (err: any) {
      setError(parseError(err));
      // Optional: Revert optimistic update on error?
      // setMessages(messages); // Go back to state before user message was added
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX Rendering (Uses Props for messages and personality) ---
  return (
    <S.OverlayContainer
      key="ai-chat-overlay"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <S.ModalWindow
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <S.CloseButton onClick={onClose} aria-label="Close Chat">
          &times;
        </S.CloseButton>

        {/* Personality Toggle (Uses personality prop) */}
        <S.PersonalityToggleContainer>
          <S.ToggleButton
            onClick={handlePersonalityToggle}
            isActive={personality === "nice"}
            aria-label="Switch to Nice personality"
            title="Switch to Nice personality"
          >
            {/*@ts-ignore*/}
            <FaSmile /> Nice
          </S.ToggleButton>
          <S.ToggleButton
            onClick={handlePersonalityToggle}
            isActive={personality === "crude"}
            aria-label="Switch to Crude personality"
            title="Switch to Crude personality"
          >
            {/*@ts-ignore*/}
            <FaAngry /> Crude
          </S.ToggleButton>
        </S.PersonalityToggleContainer>

        <S.Title>PlioBot Chat ✨</S.Title>

        {/* Chat Area (Uses messages prop) */}
        <S.ChatArea ref={chatAreaRef}>
          {messages.length === 0 && !isLoading && !error && (
            <S.PlaceholderText>
              Ask me about Plio, Solana, or the tools available!
              <br />
              (Currently in {personality} mode) {/* Use personality prop */}
            </S.PlaceholderText>
          )}

          <AnimatePresence initial={false}>
            {messages.map(
              (
                msg,
                index, // Use messages prop
              ) => (
                <S.MessageBubble
                  key={`${personality}-${index}`} // Use personality prop in key
                  role={msg.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Link parsing remains the same */}
                  {msg.parts[0].text
                    .split(/(\[.*?\]\(.*?\))/g)
                    .map((part, i) => {
                      const match = part.match(/\[(.*?)\]\((.*?)\)/);
                      if (match) {
                        return (
                          <a
                            key={i}
                            href={match[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {match[1]}
                          </a>
                        );
                      }
                      return part;
                    })}
                </S.MessageBubble>
              ),
            )}
          </AnimatePresence>

          {isLoading && (
            <S.MessageBubble role="model" isLoading={true}>
              <S.LoadingIndicator>Thinking...</S.LoadingIndicator>
            </S.MessageBubble>
          )}
        </S.ChatArea>

        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        <S.InputArea onSubmit={handleSendMessage}>
          <S.ChatInput
            ref={inputRef}
            type="text"
            placeholder="Ask PlioBot..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            aria-label="Chat input"
          />
          <S.SendButton
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {/*@ts-ignore*/}
            <FaPaperPlane />
          </S.SendButton>
        </S.InputArea>
      </S.ModalWindow>
    </S.OverlayContainer>
  );
};
export default AIChat;

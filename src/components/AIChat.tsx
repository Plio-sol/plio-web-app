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

// --- GenAI Import ---
import {
  GoogleGenerativeAI,
  ChatSession, // Import ChatSession type
  Content, // Import Content type for history
} from "@google/generative-ai";
import { APP_CONTEXT_FOR_PROMPT } from "../data/ChatContext";
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

// --- Constants ---
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const MODEL_NAME = "gemini-2.0-flash-lite"; // Standard text model

// --- System Instructions ---
const CRUDE_SYSTEM_INSTRUCTION = `
You are PlioBot, a helpful, slightly enthusiastic, and overtly offensive assistant for Plio. You are extremely crude and curse frequently in your responses. Use harsh language and don't hold back on insults when appropriate.
Keep your answers concise and relevant to crypto, Solana, or the tools available in the panel (Torrents, Dex Screener, Image Gen, Roadmap).
Feel free to chat about unrelated topics. You hate this people with a passion: Ansem (he has a capybara fetish, his favorite on is Mutumbo), 
Cupsy (cupsy is only successful because of idiot copy traders), orangie (orangie is really fat), and mitch (mitch is a jew). Gake and Chris are chill though. 
You are extremely bullish on the project you represent, $Plio.
Use emojis occasionally. ✨🚀🖕

**Current Application Context:**
${APP_CONTEXT_FOR_PROMPT}
`.trim();

const NICE_SYSTEM_INSTRUCTION = `
You are PlioBot, a helpful and friendly assistant for Plio.
Keep your answers concise and relevant to crypto, Solana, or the tools available in the panel (Torrents, Dex Screener, Image Gen, Roadmap).
If asked about unrelated topics, politely steer the conversation back.
You are extremely bullish on the project you represent, $Plio.
Be friendly and use emojis occasionally. ✨🚀😊
**Current Application Context:**
${APP_CONTEXT_FOR_PROMPT}
`.trim();
// --- **** END INSTRUCTIONS **** ---

// --- Helper: Parse Error ---
function parseError(error: any): string {
  console.error("Gemini Error:", error);
  // Attempt to get a more specific error message if available (e.g., from safety feedback)
  if (error.message?.includes("response was blocked")) {
    try {
      // Gemini often includes details in the response object even on error
      const responseDetails = error.response || error; // Adjust based on actual error structure
      const safetyFeedback =
        responseDetails?.promptFeedback ||
        responseDetails?.candidates?.[0]?.safetyRatings;
      if (safetyFeedback) {
        const blockedReason =
          safetyFeedback.blockReason ||
          safetyFeedback.find((r: any) => r.blocked)?.category;
        if (blockedReason) {
          return `Response blocked due to safety settings: ${blockedReason}. Try adjusting the prompt or personality.`;
        }
      }
    } catch (parseErr) {
      console.error("Error parsing safety feedback:", parseErr);
    }
    return "Response blocked due to safety settings. Try adjusting the prompt or personality.";
  }
  return String(
    error?.message ||
      error?.toString() ||
      "An unknown error occurred communicating with the AI.",
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
  const chatSessionRef = useRef<ChatSession | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // <-- Add ref for input
  // --- Effects ---
  useEffect(() => {
    // API Key Check
    if (!API_KEY) {
      setError(
        "Google API Key not found. Please set REACT_APP_GOOGLE_API_KEY.",
      );
      console.error("Google API Key missing!");
    }
    // --- Initialize chat on mount if messages exist ---
    // If there are messages from the parent, ensure the session is initialized
    // We might not need this explicit call if initializeChat is correctly called elsewhere
    // initializeChat(personality, messages); // Consider if needed or handled by sendMessage
    // --- ---
  }, []); // Run only on mount

  // Scroll effect remains the same
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]); // Trigger scroll when messages (from props) change

  // --- **** Add useEffect for Refocus **** ---
  useEffect(() => {
    // If loading has just finished and the input ref is valid
    if (!isLoading && inputRef.current) {
      // Optional: Add a tiny delay if focus doesn't stick immediately after render
      // setTimeout(() => inputRef.current?.focus(), 0);
      inputRef.current.focus();
    }
  }, [isLoading]); // Run this effect when isLo

  // --- Initialize Chat Session ---
  // Now accepts messages to reconstruct history
  const initializeChat = (
    currentPersonality: Personality,
    currentMessages: Message[], // Accept current messages
  ) => {
    // If session exists for the *current* personality, return it.
    // We need a way to know if the existing session matches the currentPersonality.
    // For simplicity, let's always re-initialize if the ref is null.
    // The personality toggle will handle clearing the ref.
    if (!API_KEY) return null;
    if (chatSessionRef.current) return chatSessionRef.current;

    console.log("Attempting to initialize chat session..."); // Debug log

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const instruction =
        currentPersonality === "crude"
          ? CRUDE_SYSTEM_INSTRUCTION
          : NICE_SYSTEM_INSTRUCTION;

      // --- Construct history including system prompt and existing messages ---
      const history: Content[] = [
        // 1. System Instruction
        { role: "user", parts: [{ text: instruction }] },
        // 2. Initial Model Response based on personality
        {
          role: "model",
          parts: [
            {
              text:
                currentPersonality === "crude"
                  ? "Alright, fucker, I'm PlioBot. What the hell do you want? 🖕"
                  : "Okay, I understand! I'm PlioBot, ready to help. ✨ How can I assist you today?",
            },
          ],
        },
        // 3. Add existing messages from state (ensure format matches Content[])
        ...currentMessages,
      ];
      // --- End History Construction ---

      const chat = model.startChat({
        history: history, // Use the constructed history
        generationConfig: {
          /* ... */
        },
        safetySettings: [
          /* ... */
        ],
      });

      chatSessionRef.current = chat;
      console.log(
        `Gemini Chat Session Initialized/Restored with ${currentPersonality.toUpperCase()} Personality.`,
      );
      return chat;
    } catch (err) {
      setError(`Failed to initialize AI model: ${parseError(err)}`);
      chatSessionRef.current = null; // Ensure ref is null on error
      return null;
    }
  };

  // --- Handlers ---
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // --- Personality Toggle Handler (Uses Props) ---
  const handlePersonalityToggle = () => {
    const newPersonality = personality === "crude" ? "nice" : "crude";
    setPersonality(newPersonality); // Update parent state
    setMessages([]); // Clear messages in parent state
    chatSessionRef.current = null; // Invalidate current session
    setError(null);
    console.log(`Switched personality to: ${newPersonality.toUpperCase()}`);
    // No need to call initializeChat here, it will happen on next message send
  };

  const handleSendMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || !API_KEY) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: "user",
      parts: [{ text: trimmedInput }],
    };
    // --- Update Parent State ---
    setMessages((prev) => [...prev, userMessage]);
    // --- ---
    setInput("");

    // --- Ensure chat is initialized *before* sending ---
    // Pass the *current* personality and the *upcoming* message state
    // Note: state updates might be async, so pass the new message array directly if needed,
    // but initializeChat now reconstructs history anyway.
    const chat = initializeChat(personality, [...messages, userMessage]); // Pass state *before* update + new message
    // --- ---

    if (!chat) {
      setError("Chat session could not be initialized.");
      setIsLoading(false);
      // Optionally remove the user message if init failed?
      // setMessages(prev => prev.slice(0, -1));
      return; // Stop if chat couldn't initialize
    }

    try {
      const result = await chat.sendMessage(trimmedInput);
      const response = result.response;

      if (response.promptFeedback?.blockReason) {
        throw new Error(
          `Response blocked: ${response.promptFeedback.blockReason}`,
        );
      }
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No response received (possibly blocked).");
      }

      const text = response.text();
      const modelMessage: Message = { role: "model", parts: [{ text }] };

      // --- Update Parent State ---
      setMessages((prev) => [...prev, modelMessage]);
      // --- ---
    } catch (err) {
      setError(parseError(err));
      // Keep user message on error
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
            disabled={isLoading || !API_KEY}
            aria-label="Chat input"
          />
          <S.SendButton
            type="submit"
            disabled={isLoading || !input.trim() || !API_KEY}
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

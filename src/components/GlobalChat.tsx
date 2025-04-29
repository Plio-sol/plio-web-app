// src/components/GlobalChat.tsx
import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import * as S from "./GlobalChat.styles"; // Assuming styles are already created
import { AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { FaPaperPlane, FaRobot } from "react-icons/fa";

// --- Firebase Imports ---
import { db } from "../firebase"; // Import db instance from your firebase.ts
import {
  collection,
  addDoc,
  serverTimestamp, // Use server timestamp for consistency
  query,
  orderBy,
  limit,
  onSnapshot, // Real-time listener
  doc,
  setDoc, // For setting/updating user profile
  getDoc, // For fetching user profile
  Timestamp as FirestoreTimestamp, // Rename to avoid conflict with native Timestamp
} from "firebase/firestore";

// --- Types ---
interface GlobalChatProps {
  onClose: () => void;
}

// Update ChatMessage type to use FirestoreTimestamp
interface ChatMessage {
  id: string; // Firestore document ID
  text: string;
  senderWallet: string;
  senderName: string;
  timestamp: FirestoreTimestamp | null; // Firestore timestamp object
  isBot?: boolean;
}

// Interface for expected success response FROM the Netlify function
interface CallBotResult {
  success: boolean;
  message?: string; // Optional message from function (e.g., error details)
}


// --- Animation Variants ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};
const nameInputVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginBottom: 15,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.3 },
  },
};
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// --- Constants ---
const MESSAGES_COLLECTION = "globalChatMessages";
const PROFILES_COLLECTION = "userProfiles";
const MESSAGE_LOAD_LIMIT = 50; // Load last 50 messages initially
const NETLIFY_BOT_FUNCTION_ENDPOINT = "/.netlify/functions/call-plio-bot"; // Define Netlify endpoint
const ANONYMOUS_WALLET_ID = "ANONYMOUS"; // Identifier for anonymous users
const DEFAULT_ANON_NAME = "Anon"; // Default name for anonymous users

// --- Component ---
const GlobalChat: FC<GlobalChatProps> = ({ onClose }) => {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [displayName, setDisplayName] = useState<string>("");
  const [tempDisplayName, setTempDisplayName] = useState<string>("");
  const [isSettingName, setIsSettingName] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // <-- Add ref for input

  const walletAddress = publicKey?.toBase58();

  // --- Unconditional Scroll (Always scrolls to bottom) ---
  const forceScrollToBottom = useCallback(() => {
    if (messageListRef.current) {
      // Directly set scroll top to the maximum scroll height
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, []); // No dependencies needed
  // --- Setup Effect ---
  useEffect(() => {
    // Wallet connection check
    // if (!walletAddress) {
    //   setError("Please connect your wallet.");
    //   setIsLoading(false);
    //   return;
    // }

    // Reset state for setup
    setError(null);
    setIsLoading(true);
    setMessages([]);

    let unsubscribeMessages: () => void = () => {};


    const setupChat = async () => {
      try {
        // 1. Fetch User Profile ONLY if wallet is connected
        let currentName = DEFAULT_ANON_NAME; // Default to Anon
        if (walletAddress) {
          try {
            const profileDocRef = doc(db, PROFILES_COLLECTION, walletAddress);
            const profileSnap = await getDoc(profileDocRef);
            if (profileSnap.exists()) {
              currentName = profileSnap.data().displayName;
            } else {
              currentName = walletAddress.substring(0, 6); // Fallback for connected user without profile
            }
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError);
            // Keep currentName as the fallback (short wallet address) if profile fetch fails
            currentName = walletAddress.substring(0, 6);
          }
        }
        setDisplayName(currentName);
        setTempDisplayName(currentName); // Initialize temp name for editing if connected

        // 2. Setup Messages Listener (This part works without wallet)
        const messagesQuery = query(
            collection(db, MESSAGES_COLLECTION),
            orderBy("timestamp", "desc"), // Get latest first
            limit(MESSAGE_LOAD_LIMIT)
        );

        unsubscribeMessages = onSnapshot(
            messagesQuery,
            (querySnapshot) => {
              const fetchedMessages: ChatMessage[] = [];
              querySnapshot.forEach((doc) => {
                // Ensure timestamp exists before pushing
                if (doc.data().timestamp) {
                  fetchedMessages.push({
                    id: doc.id,
                    ...doc.data(),
                  } as ChatMessage);
                } else {
                  console.warn("Message missing timestamp:", doc.id, doc.data());
                }
              });
              setMessages(fetchedMessages.reverse()); // Set the fetched messages
              setIsLoading(false); // Loading complete after first fetch
              setTimeout(forceScrollToBottom, 50);
            },
            (err) => {
              console.error("Error fetching chat messages:", err);
              setError("Could not load chat messages. Please try again later.");
              setIsLoading(false);
            }
        );
      } catch (err) {
        console.error("Error setting up chat:", err);
        setError("Failed to initialize chat.");
        setIsLoading(false);
      }
    };

    setupChat();

    // Cleanup listener on unmount
    return () => {
      unsubscribeMessages();
      console.log("Chat listener unsubscribed.");
    };
  }, [walletAddress, forceScrollToBottom]); // Dependencies

  // --- Handle Sending Message ---
  const handleSendMessage = async () => {
    if (!newMessage.trim()  || isSending) return;

    setIsSending(true);

    // Determine sender info based on wallet connection
    const senderWalletForDb = walletAddress || ANONYMOUS_WALLET_ID;
    const senderNameForDb = walletAddress
        ? displayName // Use profile/fallback name if connected
        : DEFAULT_ANON_NAME; // Use 'Anon' if not connected

    const messageData = {
      text: newMessage.trim(),
      senderWallet: senderWalletForDb,
      senderName: senderNameForDb,
      timestamp: serverTimestamp(),
      isBot: false,
    };

    try {
      await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
      setNewMessage(""); // Clear input on success
      // Real-time listener (onSnapshot) will handle adding the message to state

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  // --- Handle Setting Display Name ---
  const handleSetDisplayName = async () => {
    if (!walletAddress) return;
    if (!tempDisplayName.trim() || !walletAddress) {
      toast.error("Display name cannot be empty.");
      return;
    }
    const newName = tempDisplayName.trim();
    if (newName === displayName) {
      setIsSettingName(false);
      return;
    }
    if (newName.length > 30) {
      toast.error("Display name too long (max 30 characters).");
      return;
    }

    const profileDocRef = doc(db, PROFILES_COLLECTION, walletAddress);

    try {
      await setDoc(
          profileDocRef,
          {
            displayName: newName,
            lastUpdated: serverTimestamp(),
          },
          { merge: true } // Create or update
      );

      setDisplayName(newName); // Update local state
      setIsSettingName(false); // Hide input
      toast.success("Display name updated!");
    } catch (err) {
      console.error("Error setting display name:", err);
      toast.error("Failed to update display name.");
    }
  };

  const handleCallBot = async () => {
    if ( isSending) return; // Prevent call if no wallet or already sending/calling

    setIsSending(true); // Use isSending to disable buttons during bot call
    toast.loading("Plio Bot is thinking...", { id: "bot-loading" });

    try {
      // 1. Prepare the context from recent messages
      const contextMessages = messages
          .slice(-10) // Get the last 10 messages as context
          .map(msg => `${msg.senderName || 'Anon'}: ${msg.text}`) // Format as "Sender: Text"
          .join("\n"); // Join messages with newlines

      console.log("Sending context to bot:", contextMessages); // Log for debugging

      // 2. Call the Netlify function using fetch
      const response = await fetch(NETLIFY_BOT_FUNCTION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: contextMessages,
          senderWallet: walletAddress, // Pass wallet address
        }),
      });

      // 3. Process the response
      const result: CallBotResult = await response.json(); // Parse the JSON response
      console.log("Bot function result:", result); // Log the raw result

      toast.dismiss("bot-loading"); // Dismiss loading toast regardless of outcome below

      // Check if the HTTP request itself failed OR if the function reported failure
      if (!response.ok || !result.success) {
        // Construct a meaningful error message
        const errorMessage = result?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Success: The bot's message should appear via the onSnapshot listener.
      // No need to add the message manually here.
      // toast.success("Bot responded!"); // Optional success toast

    } catch (err: any) {
      // Handle errors during the fetch call or from the function's failure response
      console.error("Error calling bot function:", err);
      toast.dismiss("bot-loading"); // Ensure loading toast is dismissed on error
      toast.error(`Plio Bot error: ${err.message || "Could not reach the bot."}`);
    } finally {
      // Re-enable buttons regardless of success/failure
      setIsSending(false);
    }
  };

  // --- Render ---
  return (
      <S.OverlayContainer
          key="globalchat-overlay"
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

          <S.HeaderContainer>
            <S.Title>Global Holder Chat</S.Title>
            {!isSettingName && walletAddress && (
                <S.SetNameButton onClick={() => setIsSettingName(true)}>
                  {displayName ? `Name: ${displayName}` : "Set Name"}
                </S.SetNameButton>
            )}
          </S.HeaderContainer>

          <AnimatePresence>
            {isSettingName && (
                <S.NameInputContainer
                    key="name-input"
                    variants={nameInputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                  <S.NameInput
                      type="text"
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      placeholder="Enter display name (max 30)"
                      maxLength={30}
                  />
                  <S.SaveNameButton onClick={handleSetDisplayName}>
                    Save
                  </S.SaveNameButton>
                  <S.SetNameButton onClick={() => setIsSettingName(false)}>
                    Cancel
                  </S.SetNameButton>
                </S.NameInputContainer>
            )}
          </AnimatePresence>

          <S.MessageListContainer ref={messageListRef}>
            {/* Loading State */}
            {isLoading && (
                <S.LoadingContainer>
                  <S.LoadingSpinner // Use S. prefix for consistency
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </S.LoadingContainer>
            )}

            {/* Error State */}
            {!isLoading && error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            {/* Empty State */}
            {!isLoading && !error && messages.length === 0 && (
                <S.ErrorMessage>
                  No messages yet. Start the conversation!
                </S.ErrorMessage>
            )}

            {/* Messages */}
            {!isLoading && !error && messages.length > 0 && (
                // No AnimatePresence needed here if layout prop handles additions well
                <>
                  {messages.map((msg) => {
                    // Define variables needed for this message item
                    const isSender = msg.senderWallet === walletAddress;
                    const messageDate = msg.timestamp?.toDate(); // Convert to JS Date
                    const displayTime = messageDate
                        ? messageDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : ""; // Handle case where timestamp might be null briefly

                    // *** CORRECTED RETURN BLOCK FOR EACH MESSAGE ***
                    return (
                        <S.MessageItem
                            key={msg.id} // Use Firestore doc ID as key
                            issender={isSender} // Pass prop
                            isbot={msg.isBot} // Pass prop
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            layout // Enable layout animation for smooth additions
                        >
                          <S.SenderName
                              issender={isSender} // Pass prop
                              isbot={msg.isBot} // Pass prop
                          >
                            {msg.senderName || "Anon"} {/* Fallback name */}
                          </S.SenderName>
                          <S.MessageBubble
                              issender={isSender} // Pass prop
                              isbot={msg.isBot} // Pass prop
                          >
                            {msg.text}
                          </S.MessageBubble>
                          {displayTime && <S.Timestamp>{displayTime}</S.Timestamp>}
                        </S.MessageItem>
                    );
                    // *** END CORRECTED RETURN BLOCK ***
                  })}
                </>
            )}
          </S.MessageListContainer>

          <S.InputArea>
            <S.MessageInput
                  ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                // Use standard React event type
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewMessage(e.target.value)
                }
                // Use standard React event type
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && !isSending && handleSendMessage()
                }
                disabled={
                    isSending || isLoading || !!error //|| !walletAddress
                }
            />
            <S.BotButton
                onClick={handleCallBot}
                disabled={
                    isSending || isLoading || !!error//|| !walletAddress
                }
                title="Call Plio Bot"
            >
              <FaRobot />
            </S.BotButton>
            <S.SendButton
                onClick={handleSendMessage}
                disabled={
                    isSending ||
                    isLoading ||
                    !!error ||
                    !newMessage.trim()  // Disable if message is empty
                   // !walletAddress
                }
                title="Send Message"
            >
              <FaPaperPlane />
            </S.SendButton>
          </S.InputArea>
        </S.ModalWindow>
      </S.OverlayContainer>
  );
};

export default GlobalChat;
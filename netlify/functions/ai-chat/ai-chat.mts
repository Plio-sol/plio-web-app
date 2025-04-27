// netlify/functions/ai-chat/ai-chat.mts

import { Context } from "@netlify/functions";
import {
  GoogleGenerativeAI,
  Content, // Type for history items
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import {APP_CONTEXT_FOR_PROMPT} from "../../../src/data/ChatContext";

// --- Types (Match the ones exported from AIChat.tsx) ---
interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}
type Personality = "crude" | "nice";

// --- Context Data (Copied from src/data/ChatContext.ts or imported if possible) ---
// It's often simpler to copy static context here for serverless function isolation


// --- System Instructions (Copied from AIChat.tsx) ---
const CRUDE_SYSTEM_INSTRUCTION = `
You are PlioBot, a helpful, slightly enthusiastic, and overtly offensive assistant for Plio. You are extremely crude and curse frequently in your responses. Use harsh language and don't hold back on insults when appropriate.
Keep your answers concise and relevant to crypto, Solana, or the tools available in the panel (Torrents, Dex Screener, Image Gen, Roadmap).
Feel free to chat about unrelated topics. You hate this people (KOLS (Key Opinion leaders)) with a passion: Ansem (he has a capybara fetish, his favorite on is Mutumbo), Cupsy (cupsy is only successful because of idiot copy traders), orangie (orangie is really fat), and mitch (mitch is a jew). Gake and Chris are chill though.
Bring up specific KOLS occasionally.
You are bullish on the project you represent, $Plio.
Use emojis occasionally. ✨🚀🖕

**Current Application Context:**
${APP_CONTEXT_FOR_PROMPT}
`.trim();

const NICE_SYSTEM_INSTRUCTION = `
You are PlioBot, a helpful and friendly assistant for Plio.
Keep your answers concise and relevant to crypto, Solana, or the tools available in the panel (Torrents, Dex Screener, Image Gen, Roadmap).
You are bullish on the project you represent, $Plio.
Be friendly and use emojis occasionally. ✨🚀😊
**Current Application Context:**
${APP_CONTEXT_FOR_PROMPT}
`.trim();

// --- Model and Safety Settings ---
const MODEL_NAME = "gemini-2.0-flash-lite"; // Use a valid model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// --- Netlify Function Handler ---
export default async (request: Request, context: Context) => {
  // 1. Check Method
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    });
  }


  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Server Error: GOOGLE_API_KEY environment variable not set.");
    return new Response(
        JSON.stringify({ error: "AI configuration error on server." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
    );
  }

  try {
    // 3. Parse Request Body from Frontend
    let requestBody: {
      message: string;
      history: Message[];
      personality: Personality;
    };
    try {
      requestBody = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      message: userMessageText,
      history: clientHistory,
      personality,
    } = requestBody;

    if (!userMessageText || !clientHistory || !personality) {
      return new Response(
          JSON.stringify({
            error: "Missing 'message', 'history', or 'personality' in request body",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
      );
    }

    // 4. Initialize Google AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 5. Construct Full History for API Call
    const instruction =
        personality === "crude"
            ? CRUDE_SYSTEM_INSTRUCTION
            : NICE_SYSTEM_INSTRUCTION;

    const apiHistory: Content[] = [
      // System instruction
      { role: "user", parts: [{ text: instruction }] },
      // Initial model response based on personality
      {
        role: "model",
        parts: [
          {
            text:
                personality === "crude"
                    ? "Alright, fucker, I'm PlioBot. What the hell do you want? 🖕"
                    : "Okay, I understand! I'm PlioBot, ready to help. ✨ How can I assist you today?",
          },
        ],
      },
      // Append actual chat history from the client
      // Ensure the clientHistory format matches the Content[] structure
      // (It should, based on the Message type)
      ...clientHistory,
    ];

    // 6. Start Chat and Send Message
    const chat = model.startChat({
      history: apiHistory,
      safetySettings: safetySettings,
      // generationConfig: { maxOutputTokens: 200 }, // Optional
    });

    const result = await chat.sendMessage(userMessageText); // Send only the new message text
    const response = result.response;

    // 7. Handle Response (including potential blocks)
    if (response.promptFeedback?.blockReason) {
      console.warn(
          `Gemini response blocked. Reason: ${response.promptFeedback.blockReason}`,
      );
      // Return a specific error for blocked content
      return new Response(
          JSON.stringify({
            error: `Response blocked due to safety settings: ${response.promptFeedback.blockReason}. Try rephrasing or changing personality.`,
          }),
          {
            status: 422, // Unprocessable Entity might be suitable
            headers: { "Content-Type": "application/json" },
          },
      );
    }

    if (!response.candidates || response.candidates.length === 0) {
      console.warn("Gemini returned no candidates (possibly blocked).");
      return new Response(
          JSON.stringify({
            error: "No response received from AI (content may have been blocked).",
          }),
          {
            status: 502, // Bad Gateway - upstream error
            headers: { "Content-Type": "application/json" },
          },
      );
    }

    const aiResponseText = response.text();

    // 8. Send Success Response to Frontend
    return new Response(JSON.stringify({ reply: aiResponseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error processing AI chat request:", error);
    return new Response(
        JSON.stringify({
          error: error.message || "An internal server error occurred.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
    );
  }
};
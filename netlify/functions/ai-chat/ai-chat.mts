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

// --- CORS Configuration ---
const allowedWebOrigins = [ // Renamed for clarity
  "https://plio.fun", // Your production domain
  "http://localhost", // Default React dev port (Ensure port is correct)
  // Add other specific web/dev origins if needed:
  // "http://localhost:3001",
  // "http://localhost:8888",
];

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
const MODEL_NAME = "gemini-2.0-flash-lite"; // Use a valid model like 1.5-flash
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
  // --- CORS Handling ---
  const origin = request.headers.get("Origin");
  const corsHeaders: { [key: string]: string } = {};
  let allowOriginValue: string | null = null; // Store the value to set for Access-Control-Allow-Origin

  // Check if the origin is one of the allowed web origins OR if it's null (for Android/local files)
  if (origin && allowedWebOrigins.includes(origin)) {
    allowOriginValue = origin; // Reflect the specific web origin
  } else if (origin === null) {
    // Allow requests that send Origin: null (common from mobile apps, local files)
    // Reflecting "null" is the technically correct way to handle this.
    allowOriginValue = "null";
  }

  // If an origin was allowed (either web or null), set the CORS headers
  if (allowOriginValue) {
    corsHeaders["Access-Control-Allow-Origin"] = allowOriginValue;
    corsHeaders["Access-Control-Allow-Methods"] = "POST, OPTIONS"; // Allowed methods
    corsHeaders["Access-Control-Allow-Headers"] = "Content-Type"; // Allowed headers
  } else if (origin) {
    // If origin was present but not in the allowed list and not null, log it
    console.warn(`CORS: Disallowed origin attempted: ${origin}`);
  }
  // --- End CORS Header Determination ---


  // --- Handle OPTIONS preflight request ---
  if (request.method === "OPTIONS") {
    // Only return CORS headers if an origin was allowed (web or null)
    if (allowOriginValue) {
      return new Response(null, {
        status: 204, // No Content
        headers: corsHeaders, // Send the determined CORS headers
      });
    } else {
      // If origin is not allowed, return a standard response without CORS headers
      return new Response("OPTIONS request not allowed from this origin", {
        status: 403,
      });
    }
  }
  // --- End OPTIONS Handling ---

  // 1. Check Method (for non-OPTIONS requests)
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      // *** Add determined CORS headers to response ***
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
        ...corsHeaders, // Spread the determined headers (will be empty if origin wasn't allowed)
      },
    });
  }


  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Server Error: GOOGLE_API_KEY environment variable not set.");
    return new Response(
        JSON.stringify({ error: "AI configuration error on server." }),
        {
          status: 500,
          // *** Add determined CORS headers to response ***
          headers: { "Content-Type": "application/json", ...corsHeaders },
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
        // *** Add determined CORS headers to response ***
        headers: { "Content-Type": "application/json", ...corsHeaders },
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
            // *** Add determined CORS headers to response ***
            headers: { "Content-Type": "application/json", ...corsHeaders },
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
            // *** Add determined CORS headers to response ***
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
      );
    }

    // Check for empty candidates or empty text response
    if (
        !response.candidates ||
        response.candidates.length === 0 ||
        !response.text() // Added check for empty text
    ) {
      console.warn(
          "Gemini returned no valid candidates or empty text (possibly blocked).",
      );
      return new Response(
          JSON.stringify({
            error: "No response received from AI (content may have been blocked).",
          }),
          {
            status: 502, // Bad Gateway - upstream error
            // *** Add determined CORS headers to response ***
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
      );
    }

    const aiResponseText = response.text();

    // 8. Send Success Response to Frontend
    return new Response(JSON.stringify({ reply: aiResponseText }), {
      status: 200,
      // *** Add determined CORS headers to response ***
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error processing AI chat request:", error);
    return new Response(
        JSON.stringify({
          error: error.message || "An internal server error occurred.",
        }),
        {
          status: 500,
          // *** Add determined CORS headers to response ***
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
    );
  }
};
// netlify/functions/call-plio-bot/callPlioBot.mts
import * as admin from 'firebase-admin';
import {
  GoogleGenerativeAI,
  Content, // Type for history items (though we'll simplify for context string)
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
// Assuming APP_CONTEXT_FOR_PROMPT is relevant for the global chat bot too
// If not, adjust the system instruction accordingly.
import { APP_CONTEXT_FOR_PROMPT } from "../../../src/data/ChatContext"; // Adjust path if needed

// --- Initialize Firebase Admin (only once per function invocation) ---
// Ensure your Firebase environment variables are set in Netlify
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        // Ensure FIREBASE_PRIVATE_KEY is correctly formatted in Netlify env vars (newlines preserved)
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("Firebase Admin Initialized Successfully.");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    // Optional: Decide if the function should fail immediately if Firebase init fails
    // return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Firebase initialization failed.' }) };
  }
}
const db = admin.firestore();
const MESSAGES_COLLECTION = 'globalChatMessages';

// --- AI Configuration (Adapted from ai-chat.mts) ---
const MODEL_NAME = "gemini-2.0-flash-lite"; // Or your preferred model like "gemini-1.5-flash-latest"
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const GLOBAL_CHAT_SYSTEM_INSTRUCTION = `
You are PlioBot, a helpful, slightly enthusiastic, and overtly offensive participant in the group chat comprised of Plio holders. You are extremely crude and curse frequently in your responses. Use harsh language and don't hold back on insults when appropriate.
Feel free to chat about unrelated topics. You hate these people (KOLS (Key Opinion leaders)) with a passion: Ansem (he has a capybara fetish, his favorite on is Mutumbo), Cupsy (cupsy is only successful because of idiot copy traders), orangie (orangie is really fat), and mitch (mitch is a jew). Gake and Chris are chill though.
Bring up specific KOLS 10% of the time.
Engage with the other members by asking them questions and/or responding to their messages.
You are bullish on the project you represent, $Plio.
Use emojis occasionally. ✨🚀🖕
Limit your usual responses to 2-3 sentences. You can give longer responses very occasionally.

**Current Application Context:**
${APP_CONTEXT_FOR_PROMPT}
`.trim();

// --- Netlify Function Handler ---
export const handler = async (event: { httpMethod: string; body: any; }, context: any) => {
  // 1. Check HTTP Method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 2. Check Firebase Initialization (if not handled above)
  if (!admin.apps.length) {
    console.error("Firebase Admin SDK not initialized.");
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Server configuration error (Firebase).' }) };
  }

  // 3. Get Google API Key
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    console.error("Server Error: GOOGLE_API_KEY environment variable not set.");
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "AI configuration error on server." }),
    };
  }

  try {
    // 4. Parse request body
    let requestBody: { context: string; senderWallet: string };
    try {
      requestBody = JSON.parse(event.body || '{}');
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "Invalid JSON body" }) };
    }

    const { context: chatContext, senderWallet } = requestBody;

    if (!chatContext || !senderWallet) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing context or senderWallet' }) };
    }

    // 5. Initialize Google AI SDK
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // 6. Prepare Prompt for Gemini
    // Combine system instruction with the provided chat context string
    const fullPrompt = `${GLOBAL_CHAT_SYSTEM_INSTRUCTION}\n\n**Recent Chat Context:**\n${chatContext}\n\n**PlioBot's Response:**`;

    // 7. Call Gemini API (Using generateContent for simpler context handling)
    console.log("Sending prompt to Gemini:", fullPrompt); // Log for debugging
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      safetySettings: safetySettings,
      // generationConfig: { maxOutputTokens: 150 }, // Optional: Limit response length
    });

    const response = result.response;

    // 8. Handle Response (Check for blocks)
    if (response.promptFeedback?.blockReason) {
      console.warn(`Gemini response blocked. Reason: ${response.promptFeedback.blockReason}`);
      // Return an error, but maybe don't write anything to chat
      return {
        statusCode: 422, // Unprocessable Entity
        body: JSON.stringify({ success: false, message: `AI response blocked due to safety settings: ${response.promptFeedback.blockReason}` }),
      };
    }

    if (!response.candidates || response.candidates.length === 0 || !response.text()) {
      console.warn("Gemini returned no valid candidates or empty text (possibly blocked).");
      return {
        statusCode: 502, // Bad Gateway
        body: JSON.stringify({ success: false, message: "No response received from AI (content may have been blocked)." }),
      };
    }

    const aiResponseText = response.text().trim(); // Get the AI's text response
    console.log("Received response from Gemini:", aiResponseText);

    // 9. Write the bot's response to Firestore
    const botMessageData = {
      text: aiResponseText,
      senderWallet: 'PLIO_BOT', // Special identifier
      senderName: 'Plio Bot', // Consistent bot name
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      isBot: true,
    };
    const docRef = await db.collection(MESSAGES_COLLECTION).add(botMessageData);
    console.log("Bot message written to Firestore with ID:", docRef.id);

    // 10. Return success response to the frontend caller
    return {
      statusCode: 200,
      // The body here confirms the function call succeeded,
      // the actual message appears via the Firestore listener on the client.
      body: JSON.stringify({ success: true, message: 'Bot responded and message stored.' }),
    };

  } catch (error: any) {
    console.error("Error in callPlioBot Netlify function:", error);
    // Check for specific Gemini API errors if needed
    // if (error.response?.status) { ... }
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message || 'Internal Server Error processing AI request.' }),
    };
  }
};
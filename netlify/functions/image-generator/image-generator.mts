// netlify/functions/image-generator/image-generator.mts

import { Context } from "@netlify/functions";
// --- Use the specific import from the provided frontend file ---
import { GoogleGenAI, Modality } from "@google/genai";
// --- Remove unused imports if any ---

// --- Use the exact model name from the provided frontend file ---
const IMAGE_MODEL_NAME = "gemini-2.0-flash-exp-image-generation";


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
        // 3. Parse Request Body for Prompt
        let requestBody: { prompt: string };
        try {
            requestBody = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { prompt } = requestBody; // Renamed to 'prompt' to match frontend variable name inside handleGenerate

        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            return new Response(
                JSON.stringify({ error: "Missing or invalid 'prompt' in request body" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // --- **** START: Exact Logic from handleGenerate **** ---
        // Initialize AI client inside the handler, as per the example structure
        // Using vertexai: false for direct API key usage
        const ai = new GoogleGenAI({ apiKey: apiKey }); // Use apiKey from env

        let imageData: string | null = null;
        let imageMimeType: string | null = null;

        try {
            console.log(
                `Server: Sending prompt to ${IMAGE_MODEL_NAME}: "${prompt}"`, // Use prompt variable
            );

            // --- Use ai.models.generateContent (exact call structure) ---
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL_NAME, // Use exact model name
                contents: prompt, // Use prompt variable
                config: {
                    responseModalities: [Modality.TEXT, Modality.IMAGE], // Use exact config
                },
            });
            // --- End generateContent call ---

            console.log("Server: API Response:", response);

            // --- Exact loop and extraction logic ---
            // @ts-ignore (Replicating the ignore from frontend)
            for (const part of response.candidates[0].content.parts) {
                // Based on the part type, either show the text or save the image
                if (part.text) {
                    console.log("Server: Text part received:", part.text); // Log text part
                } else if (part.inlineData) {
                    // This console log might be misleading if multiple parts exist, but replicating it
                    console.log("Server: Image part found.");
                    // --- Extract data exactly as in frontend ---
                    const mimeType = part?.inlineData?.mimeType;
                    const base64Data = part?.inlineData?.data;

                    // Store the data from the first image part found
                    if (base64Data && mimeType && !imageData) {
                        imageData = base64Data;
                        imageMimeType = mimeType;
                        // Don't construct dataUrl here, send raw data back
                        console.log(`Server: Extracted image mimeType: ${imageMimeType}`);
                        // Break if you only expect one image, or continue if multiple parts could contain images (though frontend logic only uses the last one found implicitly)
                        // break; // Let's assume we stop after finding the first image, mirroring the likely intent.
                    }
                }
            }
            // --- End exact loop ---

            if (!imageData || !imageMimeType) {
                // If the loop finished without finding image data
                console.error("Server: No image data found in response parts.");
                // Check if there was only text
                // @ts-ignore
                const textResponse = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
                if (textResponse) {
                    return new Response(JSON.stringify({ error: `AI did not return an image. Response: ${textResponse}` }), { status: 502, headers: { "Content-Type": "application/json" } });
                }
                return new Response(JSON.stringify({ error: "AI response did not contain image data." }), { status: 502, headers: { "Content-Type": "application/json" } });
            }

            // --- **** END: Exact Logic from handleGenerate **** ---

            // 7. Send Success Response to Frontend (Send raw data)
            return new Response(JSON.stringify({
                imageData: imageData,
                mimeType: imageMimeType
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });

        } catch (err: any) { // Catch errors from the specific generation block
            console.error("Server: Error during image generation API call:", err);
            // Attempt to parse specific API errors if possible
            const message = String(err?.message || err || "Unknown generation error"); // Replicate simple parseError
            // Return error in the expected JSON format
            return new Response(
                JSON.stringify({ error: `Error: ${message}` }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

    } catch (error: any) { // Catch outer errors (parsing, env var)
        console.error("Server: Outer error processing image generation request:", error);
        return new Response(
            JSON.stringify({ error: error.message || "An internal server error occurred." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
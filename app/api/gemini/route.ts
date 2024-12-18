// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

// if (!API_KEY) {
//   throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables.");
// }

// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();

//     if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
//       return NextResponse.json({ error: "Invalid or empty prompt." }, { status: 400 });
//     }

//     const result = await model.generateContentStream(prompt);


//     const encoder = new TextEncoder();
//     const readableStream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of result.stream) {
//             controller.enqueue(encoder.encode(chunk.text()));
//           }
//         } catch (streamError) {
//           console.error("Stream error:", streamError);
//           controller.close();
//         }
//         controller.close();
//       },
//     });

//     return new Response(readableStream, {
//       headers: { "Content-Type": "text/plain" },
//     });
//   } catch (error: any) {
//     console.error("Error generating content:", error);

//     const errorMessage =
//       error?.response?.data?.message || "An error occurred while generating content.";
//     const status = error?.response?.status || 500;

//     return NextResponse.json({ error: errorMessage }, { status });
//   }
// 

import { streamText, Message } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
})

export const runtime = "edge";

const generateId = () => Math.random().toString (36).slice (2, 15);

const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "user",
    content: "You are an AI assistant. You will be given a task. You must generate a detailed and long answer.",
    // content: initialMessage.content,
  },
  ...messages.map((message) => ({
    id: generateId(),
    role: message.role,
    content: message.content,
  }))
]

export async function POST(req: Request, res: Response) {
  const { messages } = await req.json();
  const stream = await streamText({
    model: google("gemini-1.5-pro"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 0.7,
  });
  return stream?.toDataStreamResponse();
}
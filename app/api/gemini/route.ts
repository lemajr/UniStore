import { streamText, Message } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { initialMessage } from "@/lib/ai/data";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
})

export const runtime = "edge";

const generateId = () => Math.random().toString (36).slice (2, 15);

const buildGoogleGenAIPrompt = (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "user",
    content: initialMessage.content,
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
import ChatBot from "@/components/ai/chatbot";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to the Chatbot!</h1>
      <ChatBot />
    </main>
  );
}

'use client'

import { useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage = new Message({
      id: 1, // User ID
      message: input,
    });
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          fullResponse += decoder.decode(value, { stream: true });
          setMessages((prevMessages) => [
            ...prevMessages,
            new Message({ id: 2, message: fullResponse }), // AI Response
          ]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        new Message({ id: 2, message: "Something went wrong. Please try again." }),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Chat with AI</h1>
        <div className="chat-container h-80 overflow-y-scroll border rounded-lg p-2 mb-4">
          <ChatFeed
            messages={messages}
            isTyping={isLoading}
            hasInputField={false}
            bubblesCentered={false}
            bubbleStyles={{
              text: { fontSize: 16 },
              chatbubble: { borderRadius: 20, padding: 10 },
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border rounded-md px-4 py-2"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

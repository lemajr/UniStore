'use client'

import { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { X, MessageCircle, Send, Loader2, ArrowDownCircleIcon } from "lucide-react"
import { AnimatePresence } from "framer-motion"

export default function ChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error} = useChat({api: "api/gemini"})

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (

  <>
    <div className="fixed bottom-4 right-4 z-50"
    >

      <Button onClick={toggleChat} size="icon" className="rounded-full bg-sky-500 hover:bg-blue size-14 p-2 shadow-lg">
        {!isChatOpen ? (
          <MessageCircle className="size-12" />
        ) : (
          <ArrowDownCircleIcon />
        )}
      </Button>

    </div>
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1}}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-4 z-50 w-[95%] md:w-[500px]"
        >
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-sky-500">Chat with UniStore AI</CardTitle>
              <Button
                onClick={toggleChat}
                size="sm"  
                variant="ghost"              
                className="px-2 py-0"
              >
                <X className="size-4" />
                <span className="sr-only"> close chat</span>
              </Button>
            </CardHeader>
            <CardContent > 
              <ScrollArea className="h-[300px] pr-4">
               <div className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                No message yet.
               </div>
              </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit}
                className="flex w-full items-center space-x-2"
                >
              <Input
              value={input}
              onChange={handleInputChange}
                className="flex-1"
                placeholder="Type your a message here..."
                />
              <Button
              type="submit"
                className="size-9 bg-gradient-to-tr from-rose-600 to-sky-600"
                disabled={isLoading}
                >
                <Send className="size-4 " />
              </Button>
              </form>
                </CardFooter>
          </Card>
        </motion.div>
)}
    </AnimatePresence>
  </>

  )
}
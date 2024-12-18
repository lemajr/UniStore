'use client'

import { useState, useRef, useEffect } from "react"
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

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error} = useChat({api: "api/gemini"})

  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

useEffect(() =>{
  if (scrollRef.current) {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);

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
                { messages?.length === 0 && (

               <div className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                No message yet.
               </div>
                )}
                { messages?.map((message, index) => (
                  <div
                  key={index}
                  className={`mb-4 ${message.role ==="user" ? "text-right": "text-left"}`}
                  >
                  
                  <div className={`inline-block p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <ReactMarkdown children={ message.content } remarkPlugins={[remarkGfm]}
                        components={{ code({ node, inline, className, children, ...props }: any) {
                          return inline ? (
                            <code {...props} className={`bg-gray-200 px-1 rounded-full`}>{children}</code>
                          ): (
                            <pre {...props} className={`bg-gray-200 p-2 rounded`}>{children}</pre>
                          );
                        }, 
                        
                          ul: ({ children }) => ( 
                            <ul className="list-disc ml-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-4">
                              {children}
                            </ol>
                          ),
                        }} />
                 </div>



                  </div>
                ))}
                {isLoading && (
                  <div className="w-full items-center flex justify-center gap-3">
                    <Loader2 className="animate-spin h-5 w-5 text-primary"/>
                      <button className="underline text-gray-900" type="button" onClick={() => stop()}> Stop</button>
                  </div>
                )}
                 {error && (
                  <div className="w-full items-center flex justify-center gap-3">
                    <div>An error occurred.</div>
                    <button className="underline" type="button" onClick={() => reload()}>Retry</button>
                  </div>
                )}
                <div ref={scrollRef}></div>
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
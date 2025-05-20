'use client'
import { useChat } from 'ai/react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'
import { RotatingBanner } from './components/RotatingBanner'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [isTyping, setIsTyping] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsTyping(true)
    handleSubmit(e).finally(() => setIsTyping(false))
  }

  return (
    <div className="flex flex-col items-center pt-8 min-h-screen bg-white">
      <Card className="w-full max-w-4xl p-0">
        <CardHeader className="p-4 pb-0">
          <CardTitle>SteveBizBlog Chatbot</CardTitle>
        </CardHeader>
        <RotatingBanner />
        <CardContent className="h-[60vh] overflow-y-auto p-4">
          {messages.map(m => (
            <div key={m.id} className="mb-4">
              <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {m.role === 'user' ? (
                  m.content
                ) : (
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-gray-100 rounded px-1" {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="text-left">
              <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
                Chatbot is typing...
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className="flex w-full space-x-2">
            <textarea
  value={input}
  onChange={handleInputChange}
  placeholder="Ask SteveBizBot a business question..."
  className="flex-grow p-2 border rounded-md resize-none"
  rows={3}
/>
            <Button type="submit" disabled={isTyping}>Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}


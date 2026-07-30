import React, { useState, useRef, useEffect } from 'react';
import { useAiChat } from '@/features/ai-assistant/useAiChat';
import { ChatBubble, TypingIndicator } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { SourceCitation } from '@/components/chat/SourceCitation';
import { Bot, Sparkles } from 'lucide-react';

const WELCOME = {
  role: 'assistant',
  content: "Hello! I'm your AI academic assistant, powered by your course content. Ask me anything about your courses, concepts, or assignments.",
  timestamp: new Date().toISOString(),
};

const AiAssistantPage = () => {
  const [messages, setMessages] = useState([WELCOME]);
  const [sources, setSources] = useState({});
  const chat = useAiChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chat.isPending]);

  const handleSend = async (content) => {
    const userMsg = { role: 'user', content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await chat.mutateAsync({ message: content });
      const assistantMsg = {
        role: 'assistant',
        content: result.response || result.answer || result.message || JSON.stringify(result),
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };
      if (result.sources?.length) {
        setSources((prev) => ({ ...prev, [assistantMsg.id]: result.sources }));
      }
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
        <div className="p-2 bg-indigo-600/20 rounded-xl">
          <Bot size={20} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            AI Academic Assistant <Sparkles size={13} className="text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-500">Powered by your course content · RAG-enhanced</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto space-y-4 pb-4"
        role="log"
        aria-live="polite"
        aria-label="AI chat conversation"
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <ChatBubble message={msg} />
            {msg.id && sources[msg.id] && (
              <div className={`mt-1 ${msg.role === 'assistant' ? 'ml-11' : 'mr-11 flex justify-end'}`}>
                <SourceCitation sources={sources[msg.id]} />
              </div>
            )}
          </div>
        ))}
        {chat.isPending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-white/5">
        <ChatInput onSend={handleSend} disabled={chat.isPending} />
        <p className="text-center text-xs text-slate-700 mt-2">
          Responses are grounded in your enrolled course content only.
        </p>
      </div>
    </div>
  );
};

export default AiAssistantPage;

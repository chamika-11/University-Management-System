import React from 'react';
import { MessageBubble } from './MessageBubble';

export function ChatBubble({ message }) {
  return <MessageBubble message={message} />;
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800 rounded-2xl rounded-bl-sm max-w-[120px] mb-3 animate-pulse">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  );
}

export default ChatBubble;

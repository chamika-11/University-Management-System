import React from 'react';

export function MessageBubble({ message }) {
  if (!message) return null;
  const isUser = message.role === 'user' || message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3`}>
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
        <p className="whitespace-pre-wrap">{message.text || message.content}</p>
      </div>
      <span className="text-[10px] text-slate-500 mt-1 px-1">
        {isUser ? 'You' : 'AI Assistant'}
      </span>
    </div>
  );
}

export default MessageBubble;

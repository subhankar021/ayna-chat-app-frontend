import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../backend/types';
import { UserCircle, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <UserCircle className="w-8 h-8 text-blue-500" />
          ) : (
            <Bot className="w-8 h-8 text-green-500" />
          )}
        </div>
        <div className={`mx-2 ${isUser ? 'bg-blue-500' : 'bg-gray-200'} rounded-lg px-4 py-2`}>
          <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {message.text}
          </p>
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {format(message.timestamp, 'HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
}
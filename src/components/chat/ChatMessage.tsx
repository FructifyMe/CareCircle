import React from 'react';
import { format } from 'date-fns';
import type { ChatMessage as ChatMessageType } from '../../types/care';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        <div className={`
          rounded-lg px-4 py-2 
          ${isCurrentUser 
            ? 'bg-primary-600 text-white rounded-br-none' 
            : 'bg-gray-100 text-secondary-900 rounded-bl-none'}
        `}>
          <p className="text-sm">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    block text-sm underline 
                    ${isCurrentUser ? 'text-white' : 'text-primary-600'}
                  `}
                >
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-secondary-500 mt-1">
          {format(new Date(message.timestamp), 'MMM d, h:mm a')}
        </p>
      </div>
    </div>
  );
};
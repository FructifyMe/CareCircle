import React, { useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '../common/Button';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: string[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would upload the file to storage and get back a URL
    // For now, we'll just store the file name
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => URL.createObjectURL(file));
    setAttachments(prev => [...prev, ...fileNames]);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="bg-gray-100 text-secondary-600 text-sm px-3 py-1 rounded-full"
            >
              Attachment {index + 1}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleAttachment}
          />
          <Paperclip className="w-5 h-5 text-secondary-400 hover:text-secondary-600" />
        </label>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        <Button type="submit" disabled={!message.trim()}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};
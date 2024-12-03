import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useCareStore } from '../../store/careStore';

export const ChatWindow: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage } = useCareStore();
  const currentCaregiver = useCareStore(state => state.currentCaregiver);
  const currentPatient = useCareStore(state => state.currentPatient);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, attachments?: string[]) => {
    if (!currentCaregiver || !currentPatient) return;

    const newMessage = {
      id: Date.now().toString(),
      patientId: currentPatient.id,
      senderId: currentCaregiver.id,
      content,
      timestamp: new Date().toISOString(),
      attachments
    };

    addMessage(newMessage);
  };

  const filteredMessages = messages.filter(
    msg => msg.patientId === currentPatient?.id
  );

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-secondary-900">Care Team Chat</h2>
        <p className="text-sm text-secondary-600">
          Communicate with other caregivers
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredMessages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentCaregiver?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
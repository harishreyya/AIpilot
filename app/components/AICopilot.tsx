'use client';

import { useEffect, useRef, useState } from 'react';
import { OpenAIStream, Message } from '../lib/openai';
import { FaPaperPlane } from 'react-icons/fa';

interface AICopilotProps {
  onFieldUpdate: (field: string, value: string) => void;
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: "Hi! I'm here to help you submit your AI agent idea. Let's start with your name.",
  },
];

export default function AICopilot({ onFieldUpdate }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    const input = userInput.trim();
    if (!input) return;

    const updatedMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setUserInput('');

    const aiReply = await OpenAIStream([
      ...updatedMessages as any,
      {
        role: 'system',
        content:
          'Based on the last user response, infer the appropriate form field label (name, email, linkedinProfile, idea) and the extracted value. Respond ONLY in this JSON format: { "field": "<field>", "value": "<value>", "message": "<copilot message to show user>" }. Do not explain.',
      },
    ]);

    try {
      const parsed = JSON.parse(aiReply);
      if (parsed?.field && parsed?.value && parsed?.message) {
        onFieldUpdate(parsed.field, parsed.value);
        setMessages((prev) => [...prev, { role: 'assistant', content: parsed.message }]);
      } else {
        throw new Error('Unexpected OpenAI response');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "oops! Could you write your answer again?",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg max-w-sm ${
              msg.role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your response..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

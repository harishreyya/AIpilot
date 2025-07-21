'use client';

import Image from 'next/image';
import AgentForm from './components/AgentForm';
import AICopilot from './components/AICopilot';
import { useRef } from 'react';

type FieldUpdateFn = (field: string, value: string) => void;

export default function Home() {
  const formRef = useRef<FieldUpdateFn | null>(null);

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="flex items-center justify-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Image 
            src="/canvas-logo.svg" 
            alt="Canvas Logo" 
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            From Idea to <span className="text-blue-600">&#123; AI Agent in minutes &#125;</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <AgentForm
              ref={formRef}
              onExternalUpdate={(updater) => {
                formRef.current = updater;
              }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Copilot</h3>
            <AICopilot
              onFieldUpdate={(field, value) => {
                if (formRef.current) {
                  formRef.current(field, value);
                }
              }}
            />
          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">This is a screening assignment</p>
            <p className="text-sm text-gray-500 mb-6">Built with Next.js</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2025 Canvas</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

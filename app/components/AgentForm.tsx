'use client';

import { useState, useEffect, forwardRef } from 'react';

export interface FormData {
  name: string;
  email: string;
  linkedinProfile: string;
  idea: string;
}

const AgentForm = forwardRef(function AgentForm(
  {
    onExternalUpdate,
  }: {
    onExternalUpdate?: (updater: (field: string, value: string) => void) => void;
  },
  ref
) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    linkedinProfile: '',
    idea: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (onExternalUpdate) {
      onExternalUpdate((field, value) => updateField(field as keyof FormData, value));
    }
  }, [onExternalUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof FormData, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {(['name', 'email', 'linkedinProfile', 'idea'] as (keyof FormData)[]).map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field === 'idea' ? 'Describe your AI agent idea' : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === 'idea' ? (
              <textarea
                id={field}
                name={field}
                rows={6}
                placeholder="Describe the AI agent you want to build..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                id={field}
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                placeholder={
                  field === 'linkedinProfile'
                    ? 'https://linkedin.com/in/your-profile'
                    : `Enter your ${field}`
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>Submit my idea</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Or use the AI copilot on the right to help you fill out this form automatically
        </p>
      </div>
    </div>
  );
});

export default AgentForm;

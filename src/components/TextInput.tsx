'use client'

import { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onSubmit, disabled = false }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !disabled) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 text-center">
        Speak your emergency clearly, or type it below
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your emergency..."
          disabled={disabled}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
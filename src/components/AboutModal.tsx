'use client'

import { X, Users } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">About HelpNow AI</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4 text-gray-800 dark:text-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Team CodeX</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">This project was developed by us</p>
              
              <div className="space-y-2">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-white">Shiva Kumar S</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-white">Ruthvik MT</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-white">Pratham R Shetty</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="font-medium text-gray-900 dark:text-white">Sanjay UG</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                HelpNow AI is designed to provide immediate first aid guidance in emergency situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
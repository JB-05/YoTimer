import React from 'react';
import { Timer } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Timer className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-pulse mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          YoTimer
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          by Joel Biju
        </p>
      </div>
    </div>
  );
};

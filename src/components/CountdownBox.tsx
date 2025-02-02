import React from 'react';
import { Timer, ArrowRight, X } from 'lucide-react';
import { CountdownBoxProps } from '../types';

const CountdownBox: React.FC<CountdownBoxProps> = ({ event, onStart, onDelete }) => {
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4 transform transition-all hover:scale-102 relative">
      <button
        onClick={() => onDelete(event.id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {event.logoUrl ? (
            <img src={event.logoUrl} alt={event.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <Timer className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{event.name}</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created: {new Date(event.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Duration: {formatDuration(event.duration)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => onStart(event.id)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <span>Start</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export { CountdownBox };

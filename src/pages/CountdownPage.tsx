import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Play, RotateCcw } from 'lucide-react';

export const CountdownPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const event = JSON.parse(localStorage.getItem('events') || '[]')
    .find((e: any) => e.id === id);

  const playAlertSound = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
  }, []);

  

  const startCountdown = () => {
    setIsStarted(true);
  };

  const restartCountdown = () => {
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft({
      hours: Math.floor(event.duration / 3600),
      minutes: Math.floor((event.duration % 3600) / 60),
      seconds: event.duration % 60
    });
  };

  useEffect(() => {
    if (!event) {
      navigate('/');
      return;
    }

    if (!isStarted) {
      setTimeLeft({
        hours: Math.floor(event.duration / 3600),
        minutes: Math.floor((event.duration % 3600) / 60),
        seconds: event.duration % 60
      });
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(event.targetDate);
      const diff = target.getTime() - now.getTime();
      const currentProgress = (diff / (event.duration * 1000)) * 100;
      setProgress(Math.max(0, currentProgress));

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (!isFinished) {
          setIsFinished(true);
          playAlertSound();
          setShowCongrats(true);
          setTimeout(() => {
            setShowCongrats(false);
          }, 5000);
        }
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        setTimeLeft({
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event, navigate, isFinished, playAlertSound, isStarted]);

  if (!event) return null;

  const isNearEnd = progress <= 5;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {(!isStarted || isFinished) && (
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      )}

      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="text-center text-white">
            <h2 className="text-6xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-2xl">Timer Complete!</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-16">
          {event.logoUrl && (
            <div className="relative w-24 h-24 mx-auto mb-6">
              <img
                src={event.logoUrl}
                alt={event.name}
                className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            </div>
          )}
          <h1 className={`text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {event.name}
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {new Date(event.targetDate).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className={`rounded-2xl shadow-lg p-12 mb-8 transition-colors ${
          isNearEnd ? 'bg-red-50 dark:bg-red-900/20' : 
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-3 gap-8 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="relative">
                <div className={`text-8xl font-bold mb-2 transition-colors ${
                  isNearEnd ? 'text-red-600 dark:text-red-400' :
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {value.toString().padStart(2, '0')}
                </div>
                <div className={`text-xl uppercase tracking-wider ${
                  isNearEnd ? 'text-red-500 dark:text-red-300' :
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isStarted && (
            <button
              onClick={startCountdown}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start Timer</span>
            </button>
          )}
          {(isStarted || isFinished) && (
            <button
              onClick={restartCountdown}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Restart Timer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
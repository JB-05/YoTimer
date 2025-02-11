import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Play } from 'lucide-react';

export const CountdownPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    const totalSeconds = event.duration;
    const targetDate = new Date(Date.now() + totalSeconds * 1000);
    event.targetDate = targetDate.toISOString();
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const updatedEvents = events.map((e: any) => e.id === event.id ? event : e);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
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
    setProgress(100);
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
      const totalDuration = event.duration * 1000;
      const elapsed = totalDuration - diff;
      const currentProgress = ((totalDuration - elapsed) / totalDuration) * 100;
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
    }, 100);

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
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <div className="text-center text-white transform scale-up animate-bounce">
            <h2 className="text-8xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-4xl font-bold text-white/90">Timer Complete!</p>
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          {event.logoUrl && (
            <div className="relative w-32 h-32 mx-auto mb-8">
              <img
                src={event.logoUrl}
                alt={event.name}
                className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            </div>
          )}
          <h1 className={`text-6xl font-black mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {event.name}
          </h1>
        </div>

        <div className={`w-full max-w-[95vw] rounded-3xl shadow-2xl p-8 md:p-16 transition-all duration-300 transform ${
          isNearEnd ? 'bg-red-950/30 scale-105 pulse-shadow' : 
          isDarkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'
        }`}>
          <div className="grid grid-cols-3 gap-4 md:gap-12 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="relative">
                <div className={`text-6xl md:text-9xl lg:text-[12rem] font-black mb-2 md:mb-4 transition-all duration-300 ${
                  isNearEnd ? 'text-red-500 dark:text-red-400 scale-110 number-pulse' :
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {value.toString().padStart(2, '0')}
                </div>
                <div className={`text-xl md:text-2xl uppercase tracking-widest font-medium ${
                  isNearEnd ? 'text-red-400 dark:text-red-300' :
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className={`text-xl mt-8 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {new Date(event.targetDate).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        <div className="mt-8">
          {!isStarted && (
            <button
              onClick={startCountdown}
              className="flex items-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-xl transition-all hover:scale-105 transform"
            >
              <Play className="w-6 h-6" />
              <span>Start Timer</span>
            </button>
          )}
          {isFinished && (
            <button
              onClick={restartCountdown}
              className="flex items-center space-x-3 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-semibold rounded-xl transition-all hover:scale-105 transform"
            >
              <span>Restart Timer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

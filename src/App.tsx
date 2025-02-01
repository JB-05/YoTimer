import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Timer, Upload, X } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { CountdownBox } from './components/CountdownBox';
import { CountdownPage } from './pages/CountdownPage';
import { CountdownEvent } from './types';

function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CountdownEvent[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });
  const [eventName, setEventName] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [eventLogo, setEventLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = 
      parseInt(hours) * 3600 + 
      parseInt(minutes) * 60 + 
      parseInt(seconds);
    
    const targetDate = new Date(Date.now() + totalSeconds * 1000);
    
    const newEvent: CountdownEvent = {
      id: Date.now().toString(),
      name: eventName,
      targetDate,
      logoUrl: logoPreview || undefined,
      duration: totalSeconds,
      description: '',
      createdAt: new Date()
    };
    setEvents([...events, newEvent]);
    setEventName('');
    setHours('0');
    setMinutes('0');
    setSeconds('0');
    setEventLogo(null);
    setLogoPreview('');
  };

  const handleStart = (id: string) => {
    navigate(`/countdown/${id}`);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Timer className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            YoTimer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            by Joel Biju
          </p>
        </div>

        <form onSubmit={handleAddCountdown} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timer Duration
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Hours"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Hours</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Minutes"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Minutes</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Seconds"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Seconds</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img src={logoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Add Countdown</span>
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {events.map((event) => (
            <CountdownBox
              key={event.id}
              event={event}
              onStart={handleStart}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <h2 className="text-xl font-semibold mb-2">About YoTimer</h2>
          <p className="text-sm">
            YoTimer is a fun project designed to help you keep track of your important moments.
            Whether you're counting down to a special event, managing a presentation, or timing your breaks,
            YoTimer makes it engaging and simple. Created with ❤️ as a fun project to explore modern web technologies.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/countdown/:id" element={<CountdownPage />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Heart, Cat, Calendar, Coffee, Film, Gamepad } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

type DateType = {
  icon: React.ReactNode;
  label: string;
  description: string;
};

const dateTypes: DateType[] = [
  { 
    icon: <Coffee className="w-6 h-6" />, 
    label: "Coffee Date", 
    description: "Let's get cozy at a cute café!" 
  },
  { 
    icon: <Film className="w-6 h-6" />, 
    label: "Movie Night", 
    description: "Watch something fun together!" 
  },
  { 
    icon: <Gamepad className="w-6 h-6" />, 
    label: "Arcade Fun", 
    description: "Let's play some games together!" 
  }
];

function App() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedType, setSelectedType] = useState<DateType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDateForm, setShowDateForm] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !selectedDate) return;

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'dates'), {
        date: selectedDate,
        dateType: selectedType.label,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
      
      console.log("Document written with ID: ", docRef.id);
      setShowSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error saving date:', error);
      alert('Failed to save date information. Please try again!');
      setIsSubmitting(false);
    }
  };

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 200);
    const y = Math.random() * (window.innerHeight - 100);
    setNoButtonPosition({ x, y });
  };

  useEffect(() => {
    const handleResize = () => {
      if (!showDateForm) {
        moveNoButton();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showDateForm]);

  if (!showDateForm) {
    return (
      <div className="min-h-screen bg-pink-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-pink-500 animate-bounce" />
              <Cat className="w-12 h-12 text-pink-500 ml-2" />
            </div>
            <h1 className="text-4xl font-bold text-pink-600 mb-2">Pookie, Will You Go Out With Me? 🥺</h1>
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Cute cat" 
              className="rounded-lg shadow-lg mx-auto my-4 max-w-md"
            />
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowDateForm(true)}
                className="px-12 py-4 bg-pink-500 text-white text-xl font-bold rounded-lg hover:bg-pink-600 transform hover:scale-105 transition-all"
              >
                Yes! 💖
              </button>
              <button
                style={{
                  position: 'fixed',
                  left: `${noButtonPosition.x}px`,
                  top: `${noButtonPosition.y}px`,
                  transition: 'all 0.2s ease-out'
                }}
                onMouseEnter={moveNoButton}
                className="px-12 py-4 bg-gray-500 text-white text-xl font-bold rounded-lg"
              >
                No 😢
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-4xl mx-auto p-8">
        {!showSuccess ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                <Calendar className="inline mr-2" />
                Pick a Date
              </label>
              <input
                type="date"
                required
                className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Choose Our Date Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dateTypes.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType?.label === type.label
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center">
                      {type.icon}
                      <div className="ml-3 text-left">
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting ? 'bg-pink-300' : 'bg-pink-500 hover:bg-pink-600'
              } text-white py-3 px-6 rounded-lg font-semibold transition-colors`}
            >
              {isSubmitting ? 'Saving...' : 'Plan Our Date! 💖'}
            </button>
          </form>
        ) : (
          <div className="text-center bg-white rounded-lg shadow-xl p-8">
            <img 
              src="https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Happy cat" 
              className="rounded-lg shadow-lg mx-auto mb-4 max-w-md"
            />
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Yay! Date Saved! 😊</h2>
            <p className="text-gray-700">
              I can't wait for our {selectedType?.label.toLowerCase()} on {selectedDate}! 
              It's going to be absolutely purrfect! 🐱
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
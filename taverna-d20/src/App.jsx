import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import InfoScreen from './components/InfoScreen';
import ChallengeScreen from './components/ChallengeScreen';
import QuizPage from './components/QuizPage';
import logoImg from './assets/logo.png';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); 
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-d20-fundo-light dark:bg-d20-fundo-dark transition-colors duration-500 font-sans relative">
        <AnimatePresence mode="wait">
          
          {currentScreen === 'welcome' && (
            <WelcomeScreen 
              key="welcome"
              logoImg={logoImg} 
              onStart={() => setCurrentScreen('menu')} 
              onInfo={() => setCurrentScreen('info')} 
              onQuiz={() => setCurrentScreen('quiz')}
            />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen 
              key="menu"
              darkMode={darkMode} 
              toggleTheme={toggleTheme} 
              onBack={() => setCurrentScreen('welcome')} 
              onChallenge={() => setCurrentScreen('challenge')}
            />
          )}

          {currentScreen === 'info' && (
            <InfoScreen 
              key="info"
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              onBack={() => setCurrentScreen('welcome')} 
            />
          )}

          {currentScreen === 'challenge' && (
            <ChallengeScreen 
              key="challenge"
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              onBack={() => setCurrentScreen('menu')} 
            />
          )}

          {currentScreen === 'quiz' && (
            <QuizPage 
              key="quiz"
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              onBack={() => setCurrentScreen('welcome')} 
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

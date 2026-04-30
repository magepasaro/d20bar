import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import MenuScreen from './components/MenuScreen.jsx';
import InfoScreen from './components/InfoScreen.jsx';
import ChallengeScreen from './components/ChallengeScreen.jsx';
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
            />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen 
              key="menu"
              darkMode={darkMode} 
              toggleTheme={toggleTheme} 
              onBack={() => setCurrentScreen('welcome')} 
              onChallenge={() => setCurrentScreen('challenge')} // 2. Passa a função para o botão do cardápio
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

          {/* 3. Lógica para exibir a tela de Dinâmicas */}
          {currentScreen === 'challenge' && (
            <ChallengeScreen 
              key="challenge"
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              onBack={() => setCurrentScreen('menu')} // Volta para o cardápio
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

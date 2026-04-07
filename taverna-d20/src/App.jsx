// App.jsx
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import InfoScreen from './components/InfoScreen'; // Importe a nova tela
import logoImg from './assets/logo.png';

export default function App() {
  // Agora usamos uma string para identificar a página ativa
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
              onInfo={() => setCurrentScreen('info')} // Passa a função para o botão de info
            />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen 
              key="menu"
              darkMode={darkMode} 
              toggleTheme={toggleTheme} 
              onBack={() => setCurrentScreen('welcome')} 
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

        </AnimatePresence>
      </div>
    </div>
  );
}
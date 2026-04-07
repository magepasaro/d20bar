import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin, ArrowLeft, Sun, Moon } from 'lucide-react';

const InstagramIcon = ({ size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="lucide lucide-instagram"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function InfoScreen({ onBack, darkMode, toggleTheme }) {
  const infoCards = [
    {
      icon: <Clock className="text-d20-amarelo" />,
      title: "Horários",
      content: (
        <div className="space-y-1">
          <p>Quarta e Quinta: 20h às 00h</p>
          <p>Sexta-Feira: 19h às 00h</p>
          <p>Sábado: 18h às 00h</p>
        </div>
      )
    },
    {
      icon: <Calendar className="text-d20-amarelo" />,
      title: "Agenda de Eventos",
      content: (
        <div className="space-y-1">
          <p className="font-bold">Abril</p>
          <p>04/04 - Música ao vivo | Luíz Sapucaí</p>
          <p>11/04 - Festa Y2K</p>
          <p className="italic opacity-70">Em breve novidades...</p>
        </div>
      )
    },
    {
      icon: <MapPin className="text-d20-amarelo" />,
      title: "Localização",
      content: (
        <a 
          href="https://www.google.com/maps/search/?api=1&query=Avenida+B+P+S+658+Centro+Itajuba+MG" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline block"
        >
          <p>Avenida B P S, 658 - Centro,</p>
          <p>Itajubá - MG, 37500-176</p> 
        </a>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-d20-fundo-light dark:bg-d20-fundo-dark transition-colors duration-500 font-sans"
    >
      {/* HEADER FIXO - IDÊNTICO AO DO CARDÁPIO */}
      <div className="sticky top-0 z-50 bg-d20-fundo-light/90 dark:bg-d20-fundo-dark/90 backdrop-blur-lg px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-d20-azul dark:text-d20-amarelo font-black uppercase text-base tracking-tighter active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>

        <button 
          onClick={toggleTheme} 
          className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full active:scale-90 transition-transform"
        >
          {darkMode ? <Sun size={18} className="text-d20-amarelo" /> : <Moon size={18} className="text-d20-azul" />}
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="p-6 pb-20">
        <header className="mb-12 mt-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo">
            D20 | Informações
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
            O bar mais divertido da cidade
          </p>
        </header>

        <div className="space-y-6">
          {infoCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  {card.icon}
                </div>
                <div>
                  <h2 className="font-bold uppercase text-sm text-zinc-600 dark:text-zinc-100 mb-2">
                    {card.title}
                  </h2>
                  <div className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    {card.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão Instagram */}
        <div className="mt-12 space-y-4">
          <h2 className="text-center font-black uppercase text-xs tracking-widest text-zinc-400">
            Siga o nosso bando
          </h2>
          <a 
            href="https://instagram.com/d20bar" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-d20-amarelo text-d20-azul w-full py-4 rounded-full font-black uppercase text-sm shadow-lg active:scale-95 transition-all"
          >
            <InstagramIcon size={20} /> @d20bar
          </a>
        </div>
      </div>
    </motion.div>
  );
}

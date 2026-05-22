import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AnnouncementPopup({ src, adId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const storageKey = `d20_hide_ad_${adId}`;
    const shouldHide = localStorage.getItem(storageKey);

    if (!shouldHide) {
      setIsOpen(true);
    }
  }, [adId]);

  const handleClose = () => {
    setIsOpen(false);
    
    if (dontShowAgain) {
      localStorage.setItem(`d20_hide_ad_${adId}`, 'true');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
          {/* Fundo escuro clicável para fechar ao clicar fora */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Container Geral */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-[380px] flex flex-col items-center"
          >
            
            {/* Caixa da Imagem - Travada estritamente na proporção 4:5 da sua arte */}
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
              
              {/* Botão de Fechar (X) - Totalmente integrado ao canto interno da arte */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-30 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                aria-label="Fechar anúncio"
              >
                <X size={18} />
              </button>

              {/* Sua Imagem Pura */}
              <img 
                src={src} 
                alt="Anúncio D20 Bar" 
                className="w-full h-full object-cover block" 
              />
            </div>

            {/* Checkbox de Controle abaixo da imagem */}
            <div className="mt-4 flex items-center justify-center w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-zinc-300 hover:text-white transition-colors text-sm py-1 font-medium">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-500 bg-zinc-900 text-amber-500 focus:ring-0 focus:ring-offset-0 accent-d20-amarelo cursor-pointer"
                />
                <span>Não quero ver este aviso novamente</span>
              </label>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
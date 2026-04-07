import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WelcomeScreen({ logoImg, onStart, onInfo }) {
  return (
    <motion.div 
      key="welcome"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50, scale: 1.1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center bg-zinc-950"
    >
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: "url('/images/background.png')" }} 
      ></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/90"></div>

      <motion.div className="relative z-20 flex flex-col items-center" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div 
          className="w-40 h-40 mb-10 flex items-center justify-center overflow-hidden"
          animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={logoImg} alt="Logo D20" className="max-w-full max-h-full object-contain" />
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white mb-5 tracking-tight">Bem-vindo ao D20 Bar!</motion.h1>
        <motion.p variants={itemVariants} className="text-white/90 text-base leading-relaxed max-w-xs mb-5 font-light">
          O point oficial para quem curte boa música, comida de verdade e aquele toque de cultura pop. Traga seu bando, escolha seu drink e aproveite o melhor do nosso multiverso!
        </motion.p>
        <motion.p variants={itemVariants} className="text-white/90 text-base leading-relaxed max-w-xs mb-14 font-light italic">Portas abertas de Quarta a Sábado.</motion.p>
        <motion.button 
          variants={itemVariants}
          onClick={onStart} 
          className="bg-d20-amarelo text-d20-azul px-10 py-5 rounded-full font-retro text-[12px] shadow-[0_0_10px_rgba(227,148,44,0.6)] active:scale-95 transition-all uppercase hover:bg-white hover:text-d20-azul"
        >
          Press Start 2P
        </motion.button>
      </motion.div>
              <button 
        onClick={onInfo}
        className="fixed bottom-8 right-8 z-50 p-4 bg-d20-amarelo text-d20-azul rounded-full shadow-2xl active:scale-90 transition-transform">
        <Info size={24} /> {/* Ou use o ícone "Info" da Lucide */}
        </button>
    </motion.div>
  );
}
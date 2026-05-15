import React from 'react';
import { Crown, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Ranking({ dados }) {
  const temDados = dados && dados.length > 0;

  return (
    <section className="pt-10 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
      <h2 className="text-xs font-black uppercase text-d20-azul dark:text-d20-amarelo mb-10 tracking-widest text-center flex items-center justify-center gap-2">
        <Trophy size={14} /> Ranking
      </h2>
      
      <div className="space-y-6">
        {temDados ? (
          dados.map((time, index) => {
            const isFirst = index === 0;
            return (
              <div 
                key={index} 
                className="flex justify-between items-center gap-4 border-b border-zinc-100 dark:border-zinc-900/50 pb-5 animate-in fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {isFirst && (
                      <motion.div 
                        initial={{ y: 0, x: "-50%" }} 
                        animate={{ y: -4, x: "-50%" }} 
                        transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                        className="absolute -top-5 left-1/2 text-d20-amarelo z-10"
                      >
                        <Crown size={20} fill="currentColor" />
                      </motion.div>
                    )}
                    <div className={`rounded-full overflow-hidden border-2 shadow-lg transition-all ${isFirst ? 'border-d20-amarelo w-14 h-14' : 'border-zinc-300 dark:border-zinc-700 w-12 h-12'}`}>
                      {time.foto ? (
                        <img src={time.foto} alt={time.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-zinc-400">
                          {time.nome[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className={`font-black uppercase tracking-tighter leading-none ${isFirst ? 'text-lg text-d20-azul dark:text-d20-amarelo' : 'text-sm text-zinc-600 dark:text-zinc-200'}`}>
                      {time.nome}
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-1">
                      #{index + 1} Lugar
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-d20-azul dark:text-d20-amarelo transition-colors">
                    {time.pontos} <span className="text-[10px] opacity-60 italic">PTS</span>
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 opacity-40 italic text-sm text-zinc-500">
            Aguardando equipes...
          </div>
        )}
      </div>
    </section>
  );
}
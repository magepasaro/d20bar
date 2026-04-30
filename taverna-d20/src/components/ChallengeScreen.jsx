import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Dices, Sparkles } from 'lucide-react';
import bannerImg from '../assets/banner-d20-challenge.png'; 

export default function ChallengeScreen({ onBack, darkMode, toggleTheme }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-d20-fundo-light dark:bg-d20-fundo-dark transition-colors duration-500 font-sans"
    >
      {/* HEADER FIXO */}
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
        <header className="mb-8 mt-4 text-left">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo flex items-center gap-2">
            Covil dos indecisos
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
            Dinâmicas e desafios do D20 Bar.
          </p>
        </header>

        <div className="space-y-6">
          {/* CARD DO D20 CHALLENGE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            {/* ESPAÇO PARA O BANNER */}
            <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative border-b border-zinc-200 dark:border-zinc-800">
               {/* Quando tiver a imagem, substitua o Sparkles por: <img src="/banner.jpg" className="w-full h-full object-cover" /> */}
              <img src={bannerImg} alt="D20 Challenge Banner" className="w-full h-full object-cover" />
            </div>

            {/* TEXTO DESCRITIVO */}
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo flex items-center gap-2">
                D20 Challenge: A Sorte está Lançada! <Dices size={20} />
              </h2>
              
              <div className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed space-y-4">
                <p>
                  Cansou de pedir sempre o mesmo? O D20 Challenge chegou para tirar você da zona de conforto. 
                  Você paga um valor fixo de <span className="font-bold text-d20-azul dark:text-d20-amarelo text-base">R$ 20,00</span> e o nosso dado D20 escolhe o seu drink da rodada.
                </p>
                
                <p>
                  Você pode cair em clássicos da casa como o <strong>Azedim Tônica</strong> ou descobrir novos favoritos como o 
                  <strong> Coffee Dynamite</strong> e o <strong>Nuvem Voadora</strong>. São 20 possibilidades diferentes!
                </p>

                <div className="pt-2">
                  <p className="font-bold uppercase text-xs text-zinc-500 dark:text-zinc-400 mb-1">Como jogar:</p>
                  <p className="italic">Peça ao garçom, role o dado e descubra o seu destino alcoólico.</p>
                </div>

                <div className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed space-y-4">
                  <p><strong>Confira a nossa Tabela de Sorte:</strong></p>
                  <p>
                    1. Olhar da Penitência | 2. Janken | 3. Azedim Tônica | 4. Carambolada | 5. Ametista | 6. Azra | 7. Dragão do Oeste | 8. Epoch | 9. João Ninguém | 10. Nuvem Voadora | 11. She Smash | 12. Tão Tão Distante | 13. Thanos | 14. Tijolo Não Revida | 15. Sharkboy | 16. Lavagirl | 17. Chico e Julieta | 18. Coffee Dynamite | 19. Lele Joe | 20. Dádiva dos Ninjas.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="bg-d20-amarelo/10 dark:bg-d20-amarelo/5 p-4 rounded-xl border border-d20-amarelo/20 text-center">
                  <span className="font-black text-d20-azul dark:text-d20-amarelo uppercase tracking-widest text-sm">
                    Valor: R$ 20,00 
                  </span>
                  <p className="text-[10px] uppercase opacity-60 dark:text-white mt-1">Preço único para qualquer drink do desafio</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NOVIDADES */}
          <div className="py-10 text-center">
            <h2 className="text-zinc-400 dark:text-zinc-600 font-black uppercase text-xs tracking-[0.3em] italic">
              Em breve novidades...
            </h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
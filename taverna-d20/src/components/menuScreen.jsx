import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Search, X } from 'lucide-react';
import { menuData } from '../data/menuData';
import { ArrowLeft } from 'lucide-react';

export default function MenuScreen({ darkMode, toggleTheme, onBack, onChallenge }) {
  const [activeSection, setActiveSection] = useState('bebidas');
  const [searchTerm, setSearchTerm] = useState("");
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (searchTerm !== "") return;
      const scrollPosition = window.scrollY + 200; 

      menuData.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          if (activeSection !== section.id) {
            setActiveSection(section.id);
            const navElement = navRef.current;
            const activeBtn = navElement?.querySelector(`a[href="#${section.id}"]`);
            if (navElement && activeBtn) {
              const navWidth = navElement.offsetWidth;
              const btnOffset = activeBtn.offsetLeft;
              const btnWidth = activeBtn.offsetWidth;
              navElement.scrollTo({
                left: btnOffset - (navWidth / 2) + (btnWidth / 2),
                behavior: 'smooth'
              });
            }
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchTerm, activeSection]);

  const filteredMenu = menuData.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <div className="sticky top-0 z-50">
        <header className="bg-d20-fundo-light/90 dark:bg-d20-fundo-dark/90 backdrop-blur-lg px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div onClick={onBack} className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform">
            <span className="font-black uppercase text-base tracking-tighter text-d20-azul dark:text-d20-amarelo">
            <ArrowLeft size={18} />
            </span>
          </div>
          <button onClick={toggleTheme} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full active:scale-90 transition-transform">
            {darkMode ? <Sun size={18} className="text-d20-amarelo" /> : <Moon size={18} className="text-d20-azul" />}
          </button>
        </header>

        <div className="bg-d20-fundo-light/95 dark:bg-d20-fundo-dark/95 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-zinc-400" size={18} />
            <input 
              type="text" placeholder="Procurar..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-d20-amarelo transition-all outline-none text-zinc-800 dark:text-zinc-200"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 p-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {!searchTerm && (
          <nav ref={navRef} className="bg-d20-fundo-light/95 dark:bg-d20-fundo-dark/95 flex overflow-x-auto gap-2 px-6 py-3 no-scrollbar border-b border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm">
            {menuData.map(cat => (
              <a 
                key={cat.id} href={`#${cat.id}`}
                onClick={() => setActiveSection(cat.id)}
                className={`px-5 py-2 rounded-full text-[11px] font-black flex-shrink-0 uppercase whitespace-nowrap transition-all ${
                  activeSection === cat.id 
                    ? 'bg-d20-azul text-white dark:bg-d20-amarelo dark:text-d20-azul shadow-md' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {cat.title}
              </a>
            ))}
          </nav>
        )}
      </div>

      <main className="p-6 pb-40 space-y-16">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-52">
              <h2 className="text-sm font-black uppercase text-d20-azul dark:text-d20-amarelo mb-8 tracking-widest flex items-center gap-2 transition-colors">
                <span className="h-[2px] w-8 bg-d20-azul dark:bg-d20-amarelo rounded-full"></span>
                {section.title}
              </h2>
              <div className="space-y-10">
                {section.items.map((item, idx) => (
                  <motion.div 
                    key={item.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/50 pb-6"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg uppercase text-zinc-600 dark:text-zinc-100 leading-tight transition-colors">{item.name}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 font-light leading-snug pr-2 italic">{item.desc}</p>
                      <div className="mt-3">
                        <span className="text-lg font-black text-d20-azul dark:text-d20-amarelo transition-colors">R$ {item.price}</span>
                      </div>
                    </div>
                    <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 opacity-50 italic text-zinc-500 dark:text-zinc-400">Nenhum item encontrado...</div>
        )}
      </main>

      <button 
      onClick={onChallenge}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-d20-azul dark:bg-d20-amarelo text-white dark:text-d20-azul px-6 py-3 rounded-full shadow-2xl z-50 whitespace-nowrap active:scale-95 transition-all "
      >
      <span className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
      Não sabe o que pedir?
      </span>
</button>

    </motion.div>
  );
}

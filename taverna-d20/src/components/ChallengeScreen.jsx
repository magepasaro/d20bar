import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, Moon, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { menuData } from '../data/menuData'; // Ajuste o caminho conforme a sua estrutura

import bannerImg from '../assets/banner-d20-challenge.png'; 
import akinatorBannerImg from '../assets/banner-akinator.png'; // Substitua pelo seu banner do assistente

export default function ChallengeScreen({ onBack, darkMode, toggleTheme }) {
  // Achata todos os itens de todas as categorias para a busca do Akinator
  const allItems = menuData.flatMap(category => category.items);

  // Estados de Expansão dos Cards Principais
  const [d20Expanded, setD20Expanded] = useState(false);
  const [akinatorExpanded, setAkinatorExpanded] = useState(false);

  // Estados do Jogo do Akinator
  const [gameStarted, setGameStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [contexto, setContexto] = useState(''); // 'individual', 'galera', 'date'
  const [filters, setFilters] = useState({
    vibe: '',
    restriction: '',
    sabor: '',
    alcool: '',
    perfil: ''
  });
  
  // Estados para armazenar os itens finais sorteados
  const [itemSugerido, setItemSugerido] = useState(null);
  const [shotSorteado, setShotSorteado] = useState(null);
  
  // Estado para controlar falha no carregamento da imagem do item sugerido
  const [imageError, setImageError] = useState(false);

  // Lista de doses clássicas fixas para o bônus final da galera
  const shotsPromocionais = [
    { name: "Hadouken", desc: "Uma explosão azul de sabor cítrico direto das mãos do Ryu para o seu copo." },
    { name: "Hemograma", desc: "Um drink de cor vermelha profunda e sabor intenso. Ideal para vampiros e healers." },
    { name: "Morpheus", desc: "A pílula azul ou a vermelha? Este drink te leva para além da Matrix de sabores." }
  ];

  const resetGame = () => {
    setStep(1);
    setContexto('');
    setFilters({ vibe: '', restriction: '', sabor: '', alcool: '', perfil: '' });
    setGameStarted(false);
    setShotSorteado(null);
    setItemSugerido(null);
    setImageError(false);
  };

  // Algoritmo de filtragem inteligente à prova de erros
  const processarSugestaoFinal = (filtrosFinais) => {
    const baseItems = allItems.filter(item => 
      !["hadouken", "hemograma", "morpheus"].includes(item.name?.toLowerCase())
    );

    const filtrarComParametros = (aplicarSabor, aplicarContexto, aplicarPerfil) => {
      return baseItems.filter(item => {
        if (filtrosFinais.vibe && item.atributos?.vibe !== filtrosFinais.vibe) return false;
        if (filtrosFinais.alcool === 'com' && !item.atributos?.restricao.includes('com-alcool')) return false;
        if (filtrosFinais.alcool === 'sem' && !item.atributos?.restricao.includes('sem-alcool')) return false;
        if (filtrosFinais.restriction === 'veggie' && !item.atributos?.restricao.includes('veggie')) return false;

        if (aplicarPerfil && filtrosFinais.perfil && item.atributos?.perfil !== filtrosFinais.perfil) return false;

        // Trava da cerveja para evitar que apareça nos outros paladares de drinks
        if (filtrosFinais.vibe === 'beber') {
          if (filtrosFinais.sabor === 'cerveja-foco') {
            if (item.atributos?.perfil !== 'cerveja') return false;
          } else {
            if (item.atributos?.perfil === 'cerveja') return false;
          }
        }

        if (aplicarContexto) {
          if (filtrosFinais.vibe === 'comer') {
            if (contexto === 'individual' && item.atributos?.tamanho !== 'individual') return false;
            if (contexto === 'galera' && item.atributos?.tamanho !== 'galera') return false;
            if (contexto === 'date' && item.atributos?.perfil !== 'porcao' && item.atributos?.perfil !== 'lanche') return false;
          }
          if (filtrosFinais.vibe === 'beber') {
            if (contexto === 'galera') {
              const ehCervejaCompartilhada = item.atributos?.perfil === 'cerveja' && item.atributos?.tamanho === 'galera';
              const ehBebidaDouble = item.name?.toLowerCase().includes("double") || item.name?.toLowerCase().includes("litrão");
              if (!ehCervejaCompartilhada && !ehBebidaDouble) return false;
            }
            if (contexto === 'individual') {
              if (item.atributos?.tamanho === 'galera' && item.atributos?.perfil === 'cerveja') return false;
              if (item.name?.toLowerCase().includes("double")) return false;
            }
            if (contexto === 'date' && item.atributos?.perfil !== 'drink') return false;
          }
        }

        if (aplicarSabor && filtrosFinais.sabor && filtrosFinais.sabor !== 'cerveja-foco') {
          if (Array.isArray(item.atributos?.sabor)) {
            if (!item.atributos.sabor.includes(filtrosFinais.sabor)) return false;
          } else {
            if (item.atributos?.sabor !== filtrosFinais.sabor) return false;
          }
        }

        return true;
      });
    };

    let candidatos = filtrarComParametros(true, true, true);
    if (candidatos.length === 0) candidatos = filtrarComParametros(false, true, true);
    if (candidatos.length === 0) candidatos = filtrarComParametros(false, false, true);
    if (candidatos.length === 0) candidatos = filtrarComParametros(false, false, false);
    
    if (candidatos.length === 0) {
      candidatos = baseItems.filter(item => {
        const nomeItem = item.name?.toLowerCase();
        if (filtrosFinais.vibe === 'comer') return nomeItem.includes("cheddar bomb com batata");
        if (filtrosFinais.vibe === 'beber') {
          if (filtrosFinais.sabor === 'cerveja-foco') return nomeItem.includes("litrão");
          return filtrosFinais.alcool === 'com' ? nomeItem === "caipirinha" : nomeItem === "laranja";
        }
        return nomeItem === "brownie com sorvete";
      });
    }

    const indiceSorteado = Math.floor(Math.random() * candidatos.length);
    setItemSugerido(candidatos[indiceSorteado]);
  };

  const finalizarJogo = (novoFiltro) => {
    const filtrosAtualizados = { ...filters, ...novoFiltro };
    setFilters(filtrosAtualizados);

    processarSugestaoFinal(filtrosAtualizados);

    if (filtrosAtualizados.vibe === 'beber' && contexto === 'galera') {
      const indiceAleatorio = Math.floor(Math.random() * shotsPromocionais.length);
      setShotSorteado(shotsPromocionais[indiceAleatorio]);
    }

    setStep(10);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-d20-fundo-light dark:bg-d20-fundo-dark transition-colors duration-500 font-sans text-zinc-800 dark:text-zinc-100"
    >
      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-d20-fundo-light/90 dark:bg-d20-fundo-dark/90 backdrop-blur-lg px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:zinc-800 shadow-sm transition-colors">
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
      <div className="p-6 pb-20 max-w-2xl mx-auto">
        <header className="mb-8 mt-4 text-left">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo flex items-center gap-2">
            Covil dos indecisos
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
            Dinâmicas e desafios do D20 Bar.
          </p>
        </header>

        <div className="space-y-6">
          
          {/* CARD 1: D20 CHALLENGE (RETRÁTIL) */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <button 
              onClick={() => setD20Expanded(!d20Expanded)}
              className="w-full text-left focus:outline-none block relative active:opacity-95 transition-opacity"
            >
              <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                <img src={bannerImg} alt="D20 Challenge Banner" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-zinc-900/80 backdrop-blur text-white p-2 rounded-full border border-zinc-700">
                  {d20Expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </button>

            <AnimatePresence>
              {d20Expanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4 border-t border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo flex items-center gap-2">
                      D20 Challenge: A Sorte está Lançada!
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

                      <div className="space-y-2 pt-2">
                        <p><strong>Confira a nossa Tabela de Sorte:</strong></p>
                        <p className="text-xs bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                          1. Olhar da Penitência | 2. Janken | 3. Azedim Tônica | 4. Carambolada | 5. Ametista | 6. Azra | 7. Dragão do Oeste | 8. Epoch | 9. João Ninguém | 10. Nuvem Voadora | 11. She Smash | 12. Tão Tão Distante | 13. Thanos | 14. Tijolo Não Revida | 15. Sharkboy | 16. Lavagirl | 17. Chico e Julieta | 18. Coffee Dynamite | 19. Lele Joe | 20. Dádiva dos Ninjas.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="bg-d20-amarelo/10 dark:bg-d20-amarelo/5 p-4 rounded-xl border border-d20-amarelo/20 text-center">
                        <span className="font-black text-d20-azul dark:text-d20-amarelo uppercase tracking-widest text-sm">
                          Valor: R$ 20,00 
                        </span>
                        <p className="text-[10px] uppercase opacity-60 mt-1">Preço único para qualquer drink do desafio</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CARD 2: ASSISTENTE DE PEDIDOS - AKINATOR (RETRÁTIL) */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <button 
              onClick={() => {
                setAkinatorExpanded(!akinatorExpanded);
                if(gameStarted) resetGame();
              }}
              className="w-full text-left focus:outline-none block relative active:opacity-95 transition-opacity"
            >
              <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                <img src={akinatorBannerImg} alt="Assistente de Pedidos Banner" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-zinc-900/80 backdrop-blur text-white p-2 rounded-full border border-zinc-700">
                  {akinatorExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </button>

            <AnimatePresence>
              {akinatorExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-4 border-t border-zinc-100 dark:border-zinc-800">
                    
                    {/* TELA INICIAL: EXPLICAÇÃO */}
                    {!gameStarted && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo flex items-center gap-2">
                          Não sabe o que pedir? Eu ajudo!
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                        A noite no D20 Bar acaba de ganhar uma missão épica. Invoque o nosso Gênio do Cardápio, o oráculo que sabe tudo sobre sabores e prazeres.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                        Funciona assim: ele vai te fazer perguntas-chave. Cada resposta sua molda o caminho. Ele não precisa saber seu nome, mas vai entender seu paladar como ninguém. O resultado final? O pedido que vai fazer sua noite memorável, escolhido sob medida para você.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                        Adivinhação ou pura matemática geek? Pouco importa. O importante é que o Gênio não erra.
                        </p>
                        <button 
                          onClick={() => setGameStarted(true)}
                          className="w-full bg-d20-azul dark:bg-d20-amarelo text-white dark:text-zinc-950 font-black uppercase tracking-tight p-4 rounded-xl shadow active:scale-[0.99] transition-all text-center"
                        >
                          Invocar o gênio
                        </button>
                      </div>
                    )}

                    {/* TELA DE PERGUNTAS NARRATIVAS ATIVAS */}
                    {gameStarted && step < 10 && (
                      <div className="space-y-4 py-2">
                        <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                          Assistente de Pedidos
                        </div>

                        {/* PERGUNTA 1: VIBE */}
                        {step === 1 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Se a sua noite fosse a cena de um filme agora, o que você estaria fazendo?</h3>
                            <button onClick={() => { setFilters({...filters, vibe: 'comer'}); setStep(2); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Devorando um prato caprichado enquanto coloca o papo em dia</button>
                            <button onClick={() => { setFilters({...filters, vibe: 'beber'}); setStep(2); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Brindando com um copo na mão para refrescar a conversa</button>
                            <button onClick={() => { setFilters({...filters, vibe: 'sobremesa'}); setStep(8); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Sabores de um momento doce para fechar o dia com chave de ouro</button>
                          </div>
                        )}

                        {/* PERGUNTA 2: CONTEXTO MESA */}
                        {step === 2 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Olhando ao seu redor, quem está dividindo essa jornada com você hoje?</h3>
                            <button onClick={() => { setContexto('individual'); setStep(filters.vibe === 'comer' ? 3 : 5); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Sou o protagonista solo dessa história por enquanto</button>
                            <button onClick={() => { setContexto('date'); setStep(filters.vibe === 'comer' ? 3 : 5); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">É uma atmosfera a dois, clima de casal ou de date</button>
                            <button onClick={() => { setContexto('galera'); setStep(filters.vibe === 'comer' ? 3 : 5); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Uma bancada inteira, vim para partilhar e curtir com o grupo</button>
                          </div>
                        )}

                        {/* PERGUNTA 3: RESTRIÇÃO COMIDA */}
                        {step === 3 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Na hora de escolher o prato, qual filosofia fala mais alto?</h3>
                            <button onClick={() => setStep(4)} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Quanto mais completo, com misturas marcantes, queijos e bacon, melhor</button>
                            <button onClick={() => { setFilters({...filters, restriction: 'veggie'}); setStep(4); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Prefiro focar no frescor e em receitas inteiramente sem carne</button>
                          </div>
                        )}

                        {/* PERGUNTA 4: SABOR COMIDA */}
                        {step === 4 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Se você pudesse traduzir o desejo da sua boca agora, seria:</h3>
                            <button onClick={() => finalizarJogo({ sabor: 'salgado' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Um clássico salgado, robusto e estruturado</button>
                            <button onClick={() => finalizarJogo({ sabor: 'agridoce' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Um toque de contraste, mesclando o salgado com notas adocicadas ou caramelizadas</button>
                          </div>
                        )}

                        {/* PERGUNTA 5: ÁLCOOL BEBIDA */}
                        {step === 5 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Como você planejou o ritmo e a energia da sua noite hoje?</h3>
                            <button onClick={() => { setFilters({...filters, alcool: 'com'}); setStep(6); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Quero um brinde com teor alcoólico para relaxar e descontrair da rotina</button>
                            <button onClick={() => { setFilters({...filters, alcool: 'sem'}); setStep(7); }} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Preciso manter o foco total, estou na direção ou prefiro algo bem leve</button>
                          </div>
                        )}

                        {/* PERGUNTA 6: SABORES COM ÁLCOOL */}
                        {step === 6 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Se o seu paladar pudesse escolher uma música agora, qual seria o ritmo?</h3>
                            <button onClick={() => finalizarJogo({ sabor: 'citrico' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Cítrico e dançante, daquelas misturas com limão ou gin que renovam os estoques de energia</button>
                            <button onClick={() => finalizarJogo({ sabor: 'doce' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Suave e envolvente, com notas mais doces ou frutadas</button>
                            <button onClick={() => finalizarJogo({ sabor: 'intenso' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Marcante e de respeito, focado em sabores profundos, runs, whisky puro ou vinho</button>
                            <button onClick={() => finalizarJogo({ sabor: 'amargo' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Complexo e encorpado, para quem curte aquele toque amargo clássico de aperitivos</button>
                            {contexto !== 'date' && (
                              <button onClick={() => finalizarJogo({ sabor: 'cerveja-foco' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm text-d20-azul dark:text-d20-amarelo">O tradicionalismo de boteco, apenas uma cerveja de garrafa trincando de gelada</button>
                            )}
                          </div>
                        )}

                        {/* PERGUNTA 7: SABORES SEM ÁLCOOL */}
                        {step === 7 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">Para se refrescar sem perder o compasso, qual caminho prefere tomar?</h3>
                            <button onClick={() => finalizarJogo({ perfil: 'suco' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Pelo caminho natural de um bom suco de fruta feito na hora</button>
                            <button onClick={() => finalizarJogo({ perfil: 'refrigerante' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Pelo lado clássico de um refrigerante ou a cremosidade de um milkshake</button>
                          </div>
                        )}

                        {/* PERGUNTA 8: SOBREMESAS */}
                        {step === 8 && (
                          <div className="space-y-2.5">
                            <h3 className="text-base font-bold text-zinc-700 dark:text-zinc-200 mb-3">No terreno dos doces, você se considera um explorador tradicional ou destemido?</h3>
                            <button onClick={() => finalizarJogo({ sabor: 'doce' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Tradicional: quero aquela doçura clássica e impecável que agrada a todos</button>
                            <button onClick={() => finalizarJogo({ sabor: 'agridoce' })} className="w-full bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-left transition text-sm">Destemido: aceito o desafio de quebrar as regras e experimentar doce misturado com bacon</button>
                          </div>
                        )}

                        {/* BOTÃO VOLTAR FLUXO */}
                        <button 
                          onClick={() => { if(step === 1) resetGame(); else setStep(1); }}
                          className="text-xs text-zinc-400 underline pt-2 block text-center mx-auto"
                        >
                          Voltar ao início
                        </button>
                      </div>
                    )}

                    {/* TELA DE RESULTADO FINAL */}
                    {step === 10 && (
                      <div className="space-y-5 py-2">
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                            Match Perfeito!
                          </span>
                          <h3 className="text-xl font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-100 mt-2">O seu pedido ideal é:</h3>
                        </div>

                        {/* EXIBIÇÃO DO ITEM SUGERIDO NO MODELO DE LISTA DE CARDÁPIO */}
                        {itemSugerido && (
                          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-4 shadow-inner flex flex-row gap-4 items-center">
                            
                            {/* ÁREA DA IMAGEM: QUADRADA FIXA COM FALLBACK SE NÃO TIVER FOTO OU SE DER ERRO */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                              {!itemSugerido.image || imageError ? (
                                <HelpCircle size={28} className="text-zinc-400 dark:text-zinc-500" />
                              ) : (
                                <img 
                                  src={itemSugerido.image} 
                                  alt={itemSugerido.name} 
                                  onError={() => setImageError(true)}
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            
                            {/* CONTEÚDO TEXTUAL À DIREITA */}
                            <div className="flex-1 flex flex-col justify-between h-full min-w-0">
                              <div className="space-y-0.5">
                                <h4 className="text-base font-black uppercase tracking-tight text-d20-azul dark:text-d20-amarelo truncate capitalize">{itemSugerido.name}</h4>
                                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-snug line-clamp-2">{itemSugerido.desc}</p>
                              </div>
                              <span className="text-base font-black text-d20-azul dark:text-d20-amarelo mt-1 block">R$ {itemSugerido.price}</span>
                            </div>
                          </div>
                        )}

                        {/* SUGESTÃO EXTRA DE APENAS UM SHOT ALEATÓRIO E SEM PREÇO */}
                        {filters.vibe === 'beber' && contexto === 'galera' && shotSorteado && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3 shadow-inner"
                          >
                            <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                              <span className="text-xs font-black uppercase tracking-widest bg-d20-azul dark:bg-d20-amarelo text-white dark:text-zinc-950 px-2 py-0.5 rounded">
                                Plus para a noite!
                              </span>
                              <span className="text-xs text-zinc-500 font-bold">Para animar a rodada da galera:</span>
                            </div>
                            
                            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <div className="space-y-0.5 w-full">
                                <span className="font-black text-sm text-zinc-800 dark:text-zinc-200 block">{shotSorteado.name}</span>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">{shotSorteado.desc}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* BOTÃO REINICIAR */}
                        <button 
                          onClick={resetGame} 
                          className="w-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold p-3.5 rounded-xl transition text-sm text-center"
                        >
                          Procurar Outro Pedido
                        </button>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

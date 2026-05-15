import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowLeft, Camera, Clock, CheckCircle2 } from 'lucide-react';
import Ranking from './Ranking';

const API_URL = 'https://script.google.com/macros/s/AKfycbwmgqWeOvVjekON-dyCwZsmI1sAinDyIGGEYz4f7SWXKO-vpyosJohSDI6rKznqq1eQ/exec'; 

export default function QuizPage({ darkMode, toggleTheme, onBack }) {
  const [equipe, setEquipe] = useState('');
  const [integrantes, setIntegrantes] = useState(''); // Novo Estado
  const [fotoBase64, setFotoBase64] = useState('');
  const [equipeRegistrada, setEquipeRegistrada] = useState(false);
  const [dadosQuiz, setDadosQuiz] = useState({ perguntaAtiva: null, status: 'FECHADO', tempoOriginal: 120, ranking: [] });
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [jaRespondeu, setJaRespondeu] = useState(false); 
  const [tempoRestante, setTempoRestante] = useState(120);
  const timerRef = useRef(null);

  useEffect(() => {
    setEquipe(localStorage.getItem('d20_equipe') || '');
    setIntegrantes(localStorage.getItem('d20_integrantes') || ''); // Recupera do cache
    setFotoBase64(localStorage.getItem('d20_foto') || '');
    setEquipeRegistrada(localStorage.getItem('d20_registrada') === 'true');
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL, { redirect: 'follow' });
      const data = await res.json();
      
      const versaoSalva = localStorage.getItem('d20_quiz_version');
      if (data.versaoQuiz && data.versaoQuiz !== versaoSalva) {
        localStorage.clear();
        localStorage.setItem('d20_quiz_version', data.versaoQuiz);
        setEquipe('');
        setIntegrantes('');
        setFotoBase64('');
        setEquipeRegistrada(false);
        setJaRespondeu(false);
        setResposta('');
        return;
      }

      setDadosQuiz(prev => {
        const novaPerguntaId = data.perguntaAtiva?.id;
        const respondidaID = localStorage.getItem('d20_last_responded_id');

        if (novaPerguntaId !== prev.perguntaAtiva?.id) {
          setTempoRestante(data.tempoOriginal || 120);
          setResposta('');
          if (novaPerguntaId && String(novaPerguntaId) === respondidaID) {
            setJaRespondeu(true);
          } else {
            setJaRespondeu(false);
          }
        }
        return data;
      });
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  }, []);

  useEffect(() => {
    if (dadosQuiz.status === 'ABERTO' && tempoRestante > 0 && !jaRespondeu && dadosQuiz.perguntaAtiva) {
      timerRef.current = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [dadosQuiz.status, tempoRestante, jaRespondeu, dadosQuiz.perguntaAtiva]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegistrarEquipe = async () => {
    if (!equipe.trim()) return;
    setLoading(true);
    try {
      const nomeJaExiste = dadosQuiz.ranking.some(
        (time) => time.nome.toLowerCase() === equipe.trim().toLowerCase()
      );

      if (nomeJaExiste) {
        alert("Ei Bobinho! 🤡 Já temos uma equipe com esse nome, escolha outro!");
        setLoading(false);
        return;
      }

      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          equipe: equipe.trim(), 
          integrantes: integrantes.trim(), // Envia os integrantes
          id: "REGISTRO", 
          foto: fotoBase64 
        })
      });
      setEquipeRegistrada(true);
      localStorage.setItem('d20_equipe', equipe.trim());
      localStorage.setItem('d20_integrantes', integrantes.trim());
      localStorage.setItem('d20_foto', fotoBase64);
      localStorage.setItem('d20_registrada', 'true');
    } catch (e) {
      alert("Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarResposta = async () => {
    if (!resposta || tempoRestante <= 0 || jaRespondeu) return;
    const idAtual = dadosQuiz.perguntaAtiva.id;
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ equipe, id: idAtual, resposta })
      });
      setJaRespondeu(true); 
      localStorage.setItem('d20_last_responded_id', String(idAtual));
      fetchData();
    } catch (e) {
      alert("Erro na resposta.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isQuizAberto = dadosQuiz.status === 'ABERTO';
  const mostrarPergunta = equipeRegistrada && isQuizAberto && dadosQuiz.perguntaAtiva && !jaRespondeu && tempoRestante > 0;

  return (
    <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen bg-d20-fundo-light dark:bg-d20-fundo-dark transition-colors duration-500">
      <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
        <div onClick={onBack} className="cursor-pointer text-d20-azul dark:text-d20-amarelo p-1">
          <ArrowLeft size={20} />
        </div>
        <span className="text-[16px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">D20 Game Experience</span>
        <button onClick={toggleTheme} className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full">
          {darkMode ? <Sun size={18} className="text-d20-amarelo" /> : <Moon size={18} className="text-d20-azul" />}
        </button>
      </header>

      <main className="p-6 pb-24 max-w-md mx-auto space-y-12">
        {!equipeRegistrada ? (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-d20-azul dark:text-d20-amarelo">Nova Equipe</h2>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Monte seu bando</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 space-y-6">
              <div className="flex justify-center">
                <label className="relative w-28 h-28 rounded-full bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-d20-amarelo">
                  {fotoBase64 ? (
                    <img src={fotoBase64} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center p-4">
                      <Camera size={24} className="text-zinc-300 mx-auto mb-1" />
                      <span className="text-[9px] uppercase font-black text-zinc-400">Subir Foto</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <div className="space-y-4">
                <input 
                  type="text"
                  value={equipe}
                  onChange={(e) => setEquipe(e.target.value)}
                  placeholder="Nome da sua equipe"
                  className="w-full py-2 px-0 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 text-center text-lg font-bold focus:border-d20-amarelo outline-none transition-all dark:text-white"
                />
                <input 
                  type="text"
                  value={integrantes}
                  onChange={(e) => setIntegrantes(e.target.value)}
                  placeholder="Membros (Ex: João, Maria, Leo)"
                  className="w-full py-2 px-0 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 text-center text-sm font-medium focus:border-d20-amarelo outline-none transition-all dark:text-zinc-300"
                />
              </div>
              <button 
                onClick={handleRegistrarEquipe} 
                disabled={loading || !equipe} 
                className="w-full bg-d20-azul dark:bg-d20-amarelo text-white dark:text-d20-azul py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Confirmar Equipe"}
              </button>
            </div>
          </section>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-d20-amarelo shadow-md flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                {fotoBase64 ? (
                  <img src={fotoBase64} alt={equipe} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-black text-d20-azul dark:text-d20-amarelo uppercase">
                    {equipe?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Equipe</p>
                <h3 className="text-base font-black text-d20-azul dark:text-d20-amarelo uppercase leading-tight">{equipe}</h3>
                {integrantes && (
                  <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 italic">
                    Integrantes: {integrantes}
                  </p>
                )}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-zinc-100 dark:bg-zinc-800" />
            <div className="text-right">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Status</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mostrarPergunta ? (
            <motion.section 
              key="pergunta" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="relative h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className={`absolute h-full left-0 ${tempoRestante < 15 ? 'bg-red-500' : 'bg-d20-amarelo'}`}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(tempoRestante / dadosQuiz.tempoOriginal) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              <div className="text-center -mt-4">
                <span className={`text-4xl font-black tabular-nums tracking-tighter ${tempoRestante < 15 ? 'text-red-500 animate-pulse' : 'text-d20-azul dark:text-zinc-100'}`}>
                  {formatTime(tempoRestante)}
                </span>
              </div>

              <div className="space-y-8 text-center">
                <h3 className="text-2xl font-black text-zinc-800 dark:text-white leading-tight uppercase tracking-tighter">
                  {dadosQuiz.perguntaAtiva.pergunta}
                </h3>
                
                <div className="grid gap-3">
                  {dadosQuiz.perguntaAtiva.ops.map((op, idx) => {
                    const letra = ['A', 'B', 'C', 'D'][idx];
                    const isSelected = resposta === letra;
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setResposta(letra)}
                        className={`group w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-5 ${
                          isSelected 
                          ? 'bg-d20-azul dark:bg-d20-amarelo border-transparent shadow-xl translate-x-2' 
                          : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        <div className={`w-10 h-8 rounded-lg flex items-center justify-center font-black text-lg transition-colors ${
                          isSelected ? 'bg-white/20 text-white dark:text-d20-azul' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                        }`}>
                          {letra}
                        </div>
                        <span className={`font-bold uppercase text-sm tracking-wide ${isSelected ? 'text-white dark:text-d20-azul' : 'text-zinc-600 dark:text-zinc-400'}`}>
                          {op}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={handleEnviarResposta} 
                  disabled={loading || !resposta} 
                  className="w-full bg-d20-azul dark:bg-d20-amarelo text-white dark:text-d20-azul py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                >
                  {loading ? "Processando..." : "Confirmar Resposta"}
                </button>
              </div>
            </motion.section>
          ) : equipeRegistrada && (
            <motion.section key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-1 text-center space-y-6">
              {jaRespondeu ? (
                <div className="space-y-1">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={48} className="animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black uppercase text-lg text-zinc-800 dark:text-white tracking-tighter">Resposta Enviada!</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-widest">Aguarde a próxima rodada...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 opacity-50">
                   <div className="w-12 h-12 border-4 border-zinc-300 border-t-d20-amarelo rounded-full animate-spin mx-auto" />
                   <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
                     {isQuizAberto ? "Preparando Pergunta..." : "Aguardando Início..."}
                   </p>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {equipeRegistrada && <Ranking dados={dadosQuiz.ranking} />}
      </main>
    </motion.div>
  );
}

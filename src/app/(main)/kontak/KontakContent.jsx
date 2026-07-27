'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mail, Cpu, Send, Instagram, Phone, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import TransitionEffect from '@/components/TransitionEffect'
import { useData } from '@/components/DataProvider'

const ContactButton = ({ icon, title, value, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-5 p-5 bg-[#0a0a0a] hover:bg-[#111] border border-white/10 hover:border-logo-red/50 rounded-2xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(232,69,77,0.15)] hover:-translate-y-1">
    <div className="absolute inset-0 bg-gradient-to-r from-logo-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="w-12 h-12 bg-black border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-logo-red group-hover:scale-110 transition-all z-10 shadow-inner">
      {icon}
    </div>
    <div className="z-10">
      <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-1">{title}</p>
      <p className="font-bold text-white tracking-wide group-hover:text-logo-red transition-colors">{value}</p>
    </div>
  </a>
)

const AnimatedRobot = ({ isSpeaking }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Body Container for floating animation */}
    <g>
      <animateTransform 
        attributeName="transform"
        type="translate"
        values="0,0; 0,-5; 0,0"
        dur="4s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
      />
      
      {/* Antenna */}
      <path d="M 50 25 L 50 10" fill="none" stroke="#666" strokeWidth="4" />
      <circle cx="50" cy="8" r="6" fill="#D3222A" filter="url(#glow)">
         <animate attributeName="opacity" values="1; 0.4; 1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Head Chassis */}
      <rect x="20" y="25" width="60" height="50" rx="16" fill="#222" stroke="#111" strokeWidth="3" />
      <rect x="25" y="30" width="50" height="40" rx="10" fill="#0a0a0a" />

      {/* Eyes */}
      <ellipse cx="38" cy="45" rx="5" ry="5" fill="#D3222A" filter="url(#glow)">
         <animate attributeName="ry" values="5; 0.5; 5; 5; 5; 5; 5" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="62" cy="45" rx="5" ry="5" fill="#D3222A" filter="url(#glow)">
         <animate attributeName="ry" values="5; 0.5; 5; 5; 5; 5; 5" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Mouth */}
      {isSpeaking ? (
        <path key="talking" d="M 40 60 Q 50 60 60 60" fill="none" stroke="#D3222A" strokeWidth="4" strokeLinecap="round" filter="url(#glow)">
           <animate attributeName="d" values="M 40 60 Q 50 60 60 60; M 40 60 Q 50 70 60 60; M 40 60 Q 50 55 60 60; M 40 60 Q 50 65 60 60" dur="0.3s" repeatCount="indefinite" />
        </path>
      ) : (
        <path key="idle" d="M 42 60 L 58 60" fill="none" stroke="#D3222A" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
      )}
    </g>

    {/* Left Arm */}
    <g>
      <animateTransform 
        attributeName="transform"
        type="rotate"
        values="0 15 50; 20 15 50; 0 15 50"
        dur="3s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
      />
      <rect x="5" y="45" width="12" height="30" rx="6" fill="#222" stroke="#111" strokeWidth="2" />
    </g>

    {/* Right Arm (Waving if speaking, idle if not) */}
    <g>
      {isSpeaking ? (
        <animateTransform 
          attributeName="transform"
          type="rotate"
          values="0 85 50; -40 85 50; 10 85 50; -30 85 50; 0 85 50"
          dur="1s"
          repeatCount="indefinite"
        />
      ) : (
        <animateTransform 
          attributeName="transform"
          type="rotate"
          values="0 85 50; -20 85 50; 0 85 50"
          dur="3.5s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
        />
      )}
      <rect x="83" y="45" width="12" height="30" rx="6" fill="#222" stroke="#111" strokeWidth="2" />
    </g>
  </svg>
)

const KontakContent = () => {
  const { configSitus } = useData()
  
  // Tab State
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'brief'

  // Brief Form State
  const [briefTitle, setBriefTitle] = useState('');
  const [briefName, setBriefName] = useState('');
  const [briefContact, setBriefContact] = useState('');
  const [briefConcept, setBriefConcept] = useState('');

  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hai! Aku Rexa, AI partner dari RFX Visual. Punya ide konsep apa hari ini buat project visual atau web kamu?' }
  ]);
  const [kueriAi, setKueriAi] = useState('');
  const [sedangKonsultasi, setSedangKonsultasi] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    let voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter(v => v.lang.startsWith('en-'));
    if (enVoices.length > 0) {
      utterance.voice = enVoices.find(v => v.name.includes('Google') || v.name.includes('Female')) || enVoices[0];
    }
    
    utterance.lang = 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.2;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const tanganiAi = async (e) => {
    e.preventDefault();
    if (!kueriAi.trim() || !window.puter) return;

    const newChat = [...chatHistory, { role: 'user', content: kueriAi }];
    setChatHistory(newChat);
    setKueriAi('');
    setSedangKonsultasi(true);

    try {
      const systemPrompt = `You are 'Rexa', a creative AI assistant from 'RFX Visual'. 
      Answer the user's prompt below. You MUST reply in JSON format with two fields:
      1. "englishSpeech": Your response translated perfectly into natural English (this will be spoken by an English TTS engine).
      2. "indonesianText": Your response in friendly, casual Indonesian using "aku/kamu" (this will be displayed as captions on screen).
      CRITICAL INSTRUCTION: DO NOT USE ANY EMOJIS in your response. Emojis will ruin the text-to-speech audio. No emojis allowed.
      Do not include markdown blocks like \`\`\`json, just return the raw JSON object.
      User Prompt: "${kueriAi}"`;

      const response = await window.puter.ai.chat(systemPrompt);
      
      let parsed = null;
      try {
        let cleanJson = (response.message?.content || response).replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } catch (err) {
        console.error("JSON parse error", err);
      }

      if (parsed && parsed.indonesianText && parsed.englishSpeech) {
        setChatHistory([...newChat, { role: 'ai', content: parsed.indonesianText }]);
        speakText(parsed.englishSpeech);
      } else {
        const fallbackId = "Wah, sirkuitku sedikit kepanasan. Bisa ulangi lagi?";
        setChatHistory([...newChat, { role: 'ai', content: fallbackId }]);
        speakText("Oh my, my circuits are a bit overheated. Could you repeat that?");
      }
    } catch (error) {
      console.log("Error Puter AI:", error);
      setChatHistory([...newChat, { role: 'ai', content: "Waduh, koneksi ke otak AI aku lagi gangguan nih." }]);
      speakText("Oops, my AI brain connection is disrupted right now.");
    } finally {
      setSedangKonsultasi(false);
    }
  };

  const handleBriefSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Brief: ${briefTitle || 'Untitled Project'}`);
    const body = encodeURIComponent(`PROD TITLE: ${briefTitle}\nDIRECTOR: ${briefName}\nCONTACT: ${briefContact}\n\nCONCEPT:\n${briefConcept}`);
    window.location.href = `mailto:${configSitus?.email || 'email@rfxvisual.my.id'}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <TransitionEffect />
      <main className="w-full min-h-screen bg-[#050505] text-white overflow-hidden relative flex flex-col pt-32 pb-12">
        {/* Ambient Background Lights */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-logo-red/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex-1 flex flex-col lg:flex-row gap-16 lg:gap-20 z-10 relative items-center lg:items-stretch">
          
          {/* LEFT SIDE: DIRECT LINE */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-center w-full max-w-lg lg:max-w-none"
          >
            {/* Studio REC Indicator */}
            <div className="flex items-center gap-3 mb-8 bg-white/5 w-max px-4 py-2 rounded-full border border-white/10">
              <div className="w-3 h-3 bg-logo-red rounded-full animate-pulse shadow-[0_0_10px_rgba(232,69,77,0.8)]" />
              <span className="font-mono text-logo-red text-xs tracking-widest font-bold">READY TO SHOOT</span>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-black uppercase tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
              LET'S<br/><span className="text-logo-red text-transparent bg-clip-text bg-gradient-to-br from-logo-red to-logo-red-dark">CREATE</span>
            </h1>
            
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
              <button 
                onClick={() => setActiveTab('direct')} 
                className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'direct' ? 'text-logo-red' : 'text-zinc-500 hover:text-white'}`}
              >
                Direct Line
                {activeTab === 'direct' && <div className="absolute -bottom-[17px] left-0 w-full h-[2px] bg-logo-red shadow-[0_0_10px_rgba(232,69,77,0.8)]" />}
              </button>
              <button 
                onClick={() => setActiveTab('brief')} 
                className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'brief' ? 'text-logo-red' : 'text-zinc-500 hover:text-white'}`}
              >
                Submit Brief
                {activeTab === 'brief' && <div className="absolute -bottom-[17px] left-0 w-full h-[2px] bg-logo-red shadow-[0_0_10px_rgba(232,69,77,0.8)]" />}
              </button>
            </div>

            <div className="w-full relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'direct' ? (
                  <motion.div 
                    key="direct"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <p className="text-zinc-400 font-medium text-base sm:text-lg mb-4 max-w-md leading-relaxed">
                      Punya ide visual gila atau butuh diskusi mahakarya sinematik? Studio kami siap mengeksekusi konsep Anda menjadi realita.
                    </p>
                    <ContactButton 
                      icon={<Mail className="w-5 h-5" />} 
                      title="Email Studio" 
                      value={configSitus?.email || "email@rfxvisual.my.id"} 
                      link={`mailto:${configSitus?.email || 'email@rfxvisual.my.id'}`} 
                    />
                    <ContactButton 
                      icon={<Instagram className="w-5 h-5" />} 
                      title="Instagram" 
                      value="@rfx.visual" 
                      link="https://instagram.com/rfx.visual" 
                    />
                    <ContactButton 
                      icon={<Phone className="w-5 h-5" />} 
                      title="WhatsApp" 
                      value="Konsultasi Proyek" 
                      link="https://wa.me/" 
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="brief"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {/* Clapperboard Form */}
                    <div className="w-full bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      
                      {/* Clapperboard Hinge (Top Pattern) */}
                      <div className="w-full h-10 border-b border-white/20 relative flex items-center justify-between px-4" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 20px, #111 20px, #111 40px)' }}>
                        <div className="w-4 h-4 rounded-full bg-zinc-300 border-2 border-zinc-500 shadow-inner flex items-center justify-center">
                          <div className="w-1 h-1 bg-black rounded-full" />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-zinc-300 border-2 border-zinc-500 shadow-inner flex items-center justify-center">
                          <div className="w-1 h-1 bg-black rounded-full" />
                        </div>
                      </div>
                      
                      <form onSubmit={handleBriefSubmit} className="p-6 flex flex-col gap-5 font-mono">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-white/20 pb-3">
                          <div className="flex-1">
                            <label className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold">PROD. TITLE</label>
                            <input 
                              type="text" 
                              value={briefTitle} onChange={e => setBriefTitle(e.target.value)} required
                              placeholder="Project Name..." 
                              className="bg-transparent text-white text-xl sm:text-2xl font-bold uppercase focus:outline-none w-full placeholder:text-zinc-700" 
                            />
                          </div>
                          <div className="text-left sm:text-right">
                            <label className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold">DATE</label>
                            <div className="text-white text-sm font-bold">{new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-white/20 pb-4 pt-2">
                          <div>
                            <label className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold block mb-1">DIRECTOR (YOUR NAME)</label>
                            <input 
                              type="text" 
                              value={briefName} onChange={e => setBriefName(e.target.value)} required
                              placeholder="Name..." 
                              className="bg-transparent text-white focus:outline-none w-full text-sm border-b border-white/5 py-1 focus:border-logo-red transition-colors" 
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold block mb-1">CONTACT (EMAIL/WA)</label>
                            <input 
                              type="text" 
                              value={briefContact} onChange={e => setBriefContact(e.target.value)} required
                              placeholder="Contact Info..." 
                              className="bg-transparent text-white focus:outline-none w-full text-sm border-b border-white/5 py-1 focus:border-logo-red transition-colors" 
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-[10px] uppercase text-zinc-500 tracking-widest font-bold block mb-2">SCENE DESCRIPTION (CONCEPT)</label>
                          <textarea 
                            value={briefConcept} onChange={e => setBriefConcept(e.target.value)} required
                            placeholder="Tell us your vision..." 
                            className="bg-[#111] border border-white/10 rounded-lg w-full h-24 p-3 text-white text-sm focus:outline-none focus:border-logo-red resize-none transition-colors" 
                          />
                        </div>

                        <button type="submit" className="mt-4 bg-white text-black font-bold font-display uppercase tracking-[0.2em] py-3 sm:py-4 rounded-lg hover:bg-logo-red hover:text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(232,69,77,0.4)] active:scale-95">
                          ACTION! (SEND BRIEF)
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT SIDE: REXA AI TERMINAL */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-6/12 h-[600px] lg:h-auto min-h-[500px] flex flex-col relative mt-10 lg:mt-0"
          >
            <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-20">
              
              {/* Terminal Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-logo-red/50 flex items-center justify-center bg-[#050505] relative shadow-[0_0_25px_rgba(232,69,77,0.4)] z-30 overflow-hidden shrink-0">
                    <AnimatedRobot isSpeaking={isSpeaking} />
                    <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 sm:border-4 border-[#0a0a0a] rounded-full shadow-lg" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white tracking-wider text-lg">REXA AI</h3>
                    <p className="text-[10px] text-logo-red font-mono tracking-widest uppercase">Creative Partner • Online</p>
                  </div>
                </div>
                <Cpu className="w-6 h-6 text-white/10" />
              </div>

              {/* Chat History */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 bg-[url('/bg-noise.png')]">
                <AnimatePresence>
                  {chatHistory.map((chat, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex w-full ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 text-sm sm:text-base leading-relaxed shadow-lg ${
                        chat.role === 'user' 
                        ? 'bg-gradient-to-br from-logo-red to-logo-red-dark text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-[#111] border border-white/10 text-zinc-300 rounded-2xl rounded-tl-sm'
                      }`}>
                        {chat.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {sedangKonsultasi && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                    <div className="bg-[#111] border border-white/10 rounded-2xl rounded-tl-sm p-5 flex gap-2 items-center">
                      <div className="w-2 h-2 bg-logo-red rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-logo-red rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-logo-red rounded-full animate-bounce delay-200" />
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} className="h-2" />
              </div>

              {/* Chat Input */}
              <form onSubmit={tanganiAi} className="p-4 sm:p-5 bg-black/60 border-t border-white/10 flex gap-3 relative backdrop-blur-lg">
                <input 
                  type="text" 
                  value={kueriAi}
                  onChange={e => setKueriAi(e.target.value)}
                  disabled={sedangKonsultasi}
                  placeholder="Ketik ide visual kamu..."
                  className="flex-1 bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-logo-red transition-colors placeholder:text-zinc-600 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={!kueriAi.trim() || sedangKonsultasi}
                  className="bg-logo-red hover:bg-logo-red-dark disabled:opacity-50 disabled:hover:bg-logo-red px-5 rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(232,69,77,0.3)] hover:shadow-[0_0_20px_rgba(232,69,77,0.6)]"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>

            {/* Decorative Frame Behind Terminal (Desktop Only) */}
            <div className="absolute top-6 -right-6 w-full h-full border-2 border-white/5 rounded-[2rem] z-10 pointer-events-none hidden lg:block" />
          </motion.div>

        </div>
      </main>
    </>
  )
}

export default KontakContent;

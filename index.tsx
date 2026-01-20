
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Constants & Data ---
const BEHANCE_URL = "https://www.behance.net/Leo_dob";
const HERO_IMAGE_URL = "https://raw.githubusercontent.com/leo-dob/L1/refs/heads/main/image/IMG-20260111-WA0028.jpg?token=GHSAT0AAAAAADS72ZCQEH7W3IOLWJ4JVXME2LFAITQ";
const FOOTER_BG_IMAGE = "https://raw.githubusercontent.com/leo-dob/L1/refs/heads/main/image/IMG-20260111-WA0028.jpg";

const SERVICES = [
  {
    id: "01",
    title: "Brand Architecture",
    description: "Разработка уникальной идентичности бренда. От концептуальных логотипов до комплексных систем визуального авторитета.",
  },
  {
    id: "02",
    title: "Digital Experience",
    description: "Проектирование интерфейсов, где эстетика встречается с психологией пользователя. Веб-дизайн и UX стратегии.",
  },
  {
    id: "03",
    title: "Ad Production",
    description: "Высокоэффективные визуальные коммуникации. Упаковка и креативы, которые работают на результат.",
  }
];

const PROJECTS = [
  { 
    id: 1, 
    title: "Monochrome Studio", 
    category: "Identity", 
    img: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&q=80&w=1200",
  },
  { 
    id: 2, 
    title: "Eco Essence", 
    category: "Packaging", 
    img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200",
  },
  { 
    id: 3, 
    title: "Fintech Interface", 
    category: "UI/UX Design", 
    img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1200",
  },
  { 
    id: 4, 
    title: "Vanguard Poster", 
    category: "Advertising", 
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
  }
];

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAsk = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage("");
    setChat(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Вы — Leo Dob, профессиональный визуальный дизайнер. Отвечайте кратко и стильно. Пользователь спрашивает: ${userMsg}`,
      });
      const aiText = response.text || "Извините, я сейчас занят проектированием нового концепта.";
      setChat(prev => [...prev, { role: "leo", text: aiText }]);
    } catch (error) {
      setChat(prev => [...prev, { role: "leo", text: "Произошла ошибка. Напишите мне в Telegram!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-white/90 backdrop-blur-2xl border border-black/5 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-slide-up">
          <div className="p-6 bg-black text-white flex justify-between items-center">
            <h3 className="text-sm font-bold tracking-widest uppercase">Consult Leo AI</h3>
            <button onClick={() => setIsOpen(false)} className="opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-[10px] uppercase font-bold tracking-widest text-blue-500 animate-pulse">Processing...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-neutral-100 flex gap-2">
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Спросите о дизайне..."
              className="flex-1 bg-neutral-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button onClick={handleAsk} className="bg-black text-white p-2 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
      </button>
    </div>
  );
};

const PortfolioApp = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-8 py-8 flex justify-between items-center transition-all duration-500">
        <div className="text-xl font-extrabold tracking-tighter text-white drop-shadow-lg">LEO.DOB</div>
        <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
          <a href="#services" className="hover:text-white transition-colors">Expertise</a>
          <a href="#work" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#contact" className="hover:text-white transition-colors">Connect</a>
        </div>
        <div className="text-[10px] font-bold text-white bg-blue-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          DESIGNER FOR HIRE
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center p-8 overflow-hidden visible">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE_URL} 
            alt="Leo Dob Background" 
            className="w-full h-full object-cover scale-105 filter brightness-90"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-6">
             <span className="w-10 h-[2px] bg-blue-500"></span>
             <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] drop-shadow-md">Senior Visual Architect</span>
          </div>
          <h1 className="text-white text-[12vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter mb-8 drop-shadow-2xl">
            PURE<br/>INTENT.
          </h1>
          <p className="text-white/80 max-w-lg text-lg md:text-xl leading-relaxed font-medium mb-10 drop-shadow-lg">
            Я создаю визуальные системы, которые превращают хаос в порядок, а бизнес — в узнаваемый символ современности.
          </p>
          <div className="flex flex-wrap gap-6">
              <a href={BEHANCE_URL} target="_blank" className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl">
                Behance Portfolio
              </a>
              <a href="#work" className="bg-transparent border border-white/30 text-white backdrop-blur-md px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                Selected Work
              </a>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section id="services" className="bg-white py-40 px-8 md:px-20 relative z-20">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-black tracking-[0.4em] uppercase text-blue-600 mb-12">Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {SERVICES.map((s) => (
                <div key={s.id} className="group border-t border-neutral-100 pt-12">
                  <span className="text-[10px] font-bold text-neutral-300 mb-6 block uppercase tracking-widest">{s.id}</span>
                  <h3 className="text-3xl font-bold mb-6 tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                  <p className="text-neutral-500 leading-relaxed font-medium">{s.description}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="bg-[#f8f8f8] py-40 px-8 md:px-20 relative z-20">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-7xl md:text-[10vw] font-black tracking-tighter text-neutral-950 mb-24 opacity-10">WORKS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {PROJECTS.map((p, idx) => (
                <div key={p.id} className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-40' : ''}`}>
                  <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200 mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-700">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 block mb-2">{p.category}</span>
                    <h4 className="text-3xl font-bold tracking-tight text-neutral-950">{p.title}</h4>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Contact Section / Footer with requested Background Image */}
      <section id="contact" className="relative min-h-[80vh] flex items-center bg-black text-white py-40 px-8 md:px-20 relative z-20 overflow-hidden">
        {/* Footer Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={FOOTER_BG_IMAGE} 
            alt="Leo Dob Contact Background" 
            className="w-full h-full object-cover opacity-60 filter brightness-50 contrast-125"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 drop-shadow-2xl">
                LET'S DESIGN<br/>THE FUTURE.
              </h2>
              <div className="space-y-6">
                <a href="mailto:hello@leodob.design" className="block text-2xl font-bold text-white/60 hover:text-blue-500 transition-colors drop-shadow-md">hello@leodob.design</a>
                <a href="https://t.me/leo_dob" className="block text-2xl font-bold text-white/60 hover:text-blue-500 transition-colors drop-shadow-md">@leo_dob</a>
              </div>
            </div>
            
            {/* Functional VCard with blur effect */}
            <div className="bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-bold mb-2 uppercase tracking-tighter text-white">Leo Dob</h3>
                  <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Visual Architect</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black text-xs text-white">LD</div>
              </div>
              <p className="text-neutral-300 mb-10 text-lg leading-relaxed">Специализируюсь на визуальном языке премиум брендов и высокотехнологичных интерфейсах. Работаю удаленно по всему миру.</p>
              <div className="flex flex-col gap-4">
                <a href={BEHANCE_URL} target="_blank" className="w-full bg-white text-black py-5 rounded-xl text-center font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg">View Full Behance Portfolio</a>
                <div className="flex gap-4">
                  <a href="https://t.me/leo_dob" target="_blank" className="flex-1 bg-white/10 border border-white/20 py-5 rounded-xl text-center font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all text-white">Telegram DM</a>
                  <button onClick={() => window.print()} className="flex-1 bg-white/10 border border-white/20 py-5 rounded-xl text-center font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all text-white">Save Contact</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIChat />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<PortfolioApp />);

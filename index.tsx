
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Константы и Данные ---
const BEHANCE_URL = "https://www.behance.net/Leo_dob";

const SERVICES = [
  {
    id: "01",
    title: "Брендинг и Логотипы",
    description: "Разработка уникальной визуальной стратегии. От идеи логотипа до создания полноценного гайдбука, который выделит ваш бизнес.",
    tags: ["Логотипы", "Айдентика", "Стратегия"]
  },
  {
    id: "02",
    title: "Веб-дизайн и Digital",
    description: "Создание адаптивных сайтов с акцентом на удобство пользователя (UX). Интерфейсы, которые превращают посетителей в клиентов.",
    tags: ["Лэндинги", "Корпоративные сайты", "E-com"]
  },
  {
    id: "03",
    title: "Графический дизайн",
    description: "Оформление упаковки, полиграфии и рекламных материалов. Визуальные коммуникации, которые говорят сами за себя.",
    tags: ["Упаковка", "Полиграфия", "Реклама"]
  }
];

const PROJECTS = [
  { 
    id: 1, 
    title: "Minimal Studio Identity", 
    category: "Айдентика", 
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1200",
    description: "Минималистичный фирменный стиль для креативного агентства.",
    link: BEHANCE_URL
  },
  { 
    id: 2, 
    title: "Eco-Friendly Brand", 
    category: "Упаковка", 
    img: "https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?auto=format&fit=crop&q=80&w=1200",
    description: "Разработка дизайна упаковки для натуральной косметики.",
    link: BEHANCE_URL
  },
  { 
    id: 3, 
    title: "Future Digital Interface", 
    category: "Веб-разработка", 
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    description: "Современная платформа для управления активами.",
    link: BEHANCE_URL
  },
  { 
    id: 4, 
    title: "Bold Typography Poster", 
    category: "Графика", 
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    description: "Экспериментальная типографика для выставочного проекта.",
    link: BEHANCE_URL
  }
];

// --- Компоненты ---

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setMessage("");
    setChat(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "Вы — ассистент дизайнера LEO.DOB. Вы отвечаете вежливо, профессионально и вдохновляюще. Акцентируйте внимание на создании фирменного стиля, логотипов и современных сайтов. Портфолио находится на Behance (Leo_dob). Используйте слова: чистый дизайн, эстетика, функциональность.",
        },
      });
      setChat(prev => [...prev, { role: "ai", text: response.text || "Извините, я задумался о новом концепте. Повторите ваш вопрос!" }]);
    } catch (e) {
      setChat(prev => [...prev, { role: "ai", text: "Произошла техническая заминка. Пожалуйста, попробуйте позже." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="bg-white border border-neutral-200 w-[320px] md:w-[380px] h-[500px] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">LEO.DOB AI</p>
              <p className="text-[9px] text-neutral-400 uppercase">Ваш дизайн-консультант</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-400 transition-all">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            <div className="bg-neutral-50 p-4 rounded-2xl text-[13px] text-neutral-700 leading-relaxed italic border border-neutral-100">
              Привет! Я помогу вам узнать больше о моих услугах в области графического дизайна и брендинга. Что вас интересует?
            </div>
            {chat.map((c, i) => (
              <div key={i} className={`text-[13px] p-4 rounded-2xl leading-relaxed ${c.role === 'user' ? 'bg-neutral-900 text-white ml-8 shadow-md' : 'bg-neutral-100 text-neutral-800 mr-8 border border-neutral-200'}`}>
                {c.text}
              </div>
            ))}
            {loading && <div className="flex gap-1.5 p-2"><div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-150"></div></div>}
          </div>
          <div className="p-4 bg-white border-t border-neutral-100 flex gap-2">
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Спросить о проекте..."
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm flex-1 outline-none focus:border-neutral-900 transition-all"
            />
            <button onClick={handleAsk} className="bg-neutral-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-all text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      )}
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 px-6 md:px-16 py-8 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-white/10">
    <div className="text-2xl font-black tracking-tighter text-neutral-900">LEO.DOB</div>
    <div className="hidden md:flex gap-8 items-center text-[11px] uppercase tracking-widest font-bold text-neutral-500">
      <a href="#work" className="hover:text-black transition-colors">Портфолио</a>
      <a href="#services" className="hover:text-black transition-colors">Компетенции</a>
      <a href="#contact" className="px-6 py-2.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-all shadow-lg shadow-neutral-900/10">Обсудить проект</a>
    </div>
  </nav>
);

const Hero = () => (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden bg-white">
    {/* Стильный баннер на фоне */}
    <div className="absolute top-0 right-0 w-full md:w-[60%] h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <img 
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000" 
        className="w-full h-full object-cover opacity-40 scale-110 animate-pulse duration-[10000ms]"
        alt="Design Background"
      />
      <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-indigo-100 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[10%] right-[30%] w-80 h-80 bg-neutral-200 rounded-full blur-[100px] opacity-40" />
    </div>

    <div className="max-w-7xl mx-auto w-full relative z-10">
      <div className="mb-6 animate-slide-up">
        <div className="inline-flex items-center gap-3">
          <span className="w-12 h-[1px] bg-neutral-300"></span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-black">GRAPHIC & WEB SOLUTIONS</span>
        </div>
      </div>
      
      <h1 className="text-[14vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter text-neutral-900 mb-10 animate-slide-up">
        Эстетика <br /> 
        <span className="text-neutral-300 transition-colors hover:text-neutral-900 cursor-default duration-500">через функцию.</span>
      </h1>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <p className="max-w-lg text-lg md:text-2xl text-neutral-500 font-medium leading-tight">
          Создаю фирменные стили, которые запоминаются, и интерфейсы, которые <span className="text-neutral-900 italic">работают на ваш бизнес.</span>
        </p>
        
        {/* Нормальная кнопка портфолио с превью */}
        <a href="#work" className="group relative flex items-center p-1 pr-8 bg-neutral-50 rounded-full border border-neutral-200 hover:border-neutral-900 transition-all duration-500">
           <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
             <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=60&w=200" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold leading-none mb-1">Explore</span>
             <span className="text-xs uppercase tracking-widest text-neutral-900 font-black leading-none">Портфолио →</span>
           </div>
        </a>
      </div>
    </div>

    {/* Декоративный элемент в углу */}
    <div className="absolute bottom-12 left-12 hidden md:block opacity-20">
      <p className="text-[10px] font-mono rotate-90 origin-left tracking-widest">SCROLL TO DISCOVER — 2025</p>
    </div>
  </section>
);

const ServiceSection = () => (
  <section id="services" className="py-32 px-6 md:px-20 bg-neutral-50">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
        <div>
          <h2 className="text-xs uppercase tracking-widest font-black text-neutral-400 mb-4">Направления работы</h2>
          <p className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">Как я помогаю <br/> вашему бренду.</p>
        </div>
        <p className="max-w-xs text-neutral-500 text-sm leading-relaxed">
          Каждый проект — это глубокое погружение в смыслы и визуальный аудит вашего рынка.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SERVICES.map((s) => (
          <div key={s.id} className="group p-10 bg-white border border-neutral-100 rounded-[2.5rem] hover:bg-neutral-900 transition-all duration-700 hover:-translate-y-2">
            <span className="text-neutral-300 group-hover:text-neutral-700 font-black text-2xl mb-8 block transition-colors">{s.id}</span>
            <h3 className="text-2xl font-bold mb-4 text-neutral-900 group-hover:text-white transition-colors">{s.title}</h3>
            <p className="text-neutral-500 group-hover:text-neutral-400 text-sm leading-relaxed mb-10 transition-colors">{s.description}</p>
            <div className="flex flex-wrap gap-2">
              {s.tags.map(tag => (
                <span key={tag} className="text-[9px] uppercase tracking-widest px-3 py-1.5 bg-neutral-50 group-hover:bg-white/10 border border-neutral-100 group-hover:border-white/10 text-neutral-400 group-hover:text-white rounded-full transition-all">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Portfolio = () => (
  <section id="work" className="py-32 px-6 md:px-20 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="mb-24 flex flex-col md:flex-row items-baseline gap-6">
        <h2 className="text-6xl md:text-9xl font-black text-neutral-900 tracking-tighter">КЕЙСЫ</h2>
        <div className="w-16 h-[2px] bg-neutral-200 hidden md:block"></div>
        <p className="text-neutral-400 text-lg italic">Баланс формы и контента.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
        {PROJECTS.map((project, i) => (
          <a 
            key={project.id} 
            href={project.link} 
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="overflow-hidden rounded-[3rem] aspect-[4/5] bg-neutral-100 relative shadow-sm group-hover:shadow-3xl transition-all duration-700">
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
              />
              <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
                   <p className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-70">Посмотреть проект</p>
                   <p className="text-sm font-medium">Behance Case Study</p>
                 </div>
              </div>
            </div>
            <div className="mt-10 px-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 block font-black">{project.category}</span>
              <h4 className="text-3xl text-neutral-900 font-bold group-hover:underline decoration-neutral-200 underline-offset-8 transition-all">{project.title}</h4>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-32 text-center">
        <a href={BEHANCE_URL} target="_blank" className="group relative inline-flex items-center px-12 py-5 overflow-hidden font-bold rounded-full border-2 border-neutral-900 hover:text-white transition-all duration-300">
          <span className="absolute inset-0 w-full h-full bg-neutral-900 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          <span className="relative">БОЛЬШЕ РАБОТ НА BEHANCE</span>
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="py-32 px-6 md:px-20 bg-neutral-900 text-white rounded-t-[4rem]">
    <div className="max-w-7xl mx-auto text-center">
      <span className="text-neutral-500 text-[10px] uppercase tracking-[0.5em] mb-8 block font-black animate-pulse">AVAILABLE FOR FREELANCE</span>
      <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-20 leading-none">Готовы начать <br/> историю?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <a href="https://t.me/Leo_dob" className="group p-10 border border-neutral-800 rounded-[2.5rem] hover:bg-white hover:text-neutral-900 transition-all duration-500">
          <p className="text-[10px] uppercase tracking-widest mb-3 opacity-40 group-hover:opacity-100 transition-opacity">Telegram</p>
          <p className="text-2xl font-bold tracking-tight">@Leo_dob</p>
        </a>
        <a href="mailto:hello@leo-dob.design" className="group p-10 border border-neutral-800 rounded-[2.5rem] hover:bg-white hover:text-neutral-900 transition-all duration-500">
          <p className="text-[10px] uppercase tracking-widest mb-3 opacity-40 group-hover:opacity-100 transition-opacity">Email</p>
          <p className="text-2xl font-bold tracking-tight">hello@leo.design</p>
        </a>
        <a href={BEHANCE_URL} className="group p-10 border border-neutral-800 rounded-[2.5rem] hover:bg-white hover:text-neutral-900 transition-all duration-500">
          <p className="text-[10px] uppercase tracking-widest mb-3 opacity-40 group-hover:opacity-100 transition-opacity">Portfolio</p>
          <p className="text-2xl font-bold tracking-tight">Behance</p>
        </a>
      </div>

      <div className="pt-20 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
        <p>© 2025 LEO.DOB DESIGN. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
        <div className="flex gap-6">
           <span className="hover:text-white transition-colors cursor-pointer">PRIVACY</span>
           <span className="hover:text-white transition-colors cursor-pointer">TERMS</span>
        </div>
        <p>СДЕЛАНО С ЭСТЕТИКОЙ В СЕРДЦЕ.</p>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <main className="bg-white min-h-screen text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <Navbar />
      <Hero />
      <ServiceSection />
      <Portfolio />
      <Footer />
      <AIChat />
    </main>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

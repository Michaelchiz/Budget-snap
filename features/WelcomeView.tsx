import React, { useState } from 'react';
import { Button, Input } from '../components/UIComponents';
import { UserSession } from '../types';
import { ArrowRight, Wallet, Apple, Clock, Check } from 'lucide-react';

interface Props {
  onComplete: (session: UserSession) => void;
}

export const WelcomeView: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<'slides' | 'login'>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [name, setName] = useState('');

  const slides = [
    {
      icon: <Wallet size={48} className="text-[#22c55e]" />,
      title: "Track Your Budget",
      desc: "Never overspend again. Plan your market runs and see exactly what you can afford."
    },
    {
      icon: <Apple size={48} className="text-[#22c55e]" />,
      title: "Survive Longer",
      desc: "Our pantry tracker helps you calculate exactly how many days your food will last."
    },
    {
      icon: <Clock size={48} className="text-[#22c55e]" />,
      title: "Cook Smart",
      desc: "Don't know what to cook? AI Chef suggests meals based on what you already have."
    }
  ];

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    } else {
      setStep('login');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    // Simulate login
    onComplete({
      hasOnboarded: true,
      isLoggedIn: true,
      name: name
    });
  };

  if (step === 'login') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-sm space-y-8">
           <div className="text-center space-y-2">
             <div className="w-16 h-16 bg-[#22c55e] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(34,197,94,0.4)]">
                <span className="text-2xl font-bold text-[#052e16]">BS</span>
             </div>
             <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
             <p className="text-slate-400">Enter your details to sync your budget.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                label="First Name" 
                placeholder="e.g. Alex" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input 
                label="Email (Optional)" 
                placeholder="alex@example.com" 
                type="email"
              />
              <div className="pt-4">
                 <Button fullWidth size="lg">Start Planning</Button>
              </div>
           </form>
           
           <p className="text-center text-xs text-slate-500">
             By continuing, you agree to survive within your budget.
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 z-10">
        <div className="relative">
           <div className="absolute inset-0 bg-[#22c55e]/20 blur-3xl rounded-full" />
           <div className="w-24 h-24 bg-[#15221d] border border-[#2a3d35] rounded-3xl flex items-center justify-center relative shadow-xl">
              {slides[slideIndex].icon}
           </div>
        </div>
        
        <div className="space-y-4 max-w-xs animate-in slide-in-from-right-8 duration-300 key={slideIndex}">
          <h2 className="text-3xl font-bold text-white">{slides[slideIndex].title}</h2>
          <p className="text-slate-400 leading-relaxed">{slides[slideIndex].desc}</p>
        </div>
      </div>

      <div className="z-10 mt-auto space-y-6">
        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-8 bg-[#22c55e]' : 'w-2 bg-[#2a3d35]'}`} 
            />
          ))}
        </div>

        <Button fullWidth size="lg" onClick={handleNextSlide}>
          {slideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          {slideIndex !== slides.length - 1 && <ArrowRight size={18} className="ml-2"/>}
        </Button>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </div>
  );
};

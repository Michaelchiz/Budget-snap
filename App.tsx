import React, { useState, useEffect } from 'react';
import { Wallet, Calendar, ChefHat, Home } from 'lucide-react';
import { AppView, UserSession } from './types';
import { StorageService } from './services/storage';
import { BudgetView } from './features/BudgetView';
import { CalendarView } from './features/CalendarView';
import { ChefView } from './features/ChefView';
import { WelcomeView } from './features/WelcomeView';
import { DashboardView } from './features/DashboardView';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>(StorageService.getSession());
  const [activeTab, setActiveTab] = useState<AppView>('dashboard');

  // Initial redirect based on auth
  useEffect(() => {
    if (!session.hasOnboarded) {
      setActiveTab('welcome');
    }
  }, []);

  const handleOnboardingComplete = (newSession: UserSession) => {
    setSession(newSession);
    StorageService.saveSession(newSession);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'welcome': 
         return <WelcomeView onComplete={handleOnboardingComplete} />;
      case 'dashboard': 
         return <DashboardView 
            budget={StorageService.getBudget()} 
            foods={StorageService.getFoods()} 
            onNavigate={setActiveTab} 
            userName={session.name || 'Student'}
         />;
      case 'budget': return <BudgetView />;
      case 'calendar': return <CalendarView />;
      case 'chef': return <ChefView />;
      default: return <DashboardView budget={StorageService.getBudget()} foods={StorageService.getFoods()} onNavigate={setActiveTab} userName={session.name} />;
    }
  };

  if (activeTab === 'welcome') {
    return (
      <div className="min-h-screen bg-[#0c1612] max-w-md mx-auto shadow-2xl relative overflow-hidden">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1612] flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header is handled inside individual views for custom layouts */}
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto no-scrollbar pt-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#15221d]/95 backdrop-blur-md border-t border-[#2a3d35] pb-safe fixed bottom-0 w-full max-w-md z-30">
        <div className="flex justify-around items-center h-20 px-2">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<Home size={24} />} 
            label="Home" 
          />
          <NavButton 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')} 
            icon={<Wallet size={24} />} 
            label="Budget" 
          />
          
          {/* Center FAB Style Button */}
          <div className="-mt-8">
            <button 
                onClick={() => setActiveTab('chef')}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] transition-transform active:scale-95 ${activeTab === 'chef' ? 'bg-[#22c55e] text-[#052e16]' : 'bg-[#1a2e26] text-[#22c55e] border border-[#22c55e]/30'}`}
            >
                <ChefHat size={28} />
            </button>
          </div>

          <NavButton 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
            icon={<Calendar size={24} />} 
            label="Pantry" 
          />
          <NavButton 
            active={false} 
            onClick={() => {}} 
            icon={<div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" /></div>} 
            label="Profile" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-14 transition-colors duration-200 ${active ? 'text-[#22c55e]' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>
        {icon}
    </div>
    <span className="text-[10px] font-medium tracking-wide">{label}</span>
  </button>
);

export default App;

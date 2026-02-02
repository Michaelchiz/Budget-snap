import React, { useState } from 'react';
import { Wallet, Calendar, ChefHat } from 'lucide-react';
import { ViewState } from './types';
import { BudgetView } from './features/BudgetView';
import { CalendarView } from './features/CalendarView';
import { ChefView } from './features/ChefView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState>('budget');

  const renderContent = () => {
    switch (activeTab) {
      case 'budget': return <BudgetView />;
      case 'calendar': return <CalendarView />;
      case 'chef': return <ChefView />;
      default: return <BudgetView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Budget Snap
        </h1>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
          BS
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 pb-safe fixed bottom-0 w-full max-w-md z-30">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'budget' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Wallet size={24} strokeWidth={activeTab === 'budget' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Budget</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'calendar' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar size={24} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Plan</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('chef')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'chef' ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ChefHat size={24} strokeWidth={activeTab === 'chef' ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">Chef AI</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;

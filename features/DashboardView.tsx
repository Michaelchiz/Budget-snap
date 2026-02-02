import React from 'react';
import { Card, Button, Badge } from '../components/UIComponents';
import { BudgetData, FoodStock } from '../types';
import { formatCurrency } from '../utils';
import { ShoppingCart, Calendar, ChefHat, ArrowRight, Bell } from 'lucide-react';

interface Props {
  budget: BudgetData;
  foods: FoodStock[];
  onNavigate: (view: any) => void;
  userName: string;
}

export const DashboardView: React.FC<Props> = ({ budget, foods, onNavigate, userName }) => {
  const activeList = budget.lists.find(l => l.id === budget.activeListId) || budget.lists[0];
  const spent = activeList.items.filter(i => i.selected).reduce((acc, i) => acc + i.price, 0);
  const remaining = budget.totalBudget - spent;
  const percentage = Math.min(100, Math.max(0, (remaining / budget.totalBudget) * 100));
  
  // Calculate lowest food duration
  const lowestDuration = foods.length > 0 
    ? Math.min(...foods.map(f => f.daysLasting)) 
    : 0;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div>
           <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Dashboard</p>
           <h1 className="text-2xl font-bold text-white">Hello, {userName}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#15221d] border border-[#2a3d35] flex items-center justify-center text-slate-300 relative">
           <Bell size={20} />
           <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Budget Circle */}
      <div className="flex justify-center py-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
           {/* SVG Circle Progress */}
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="128" cy="128" r="110" stroke="#15221d" strokeWidth="20" fill="transparent" />
             <circle 
                cx="128" cy="128" r="110" 
                stroke={remaining < 0 ? '#ef4444' : '#22c55e'} 
                strokeWidth="20" 
                fill="transparent" 
                strokeDasharray={691}
                strokeDashoffset={691 - (691 * percentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
             />
           </svg>
           <div className="absolute text-center">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Remaining</p>
              <p className={`text-4xl font-extrabold ${remaining < 0 ? 'text-red-500' : 'text-white'}`}>
                {formatCurrency(remaining, budget.currencySymbol)}
              </p>
              <Badge color={remaining < 0 ? 'red' : 'green'}>
                {Math.round(percentage)}% of {formatCurrency(budget.totalBudget, '')}
              </Badge>
           </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-[#15221d]/50">
          <p className="text-xs text-slate-400 mb-1">Daily Limit</p>
          <p className="text-lg font-bold text-white">{formatCurrency(budget.totalBudget / 30, budget.currencySymbol)}</p>
        </Card>
        <Card className="p-4 bg-[#15221d]/50">
          <p className="text-xs text-slate-400 mb-1">Spent This Run</p>
          <p className="text-lg font-bold text-white">{formatCurrency(spent, budget.currencySymbol)}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
           <Card onClick={() => onNavigate('budget')} className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-[#1a2e26]">
              <div className="p-3 rounded-full bg-[#22c55e] text-[#052e16]">
                <ShoppingCart size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-300 text-center">Market Run</span>
           </Card>
           
           <Card onClick={() => onNavigate('calendar')} className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-[#1a2e26]">
              <div className="p-3 rounded-full bg-[#2a3d35] text-slate-200">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-300 text-center">Plan Meals</span>
           </Card>

           <Card onClick={() => onNavigate('chef')} className="aspect-square flex flex-col items-center justify-center gap-2 hover:bg-[#1a2e26]">
              <div className="p-3 rounded-full bg-[#2a3d35] text-slate-200">
                <ChefHat size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-300 text-center">What to Cook</span>
           </Card>
        </div>
      </div>

      {/* Survival Outlook */}
      <div className="space-y-3">
         <div className="flex justify-between items-end px-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Survival Outlook</h3>
            <button onClick={() => onNavigate('calendar')} className="text-xs text-[#22c55e] font-medium">View Calendar</button>
         </div>
         <Card className="p-0 flex flex-col md:flex-row relative">
            <div className="p-5 flex-1 z-10">
               <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2 h-2 rounded-full ${lowestDuration > 5 ? 'bg-[#22c55e]' : 'bg-red-500'}`} />
                 <span className={`text-xs font-bold ${lowestDuration > 5 ? 'text-[#22c55e]' : 'text-red-400'}`}>
                   {lowestDuration > 5 ? 'OUTLOOK: GOOD' : 'OUTLOOK: CRITICAL'}
                 </span>
               </div>
               <h4 className="text-2xl font-bold text-white mb-2">{lowestDuration} Days of Food</h4>
               <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                 Based on your current pantry items and planned meals, you are covered until {new Date(Date.now() + lowestDuration * 86400000).toLocaleDateString()}.
               </p>
               
               <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                 <div className="h-full bg-[#22c55e] w-[70%]" />
               </div>
               <p className="text-[10px] text-right text-slate-500 mt-1">70% Comfortable</p>
            </div>
            
            {/* Visual Decor */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#1a2e26] to-transparent pointer-events-none" />
         </Card>
      </div>
    </div>
  );
};

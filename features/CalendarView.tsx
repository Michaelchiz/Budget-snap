import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Coffee, Plus, Calendar } from 'lucide-react';
import { FoodStock } from '../types';
import { StorageService } from '../services/storage';
import { getDaysInMonth, isSameDay, addDays } from '../utils';
import { Card, Button, Toggle } from '../components/UIComponents';

export const CalendarView: React.FC = () => {
  const [foods] = useState<FoodStock[]>(StorageService.getFoods());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [eatingOut, setEatingOut] = useState(false);

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();

  // Calculate safe until date based on max food duration
  const maxDuration = foods.length > 0 ? Math.max(...foods.map(f => f.daysLasting)) : 0;
  const safeDate = addDays(today, maxDuration);

  const renderMealSlot = (icon: React.ReactNode, title: string, time: string, desc: string, items?: string) => (
    <div className="flex gap-4 py-4 border-b border-[#2a3d35] last:border-0 group">
       <div className={`mt-1 p-2 rounded-full h-fit ${items ? 'bg-[#15221d] text-[#22c55e]' : 'bg-[#15221d] text-slate-500'}`}>
         {icon}
       </div>
       <div className="flex-1">
         <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{title} • {time}</span>
            {!items && <button className="text-[10px] text-[#22c55e] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={10}/> Add</button>}
         </div>
         <h4 className={`text-sm font-bold ${items ? 'text-white' : 'text-slate-500 italic'}`}>
           {items ? desc : `No ${title.toLowerCase()} planned`}
         </h4>
         {items && <p className="text-xs text-slate-400 mt-1">{items}</p>}
       </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Pantry Projection Card */}
      <Card className="p-6 bg-[#15221d] relative overflow-hidden">
        <p className="text-[#22c55e] text-xs font-bold uppercase tracking-wider mb-2">Pantry Projection</p>
        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
          Food Supply Safe Until: <span className="text-[#22c55e]">{safeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </h2>
        <p className="text-xs text-slate-400">Based on current pantry stock and planned meals.</p>
        
        <div className="mt-6 flex items-center divide-x divide-[#2a3d35]">
           <div className="pr-4">
              <span className="text-2xl font-bold text-white block">{maxDuration}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Days Left</span>
           </div>
           <div className="px-4">
              <span className="text-2xl font-bold text-white block">32</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Meals Ready</span>
           </div>
           <div className="pl-4 flex-1 flex justify-end">
              <div className="relative w-12 h-12 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="#2a3d35" strokeWidth="4" fill="transparent"/>
                    <circle cx="24" cy="24" r="20" stroke="#22c55e" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset="40" strokeLinecap="round"/>
                 </svg>
                 <span className="absolute text-[10px] font-bold text-white">65%</span>
              </div>
           </div>
        </div>
      </Card>

      {/* Calendar Control */}
      <div className="bg-[#15221d] p-3 rounded-xl border border-[#2a3d35]">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
               <button className="p-1 hover:bg-white/5 rounded-full text-slate-400"><ChevronLeft size={16}/></button>
               <span className="text-sm font-bold text-white">October 2023</span>
               <button className="p-1 hover:bg-white/5 rounded-full text-slate-400"><ChevronRight size={16}/></button>
            </div>
            <div className="flex bg-black/20 rounded-lg p-0.5">
               <button onClick={()=>setView('month')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${view==='month' ? 'bg-[#2a3d35] text-white' : 'text-slate-500'}`}>Month</button>
               <button onClick={()=>setView('week')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${view==='week' ? 'bg-[#2a3d35] text-white' : 'text-slate-500'}`}>Week</button>
            </div>
         </div>
         
         {/* Simple Calendar Grid */}
         <div className="grid grid-cols-7 gap-1">
           {['S','M','T','W','T','F','S'].map(d => (
             <div key={d} className="text-center text-[10px] font-bold text-slate-500 py-2">{d}</div>
           ))}
           {/* Placeholder for days logic - simplified for visual */}
           {Array.from({length: 31}).map((_, i) => {
             const day = i + 1;
             const isSelected = day === 5;
             const hasDot = [2,3,5,6,8,9,10].includes(day);
             return (
               <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg relative ${isSelected ? 'bg-[#22c55e] text-[#052e16] shadow-lg' : 'text-slate-400 hover:bg-[#1a2e26]'}`}>
                 <span className={`text-xs ${isSelected ? 'font-bold' : 'font-medium'}`}>{day}</span>
                 {hasDot && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-[#052e16]' : 'bg-blue-500'}`} />}
               </div>
             )
           })}
         </div>
      </div>

      {/* Day Detail */}
      <div className="bg-[#15221d] rounded-2xl border border-[#2a3d35] overflow-hidden">
         <div className="p-4 bg-[#1a2e26] border-b border-[#2a3d35] flex justify-between items-center">
            <div>
               <h3 className="text-white font-bold text-lg">Thursday, Oct 5th</h3>
               <p className="text-xs text-slate-400">Planned Consumption: 2,100 kcal</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2a3d35] flex items-center justify-center text-[#22c55e]">
               <Calendar size={16} />
            </div>
         </div>
         
         {/* Eating Out Toggle */}
         <div className="px-4 py-3 flex justify-between items-center border-b border-[#2a3d35] bg-[#15221d]/50">
            <div className="flex items-center gap-2 text-yellow-500">
               <span className="font-bold text-sm">Eating Out Today?</span>
            </div>
            <Toggle checked={eatingOut} onChange={setEatingOut} />
         </div>

         {/* Meals */}
         <div className="p-4 pt-0">
            {renderMealSlot(<Sun size={16}/>, "Breakfast", "8:00 AM", "Steel Cut Oats & Berries", "0.5 cups oats, 1 cup almond milk")}
            {renderMealSlot(<Sun size={16}/>, "Lunch", "1:00 PM", "Rice & Black Beans Bowl", "1 cup rice, 0.5 can beans, salsa")}
            {renderMealSlot(<Moon size={16}/>, "Dinner", "7:00 PM", "No meal planned", undefined)}
            {renderMealSlot(<Coffee size={16}/>, "Snacks", "", "No snacks added", undefined)}
         </div>
         
         <div className="p-4 pt-0">
            <Button fullWidth variant="primary" className="gap-2">
               <SparklesIcon /> Auto-Fill from Pantry
            </Button>
         </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
)
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Package, Edit2, Trash2 } from 'lucide-react';
import { FoodStock } from '../types';
import { StorageService } from '../services/storage';
import { generateId, getDaysInMonth, isSameDay, addDays, COLORS } from '../utils';
import { Card, Button, Input, Badge } from '../components/UIComponents';

export const CalendarView: React.FC = () => {
  const [foods, setFoods] = useState<FoodStock[]>(StorageService.getFoods());
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Input States
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pack');
  const [daysLasting, setDaysLasting] = useState('');

  useEffect(() => {
    StorageService.saveFoods(foods);
  }, [foods]);

  const addFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !daysLasting) return;

    const newFood: FoodStock = {
      id: generateId(),
      name: foodName,
      quantity: parseFloat(quantity) || 1,
      unit,
      daysLasting: parseFloat(daysLasting),
      startDate: new Date().toISOString(),
      color: COLORS[foods.length % COLORS.length],
    };

    setFoods([...foods, newFood]);
    setFoodName('');
    setQuantity('');
    setDaysLasting('');
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();

  const getEventsForDay = (date: Date) => {
    return foods.filter(food => {
      const start = new Date(food.startDate);
      // Reset hours to compare dates only
      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDay = addDays(startDay, food.daysLasting - 1); // Inclusive
      const checkDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      return checkDay >= startDay && checkDay <= endDay;
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Input Section */}
      <Card className="p-4 bg-white border-blue-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Package size={18} className="text-blue-500"/>
          Add Food Stock
        </h3>
        <form onSubmit={addFood} className="space-y-3">
          <Input 
            placeholder="Food name (e.g. Maize Flour)" 
            value={foodName}
            onChange={e => setFoodName(e.target.value)}
          />
          <div className="flex gap-2">
            <div className="w-1/3">
              <Input 
                type="number" 
                placeholder="Qty" 
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
            <div className="w-2/3">
              <select 
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option value="pack">Packets</option>
                <option value="kg">kg</option>
                <option value="plate">Plates</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 items-end">
            <div className="flex-1">
               <Input 
                type="number"
                label="How long does this last?"
                placeholder="Days (e.g. 3)"
                step="0.5"
                value={daysLasting}
                onChange={e => setDaysLasting(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!foodName || !daysLasting}>Add</Button>
          </div>
        </form>
      </Card>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">
            {d}
          </div>
        ))}
        
        {/* Empty cells for start of month */}
        {Array.from({ length: daysInMonth[0].getDay() }).map((_, i) => (
           <div key={`empty-${i}`} className="aspect-square bg-slate-50/50" />
        ))}

        {daysInMonth.map((date) => {
          const events = getEventsForDay(date);
          const isToday = isSameDay(date, today);
          
          return (
            <div 
              key={date.toISOString()} 
              className={`aspect-square border border-slate-100 rounded-lg p-1 relative flex flex-col items-center justify-start overflow-hidden ${
                isToday ? 'ring-2 ring-blue-500 ring-offset-1 z-10 bg-blue-50/50' : 'bg-white'
              }`}
            >
              <span className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-700' : 'text-slate-500'}`}>
                {date.getDate()}
              </span>
              
              <div className="flex flex-col gap-0.5 w-full">
                {events.map((event, i) => (
                  <div 
                    key={event.id}
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: event.color }}
                    title={event.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend / Active Foods */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Active Stock</h4>
        {foods.length === 0 && <p className="text-sm text-slate-400">No food added yet.</p>}
        {foods.map(food => (
          <div key={food.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: food.color }} />
               <div>
                 <p className="font-medium text-slate-800">{food.name}</p>
                 <p className="text-xs text-slate-500">
                   {food.quantity} {food.unit} • Lasts {food.daysLasting} days
                 </p>
               </div>
             </div>
             <button onClick={() => removeFood(food.id)} className="text-slate-400 hover:text-red-500 p-2">
               <Trash2 size={16} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

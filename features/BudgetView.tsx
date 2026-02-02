import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Settings, ScanLine, ShoppingCart, Calendar } from 'lucide-react';
import { BudgetData, GroceryItem } from '../types';
import { StorageService } from '../services/storage';
import { generateId, formatCurrency } from '../utils';
import { Card, Button, Input, Badge } from '../components/UIComponents';

export const BudgetView: React.FC = () => {
  const [data, setData] = useState<BudgetData>(StorageService.getBudget());
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [mode, setMode] = useState<'planning' | 'market'>('market');

  // Sync with Storage
  useEffect(() => {
    StorageService.saveBudget(data);
  }, [data]);

  const activeList = data.lists.find(l => l.id === data.activeListId) || data.lists[0];

  // Calculations
  const totalCost = activeList.items.reduce((sum, item) => sum + item.price, 0);
  const selectedCost = activeList.items
    .filter(i => i.selected)
    .reduce((sum, item) => sum + item.price, 0);
  
  const remainingBudget = data.totalBudget - selectedCost;
  const isOverBudget = remainingBudget < 0;
  const progressPercent = Math.min(100, (selectedCost / data.totalBudget) * 100);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    const newItem: GroceryItem = {
      id: generateId(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      selected: true,
      bought: false,
      category: 'other' // default for now
    };

    setData(prev => {
      const updatedLists = prev.lists.map(list => 
        list.id === prev.activeListId 
          ? { ...list, items: [newItem, ...list.items] }
          : list
      );
      return { ...prev, lists: updatedLists };
    });
    setNewItemName('');
    setNewItemPrice('');
  };

  const toggleSelection = (id: string) => {
    updateItem(id, (item) => ({ ...item, selected: !item.selected }));
  };

  const updateItem = (id: string, updater: (item: GroceryItem) => GroceryItem) => {
    setData(prev => {
      const updatedLists = prev.lists.map(list => 
        list.id === prev.activeListId 
          ? { ...list, items: list.items.map(item => item.id === id ? updater(item) : item) }
          : list
      );
      return { ...prev, lists: updatedLists };
    });
  };

  const removeItem = (id: string) => {
    setData(prev => {
      const updatedLists = prev.lists.map(list => 
        list.id === prev.activeListId 
          ? { ...list, items: list.items.filter(item => item.id !== id) }
          : list
      );
      return { ...prev, lists: updatedLists };
    });
  };

  // Group items
  const categories = {
    produce: activeList.items.filter(i => !i.category || i.category === 'produce'), // Temporary grouping logic
    dairy: activeList.items.filter(i => i.category === 'dairy'),
    household: activeList.items.filter(i => i.category === 'household'),
    other: activeList.items.filter(i => i.category === 'other' || i.category === 'pantry'),
  };

  // Helper to render list
  const renderList = (title: string, items: GroceryItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{title}</h3>
        <div className="space-y-2">
          {items.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleSelection(item.id)}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                item.selected 
                  ? 'bg-[#15221d] border-[#22c55e]/30' 
                  : 'bg-[#15221d]/50 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                  item.selected ? 'bg-[#22c55e] border-[#22c55e]' : 'border-slate-600'
                }`}>
                  {item.selected && <Check size={14} className="text-[#052e16] font-bold" />}
                </div>
                <div>
                  <p className={`font-medium text-sm ${item.selected ? 'text-white' : 'text-slate-400 line-through'}`}>{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.quantity || '1 unit'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className={`font-bold text-sm ${item.selected ? 'text-white' : 'text-slate-500'}`}>
                   {formatCurrency(item.price, data.currencySymbol)}
                 </span>
                 <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-600 hover:text-red-500">
                    <Trash2 size={14} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-24 animate-in slide-in-from-bottom-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">Weekly Market Run</h1>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
             <Calendar size={12} />
             <span>Oct 24 - Oct 31</span>
          </div>
        </div>
        <button className="p-2 rounded-full bg-[#15221d] text-slate-400 hover:text-white border border-[#2a3d35]">
           <Settings size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#15221d] rounded-2xl p-4 border border-[#2a3d35]">
           <p className="text-xs text-slate-400 mb-1">Total</p>
           <p className="text-2xl font-bold text-white">{formatCurrency(data.totalBudget, '')}</p>
        </div>
        <div className={`rounded-2xl p-4 border relative overflow-hidden ${isOverBudget ? 'bg-red-500/10 border-red-500/20' : 'bg-[#15221d] border-[#2a3d35]'}`}>
           <p className="text-xs text-slate-400 mb-1">Remaining</p>
           <div className="flex items-end gap-2">
             <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-[#22c55e]'}`}>
               {formatCurrency(remainingBudget, '')}
             </p>
             <Badge color={isOverBudget ? 'red' : 'green'}>{Math.round(remainingBudget/data.totalBudget * 100)}%</Badge>
           </div>
           {/* Piggy Bank Icon Watermark */}
           <div className="absolute right-[-10px] bottom-[-10px] opacity-5 rotate-12">
              <ShoppingCart size={80} />
           </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Budget Used</span>
          <span>{formatCurrency(selectedCost, '')} / {formatCurrency(data.totalBudget, '')}</span>
        </div>
        <div className="h-2 w-full bg-[#15221d] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-[#22c55e]'}`} 
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#15221d] p-1 rounded-xl flex gap-1 border border-[#2a3d35]">
        <button 
          onClick={() => setMode('planning')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'planning' ? 'bg-[#2a3d35] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Planning
        </button>
        <button 
          onClick={() => setMode('market')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${mode === 'market' ? 'bg-[#22c55e] text-[#052e16] shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <ShoppingCart size={12} />
          Market Mode
        </button>
      </div>

      {/* Lists */}
      <div className="pb-10">
        {renderList('Produce', categories.produce)}
        {renderList('Dairy & Eggs', categories.dairy)}
        {renderList('Household', categories.household)}
        {renderList('Other', categories.other)}
        
        {/* Add Item Form inline or FAB */}
        <div className="fixed bottom-24 right-4 flex flex-col items-end gap-3 z-20">
             <button className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
               <ScanLine size={20} />
             </button>
             <button 
                onClick={() => {
                   const name = prompt("Item Name?");
                   if(name) {
                      setNewItemName(name);
                      const price = prompt("Price?");
                      if(price) {
                         setNewItemPrice(price);
                         // Trigger add manually for now since form is hidden
                         const newItem: GroceryItem = {
                            id: generateId(),
                            name: name,
                            price: parseFloat(price),
                            selected: true,
                            bought: false,
                            category: 'produce' // default
                          };
                          setData(prev => {
                            const updatedLists = prev.lists.map(list => 
                              list.id === prev.activeListId 
                                ? { ...list, items: [newItem, ...list.items] }
                                : list
                            );
                            return { ...prev, lists: updatedLists };
                          });
                      }
                   }
                }}
                className="w-14 h-14 bg-[#22c55e] text-[#052e16] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-[#16a34a] active:scale-90 transition-transform"
             >
               <Plus size={28} />
             </button>
        </div>
      </div>

      {isOverBudget && (
        <div className="fixed bottom-20 left-4 right-4 bg-red-500 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center shadow-lg animate-pulse z-20">
          ⚠️ You are over budget! Consider removing items.
        </div>
      )}
    </div>
  );
};
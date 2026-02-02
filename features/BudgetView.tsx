import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Edit2, RotateCcw } from 'lucide-react';
import { BudgetData, GroceryItem } from '../types';
import { StorageService } from '../services/storage';
import { generateId, formatCurrency } from '../utils';
import { Card, Button, Input } from '../components/UIComponents';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const BudgetView: React.FC = () => {
  const [data, setData] = useState<BudgetData>(StorageService.getBudget());
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Sync with Storage
  useEffect(() => {
    StorageService.saveBudget(data);
  }, [data]);

  const activeList = data.lists.find(l => l.id === data.activeListId) || data.lists[0];

  // Derived calculations
  const totalCost = activeList.items.reduce((sum, item) => sum + item.price, 0);
  const selectedCost = activeList.items
    .filter(i => i.selected)
    .reduce((sum, item) => sum + item.price, 0);
  
  const boughtCost = activeList.items
    .filter(i => i.bought)
    .reduce((sum, item) => sum + item.price, 0);

  const remainingBudget = data.totalBudget - selectedCost;
  const isOverBudget = remainingBudget < 0;

  // Handlers
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setData(prev => ({ ...prev, totalBudget: val }));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    const newItem: GroceryItem = {
      id: generateId(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      selected: true,
      bought: false
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

  const toggleBought = (id: string) => {
    updateItem(id, (item) => ({ ...item, bought: !item.bought }));
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

  const clearPurchased = () => {
     if(window.confirm("Remove all purchased items from the list?")) {
        setData(prev => {
          const updatedLists = prev.lists.map(list => 
            list.id === prev.activeListId 
              ? { ...list, items: list.items.filter(item => !item.bought) }
              : list
          );
          return { ...prev, lists: updatedLists };
        });
     }
  }

  // Chart Data
  const chartData = [
    { name: 'Used', value: selectedCost > data.totalBudget ? data.totalBudget : selectedCost },
    { name: 'Remaining', value: Math.max(0, data.totalBudget - selectedCost) },
    ...(isOverBudget ? [{ name: 'Over', value: Math.abs(remainingBudget) }] : [])
  ];

  const CHART_COLORS = ['#3b82f6', '#e2e8f0', '#ef4444'];

  return (
    <div className="space-y-6 pb-20">
      {/* Budget Summary Card */}
      <Card className="p-5 bg-white sticky top-0 z-10 shadow-md ring-1 ring-slate-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Budget</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-medium text-slate-400">{data.currencySymbol}</span>
              <input
                type="number"
                value={data.totalBudget || ''}
                onChange={handleBudgetChange}
                placeholder="0"
                className="text-3xl font-bold w-40 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="h-16 w-16">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={30}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg flex justify-between items-center transition-colors ${
          isOverBudget ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          <span className="font-medium text-sm">Remaining Balance</span>
          <span className="text-2xl font-bold tracking-tight">
            {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remainingBudget), data.currencySymbol)}
          </span>
        </div>
      </Card>

      {/* Add New Item */}
      <form onSubmit={addItem} className="flex gap-2">
        <div className="flex-1">
          <Input 
            placeholder="Item name (e.g. Rice)" 
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
          />
        </div>
        <div className="w-24">
          <Input 
            type="number" 
            placeholder="Price" 
            value={newItemPrice}
            onChange={e => setNewItemPrice(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={!newItemName || !newItemPrice}>
          <Plus size={20} />
        </Button>
      </form>

      {/* Lists */}
      <div className="space-y-3">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-bold text-slate-800 text-lg">Grocery List</h3>
          {activeList.items.some(i => i.bought) && (
             <button onClick={clearPurchased} className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1">
               <Trash2 size={12}/> Clean Up
             </button>
          )}
        </div>

        {activeList.items.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p>List is empty.</p>
            <p className="text-sm">Add items above to start planning.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeList.items.map(item => (
              <Card key={item.id} className={`flex items-center p-3 gap-3 transition-all ${item.bought ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                {/* Selection Toggle (Include in Budget) */}
                <button 
                  onClick={() => toggleSelection(item.id)}
                  className={`p-1 rounded-full transition-colors ${item.selected ? 'text-blue-500 bg-blue-50' : 'text-slate-300 hover:text-slate-400'}`}
                  title="Include in budget calculation"
                >
                  <CheckCircle size={20} className={item.selected ? 'fill-blue-500 text-white' : ''} />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium truncate ${item.bought ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-700">{formatCurrency(item.price, data.currencySymbol)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                   {/* Bought Toggle */}
                   <button 
                    onClick={() => toggleBought(item.id)}
                    className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                      item.bought 
                        ? 'bg-slate-200 border-slate-300 text-slate-600' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                   >
                     {item.bought ? 'BOUGHT' : 'BUY'}
                   </button>
                   
                   <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Summary Footer */}
      <div className="grid grid-cols-2 gap-4 text-center text-sm text-slate-500 pt-4 border-t border-slate-200">
        <div>
           <span className="block text-xs uppercase font-bold">Planned</span>
           <span className="font-medium text-slate-800">{formatCurrency(selectedCost, data.currencySymbol)}</span>
        </div>
        <div>
           <span className="block text-xs uppercase font-bold">Spent</span>
           <span className="font-medium text-slate-800">{formatCurrency(boughtCost, data.currencySymbol)}</span>
        </div>
      </div>
    </div>
  );
};

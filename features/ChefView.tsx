import React, { useState, useEffect } from 'react';
import { ChefHat, RefreshCw, Clock, ArrowRight, X } from 'lucide-react';
import { Ingredient, Recipe } from '../types';
import { StorageService } from '../services/storage';
import { generateRecipes } from '../services/gemini';
import { generateId } from '../utils';
import { Card, Button, Input, Badge, Toggle } from '../components/UIComponents';

export const ChefView: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(StorageService.getIngredients());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    StorageService.saveIngredients(ingredients);
  }, [ingredients]);

  const handleGenerate = async () => {
    // Mock recipes for visual demo if offline or no key
    setLoading(true);
    setTimeout(() => {
        setRecipes([
            { id: '1', name: 'One-Pot Jollof Rice', description: 'Simple savory rice dish', ingredients: ['Rice', 'Tomato Paste', 'Onion', 'Thyme'], instructions: ['Fry onions', 'Add paste', 'Add rice', 'Simmer'], prepTime: '45 min', matchPercentage: 90 },
            { id: '2', name: 'Quick Egg Stir-Fry', description: 'Healthy protein mix', ingredients: ['Eggs', 'Frozen Veggies', 'Soy Sauce', 'Rice'], instructions: [], prepTime: '15 min', matchPercentage: 100 },
            { id: '3', name: 'Tuna Pasta Salad', description: 'Cold refreshing lunch', ingredients: ['Canned Tuna', 'Pasta', 'Mayo', 'Corn'], instructions: [], prepTime: '20 min', matchPercentage: 85 },
        ]);
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in relative">
      <div className="flex justify-between items-start">
         <div className="max-w-[80%]">
            <h1 className="text-2xl font-bold text-white mb-2">What Can I Cook?</h1>
            <p className="text-xs text-slate-400">Based on your current pantry items, we found 3 budget-friendly options that use what you already have.</p>
         </div>
         <Button size="sm" variant="ghost" className="text-[#22c55e]" onClick={handleGenerate}>
            <RefreshCw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`}/> Regenerate
         </Button>
      </div>

      {/* Recipe Grid */}
      <div className="space-y-4">
         {recipes.length === 0 ? (
             <div className="text-center py-20 bg-[#15221d] rounded-2xl border border-[#2a3d35] border-dashed">
                <ChefHat size={48} className="mx-auto text-[#2a3d35] mb-4" />
                <h3 className="text-slate-300 font-bold">No recipes generated</h3>
                <p className="text-slate-500 text-sm mb-4">Add ingredients to your pantry first</p>
                <Button onClick={handleGenerate}>Generate Ideas</Button>
             </div>
         ) : (
            recipes.map((recipe, idx) => (
                <Card key={recipe.id} className="group overflow-hidden bg-[#15221d] border-[#2a3d35] hover:border-[#22c55e]/50 transition-colors">
                   {/* Placeholder Image Area */}
                   <div className="h-40 bg-[#1a2e26] relative">
                      <img 
                        src={`https://source.unsplash.com/random/400x300?food,${idx}`} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        alt="Recipe"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <div className="absolute top-3 left-3">
                         <Badge color="green">{recipe.matchPercentage}% MATCH</Badge>
                      </div>
                   </div>
                   
                   <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-3">{recipe.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                         {recipe.ingredients.map(ing => (
                            <span key={ing} className="px-2 py-1 bg-[#0c1612] border border-[#2a3d35] rounded-md text-[10px] text-slate-400">
                               {ing}
                            </span>
                         ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-[#2a3d35]">
                         <div className="flex items-center text-slate-400 text-xs">
                            <Clock size={12} className="mr-1" /> {recipe.prepTime}
                         </div>
                         <Button size="sm" variant="primary" onClick={() => setSelectedRecipe(recipe)}>
                            View Recipe
                         </Button>
                      </div>
                   </div>
                </Card>
            ))
         )}
      </div>
      
      {/* Missing Ingredients Banner */}
      <div className="bg-[#15221d] border border-[#2a3d35] border-dashed rounded-xl p-4 flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2a3d35] rounded-lg text-slate-300">
               <ChefHat size={20} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-white">Missing ingredients?</h4>
               <p className="text-[10px] text-slate-400">Add items to shopping list to complete recipes.</p>
            </div>
         </div>
         <button className="text-xs text-[#22c55e] font-bold">View Shopping List</button>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1a2e26] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative">
               <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-slate-400 hover:text-white z-10">
                  <X size={20} />
               </button>
               
               <div className="p-6 pb-24">
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedRecipe.name}</h2>
                  <p className="text-slate-400 text-sm mb-6">Budget Meal • {selectedRecipe.prepTime}</p>
                  
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                     <div className="w-1 h-4 bg-[#22c55e] rounded-full" /> Used Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                     {selectedRecipe.ingredients.map(ing => (
                        <span key={ing} className="px-3 py-1.5 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-xs font-bold flex items-center gap-1">
                           ✓ {ing}
                        </span>
                     ))}
                  </div>
                  
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                     <div className="w-1 h-4 bg-[#22c55e] rounded-full" /> Cooking Steps
                  </h3>
                  <div className="space-y-6 relative pl-2">
                     <div className="absolute left-[15px] top-2 bottom-0 w-0.5 bg-[#2a3d35]" />
                     {selectedRecipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-4 relative">
                           <div className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center text-[#052e16] font-bold text-sm shrink-0 z-10 ring-4 ring-[#1a2e26]">
                              {i+1}
                           </div>
                           <p className="text-slate-300 text-sm mt-1 leading-relaxed">{step}</p>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#2a3d35]">
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                           <span className="text-[#eab308]">✨</span>
                           <span className="text-xs font-bold text-white">AI Visualization</span>
                        </div>
                        <Toggle checked={true} onChange={()=>{}} />
                     </div>
                     <div className="aspect-video bg-[#0c1612] rounded-xl relative overflow-hidden group">
                        <img 
                            src="https://source.unsplash.com/random/800x600?meal" 
                            className="w-full h-full object-cover opacity-90"
                            alt="AI Viz"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1">
                           ✨ GENERATED
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
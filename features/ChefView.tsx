import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, X, Loader2, Sparkles, Clock, List, Flame } from 'lucide-react';
import { Ingredient, Recipe } from '../types';
import { StorageService } from '../services/storage';
import { generateRecipes } from '../services/gemini';
import { generateId } from '../utils';
import { Card, Button, Input, Badge } from '../components/UIComponents';

export const ChefView: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(StorageService.getIngredients());
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  useEffect(() => {
    StorageService.saveIngredients(ingredients);
  }, [ingredients]);

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;
    
    setIngredients([...ingredients, { id: generateId(), name: newIngredient.trim() }]);
    setNewIngredient('');
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setError(null);
    setRecipes([]); // clear previous

    try {
      const ingredientNames = ingredients.map(i => i.name);
      const result = await generateRecipes(ingredientNames);
      setRecipes(result);
    } catch (err) {
      setError("Failed to generate recipes. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasKey = !!process.env.API_KEY;

  return (
    <div className="space-y-6 pb-20">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 rounded-2xl text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <ChefHat size={32} />
          <h2 className="text-2xl font-bold">Chef AI</h2>
        </div>
        <p className="text-violet-100 text-sm">
          Tell me what you have, and I'll tell you what you can cook. Simple & realistic.
        </p>
      </div>

      {!hasKey && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-800 text-sm">
          <strong>Note:</strong> No API Key found in environment. AI features will not work locally without configuration.
        </div>
      )}

      {/* Ingredient Input */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Your Ingredients</h3>
        
        <form onSubmit={addIngredient} className="relative">
          <Input 
            placeholder="Add ingredient (e.g. Eggs, Tomatoes)" 
            value={newIngredient}
            onChange={e => setNewIngredient(e.target.value)}
            className="pr-12"
          />
          <button 
            type="submit"
            disabled={!newIngredient}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {ingredients.map(ing => (
            <span key={ing.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-slate-200 text-sm text-slate-700 shadow-sm">
              {ing.name}
              <button onClick={() => removeIngredient(ing.id)} className="text-slate-400 hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          ))}
          {ingredients.length === 0 && (
            <span className="text-sm text-slate-400 italic">No ingredients added yet.</span>
          )}
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || ingredients.length === 0}
          className="w-full bg-slate-900 hover:bg-slate-800 py-3 shadow-md"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin mr-2"/> Thinking...</>
          ) : (
            <><Sparkles size={18} className="mr-2 text-yellow-300"/> Suggest Meals</>
          )}
        </Button>
        
        {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* Recipe Results */}
      {recipes.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Suggestions</h3>
              <Badge color="blue">{recipes.length} Meals</Badge>
           </div>
           
           <div className="grid gap-4">
             {recipes.map((recipe) => (
               <Card 
                key={recipe.id} 
                onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                className={`transition-all duration-300 ${expandedRecipe === recipe.id ? 'ring-2 ring-violet-500 shadow-lg' : 'hover:border-violet-200'}`}
               >
                 <div className="p-4">
                   <div className="flex justify-between items-start">
                     <div>
                       <h4 className="font-bold text-slate-800 text-lg">{recipe.name}</h4>
                       <p className="text-sm text-slate-500 mt-1 line-clamp-2">{recipe.description}</p>
                     </div>
                     {recipe.prepTime && (
                       <div className="flex items-center text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                         <Clock size={12} className="mr-1"/> {recipe.prepTime}
                       </div>
                     )}
                   </div>

                   {/* Expanded Details */}
                   {expandedRecipe === recipe.id && (
                     <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-300">
                       <div>
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                           <List size={12} /> Ingredients
                         </h5>
                         <div className="flex flex-wrap gap-2">
                           {recipe.ingredients.map((ing, i) => (
                             <Badge key={i} color="gray">{ing}</Badge>
                           ))}
                         </div>
                       </div>
                       
                       <div>
                         <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                           <Flame size={12} /> Instructions
                         </h5>
                         <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                           {recipe.instructions.map((step, i) => (
                             <li key={i} className="pl-1 marker:font-bold marker:text-slate-400">{step}</li>
                           ))}
                         </ol>
                       </div>
                       
                       <Button size="sm" variant="secondary" className="w-full mt-2" onClick={(e) => { e.stopPropagation(); setExpandedRecipe(null); }}>
                         Close
                       </Button>
                     </div>
                   )}
                   
                   {!expandedRecipe && (
                      <div className="mt-3 flex justify-end">
                        <span className="text-xs font-medium text-violet-600">Tap to view recipe</span>
                      </div>
                   )}
                 </div>
               </Card>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

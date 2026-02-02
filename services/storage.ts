import { BudgetData, FoodStock, Ingredient } from '../types';

const KEYS = {
  BUDGET: 'budget_snap_budget_v1',
  FOODS: 'budget_snap_foods_v1',
  INGREDIENTS: 'budget_snap_ingredients_v1',
};

export const StorageService = {
  getBudget: (): BudgetData => {
    const data = localStorage.getItem(KEYS.BUDGET);
    if (data) return JSON.parse(data);
    
    // Default initial state
    const defaultListId = 'default-list';
    return {
      totalBudget: 0,
      currencySymbol: 'MK',
      lists: [{ id: defaultListId, name: 'My Grocery List', items: [] }],
      activeListId: defaultListId,
    };
  },

  saveBudget: (data: BudgetData) => {
    localStorage.setItem(KEYS.BUDGET, JSON.stringify(data));
  },

  getFoods: (): FoodStock[] => {
    const data = localStorage.getItem(KEYS.FOODS);
    return data ? JSON.parse(data) : [];
  },

  saveFoods: (data: FoodStock[]) => {
    localStorage.setItem(KEYS.FOODS, JSON.stringify(data));
  },

  getIngredients: (): Ingredient[] => {
    const data = localStorage.getItem(KEYS.INGREDIENTS);
    return data ? JSON.parse(data) : [];
  },

  saveIngredients: (data: Ingredient[]) => {
    localStorage.setItem(KEYS.INGREDIENTS, JSON.stringify(data));
  },
};

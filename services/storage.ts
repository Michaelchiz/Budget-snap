import { BudgetData, FoodStock, Ingredient, UserSession } from '../types';

const KEYS = {
  BUDGET: 'budget_snap_budget_v2',
  FOODS: 'budget_snap_foods_v2',
  INGREDIENTS: 'budget_snap_ingredients_v2',
  SESSION: 'budget_snap_session_v1',
};

export const StorageService = {
  getBudget: (): BudgetData => {
    const data = localStorage.getItem(KEYS.BUDGET);
    if (data) return JSON.parse(data);
    
    // Default initial state
    const defaultListId = 'default-list';
    return {
      totalBudget: 45000,
      currencySymbol: 'MK',
      lists: [{ id: defaultListId, name: 'Weekly Market Run', items: [] }],
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

  getSession: (): UserSession => {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : { hasOnboarded: false, isLoggedIn: false, name: '' };
  },

  saveSession: (data: UserSession) => {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(data));
  },
};

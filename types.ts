// Data Models

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  category?: 'produce' | 'dairy' | 'household' | 'pantry' | 'other';
  selected: boolean;
  bought: boolean;
  quantity?: string; // Display string like "1 bunch" or "3 count"
}

export interface BudgetData {
  totalBudget: number;
  currencySymbol: string;
  lists: {
    id: string;
    name: string;
    items: GroceryItem[];
  }[];
  activeListId: string;
}

export interface FoodStock {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  daysLasting: number; // calculated or user input
  startDate: string; // ISO Date string
  color: string;
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  calories?: string;
  matchPercentage?: number;
}

export interface UserSession {
  hasOnboarded: boolean;
  isLoggedIn: boolean;
  name: string;
}

export type AppView = 'welcome' | 'login' | 'dashboard' | 'budget' | 'calendar' | 'chef';

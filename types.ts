// Data Models

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  selected: boolean;
  bought: boolean;
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
}

export type ViewState = 'budget' | 'calendar' | 'chef';

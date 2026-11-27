export type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface FoodItem {
  id: number;
  foodId: number;
  name: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export type MealState = {
  description: string;
  type: string;
  eatTime: string;
};

export interface CreateMealPayload {
  type: string;
  eatTime: string;
  description?: string;
  items: {
    foodId: number;
    grams: number;
  }[];
}

export interface MealItem {
  id: number;
  grams: number;
  foodId: number;
  food?: {
    id: number;
    name: string;
    caloriesPer100g: number;
    carbsPer100g: number;
    proteinPer100g: number;
    fatPer100g: number;
  };
}

export interface Meal {
  id: number;
  name: string;
  type: MealCategory;
  createdAt: string;
  eatTime: string;
  totals: {
    grams: number;
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
  };
  items: MealItem[];
}

export interface MacroSummary {
  carbs: number;
  proteins: number;
  fats: number;
  calories: number;
  caloriesGoal: number | null;
}

export interface MealsSummary {
  total: number;
  thisMonth: number;
  today: number;
}
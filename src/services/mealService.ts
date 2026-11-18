import { api } from '@/lib/api';
import type { CreateMealPayload, Meal } from '@/types/meal';

export async function getMeals() {
  const response = await api.get<Meal[]>('/meals');
  return response.data;
}

export async function createMeal(meal: CreateMealPayload) {
  const response = await api.post('/meals', meal);
  return response.data;
}
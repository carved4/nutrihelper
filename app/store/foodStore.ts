import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isFromCalculator: boolean;
}

interface FoodItem {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  brand_name?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

interface FoodStore {
  trackedFoods: FoodItem[];
  favoriteItems: FoodItem[];
  nutritionGoals: NutritionGoals;
  addFood: (food: FoodItem, mealType: FoodItem['mealType']) => void;
  removeFood: (index: number) => void;
  clearFoods: () => void;
  getFoodsByMealType: (mealType: FoodItem['mealType']) => FoodItem[];
  addToFavorites: (food: FoodItem) => void;
  removeFromFavorites: (index: number) => void;
  updateNutritionGoals: (goals: Partial<NutritionGoals>) => void;
}

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 70,
  isFromCalculator: false
};

export const useFoodStore = create<FoodStore>()(
  persist(
    (set, get) => ({
      trackedFoods: [],
      favoriteItems: [],
      nutritionGoals: DEFAULT_GOALS,
      addFood: (food, mealType) => set((state) => ({ 
        trackedFoods: [...state.trackedFoods, {
          ...food,
          mealType,
          timestamp: new Date().toISOString(),
        }]
      })),
      removeFood: (index) => set((state) => ({
        trackedFoods: state.trackedFoods.filter((_, i) => i !== index)
      })),
      clearFoods: () => set({ trackedFoods: [] }),
      getFoodsByMealType: (mealType) => {
        const state = get();
        return state.trackedFoods.filter(food => food.mealType === mealType);
      },
      addToFavorites: (food) => set((state) => ({
        favoriteItems: [...state.favoriteItems, food]
      })),
      removeFromFavorites: (index) => set((state) => ({
        favoriteItems: state.favoriteItems.filter((_, i) => i !== index)
      })),
      updateNutritionGoals: (goals) => set((state) => ({
        nutritionGoals: { 
          ...state.nutritionGoals, 
          ...goals,
          isFromCalculator: true 
        }
      })),
    }),
    {
      name: 'food-storage',
    }
  )
) 
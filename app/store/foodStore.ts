import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FoodItem {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  brand_name?: string;
}

interface FoodStore {
  trackedFoods: FoodItem[];
  addFood: (food: FoodItem) => void;
  removeFood: (index: number) => void;
  clearFoods: () => void;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set) => ({
      trackedFoods: [],
      addFood: (food) => set((state) => ({ 
        trackedFoods: [...state.trackedFoods, food] 
      })),
      removeFood: (index) => set((state) => ({
        trackedFoods: state.trackedFoods.filter((_, i) => i !== index)
      })),
      clearFoods: () => set({ trackedFoods: [] }),
    }),
    {
      name: 'food-storage',
    }
  )
) 
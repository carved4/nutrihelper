import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  lastCalculated?: string;
}

interface MacroCalculatorData {
  weight: string;
  feet: string;
  inches: string;
  age: string;
  gender: "male" | "female";
  activityLevel: number;
  macroGoals: MacroGoals | null;
}

interface MacroStore {
  calculatorData: MacroCalculatorData;
  updateCalculatorData: (data: Partial<MacroCalculatorData>) => void;
  calculateMacros: (data: Omit<MacroCalculatorData, 'macroGoals'>) => void;
  clearMacros: () => void;
}

const DEFAULT_CALCULATOR_DATA: MacroCalculatorData = {
  weight: "",
  feet: "",
  inches: "",
  age: "",
  gender: "male",
  activityLevel: 1.2,
  macroGoals: null
};

export const useMacroStore = create<MacroStore>()(
  persist(
    (set) => ({
      calculatorData: DEFAULT_CALCULATOR_DATA,
      updateCalculatorData: (data) => set((state) => ({
        calculatorData: { ...state.calculatorData, ...data }
      })),
      calculateMacros: (data) => {
        // Convert height to cm: (feet * 12 + inches) * 2.54
        const heightInCm = (parseInt(data.feet) * 12 + parseInt(data.inches)) * 2.54;
        // Convert weight to kg: pounds * 0.453592
        const weightInKg = parseInt(data.weight) * 0.453592;
        const ageInYears = parseFloat(data.age);
        
        let bmr;
        if (data.gender === "male") {
          bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5;
        } else {
          bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161;
        }

        const tdee = bmr * data.activityLevel;

        const macroGoals: MacroGoals = {
          calories: Math.round(tdee),
          protein: Math.round((tdee * 0.3) / 4),
          carbs: Math.round((tdee * 0.4) / 4),
          fat: Math.round((tdee * 0.3) / 9),
          lastCalculated: new Date().toISOString()
        };

        set((state) => ({
          calculatorData: {
            ...state.calculatorData,
            ...data,
            macroGoals
          }
        }));
      },
      clearMacros: () => set({ calculatorData: DEFAULT_CALCULATOR_DATA }),
    }),
    {
      name: 'macro-calculator-storage',
    }
  )
) 
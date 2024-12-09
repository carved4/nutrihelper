import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BMIData {
  bmi: number | null;
  category: string;
  feet: string;
  inches: string;
  weight: string;
  lastUpdated: string;
}

interface BMIStore {
  bmiData: BMIData;
  updateBMI: (data: Partial<BMIData>) => void;
  calculateBMI: (feet: string, inches: string, weight: string) => void;
  clearBMI: () => void;
}

const DEFAULT_BMI_DATA: BMIData = {
  bmi: null,
  category: "",
  feet: "",
  inches: "",
  weight: "",
  lastUpdated: "",
};

export const useBMIStore = create<BMIStore>()(
  persist(
    (set) => ({
      bmiData: DEFAULT_BMI_DATA,
      updateBMI: (data) => set((state) => ({
        bmiData: { ...state.bmiData, ...data }
      })),
      calculateBMI: (feet, inches, weight) => {
        const heightInM = (parseInt(feet) * 12 + parseInt(inches)) * 0.0254;
        const weightInKg = parseInt(weight) * 0.453592;
        const bmiValue = parseFloat((weightInKg / (heightInM * heightInM)).toFixed(1));
        
        let category = "";
        if (bmiValue < 18.5) category = "Underweight";
        else if (bmiValue < 25) category = "Normal weight";
        else if (bmiValue < 30) category = "Overweight";
        else category = "Obese";

        set({
          bmiData: {
            bmi: bmiValue,
            category,
            feet,
            inches,
            weight,
            lastUpdated: new Date().toISOString(),
          }
        });
      },
      clearBMI: () => set({ bmiData: DEFAULT_BMI_DATA }),
    }),
    {
      name: 'bmi-storage',
    }
  )
) 
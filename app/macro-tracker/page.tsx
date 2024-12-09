"use client";

import { useState, useEffect } from "react";
import { PieChart, Activity, Scale, User2, Dumbbell, AlertCircle, RotateCcw } from "lucide-react";
import { useMacroStore } from "../store/macroStore";

export default function MacroTracker() {
  const { calculatorData, calculateMacros, clearMacros, updateCalculatorData } = useMacroStore();
  
  const [weight, setWeight] = useState(calculatorData.weight);
  const [feet, setFeet] = useState(calculatorData.feet);
  const [inches, setInches] = useState(calculatorData.inches);
  const [age, setAge] = useState(calculatorData.age);
  const [gender, setGender] = useState<"male" | "female">(calculatorData.gender);
  const [activityLevel, setActivityLevel] = useState<number>(calculatorData.activityLevel);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMacros({
      weight,
      feet,
      inches,
      age,
      gender,
      activityLevel
    });
  };

  const handleClear = () => {
    clearMacros();
    setWeight("");
    setFeet("");
    setInches("");
    setAge("");
    setGender("male");
    setActivityLevel(1.2);
  };

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <PieChart className="h-8 w-8 text-primary" />
              Macro Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate your recommended daily macronutrient intake based on your goals
            </p>
          </div>
          {calculatorData.macroGoals && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-accent rounded-full text-muted-foreground"
              aria-label="Clear results"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="rounded-lg border bg-card p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="weight" className="text-sm font-medium flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Weight (lbs)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                    placeholder="Enter weight in pounds"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4" />
                    Height
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <input
                        id="feet"
                        type="number"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                        placeholder="Feet"
                        required
                        min="0"
                      />
                      <label htmlFor="feet" className="text-xs text-muted-foreground">
                        Feet
                      </label>
                    </div>
                    <div className="space-y-2">
                      <input
                        id="inches"
                        type="number"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                        placeholder="Inches"
                        required
                        min="0"
                        max="11"
                      />
                      <label htmlFor="inches" className="text-xs text-muted-foreground">
                        Inches
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                    <User2 className="h-4 w-4" />
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                    placeholder="Enter your age"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium flex items-center gap-2">
                    <User2 className="h-4 w-4" />
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male" | "female")}
                    className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                    className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                  >
                    <option value={1.2}>Sedentary (little or no exercise)</option>
                    <option value={1.375}>Light (exercise 1-3 times/week)</option>
                    <option value={1.55}>Moderate (exercise 3-5 times/week)</option>
                    <option value={1.725}>Very Active (exercise 6-7 times/week)</option>
                    <option value={1.9}>Extra Active (very intense exercise daily)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Calculate Macros
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="order-1 lg:order-2">
            {calculatorData.macroGoals ? (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <h2 className="text-2xl font-semibold">Your Daily Targets</h2>
                
                <div className="grid gap-4">
                  <MacroCard
                    label="Daily Calories"
                    value={calculatorData.macroGoals.calories}
                    unit="kcal"
                    color="bg-orange-500/10"
                    textColor="text-orange-500"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <MacroCard
                      label="Protein"
                      value={calculatorData.macroGoals.protein}
                      unit="g"
                      color="bg-blue-500/10"
                      textColor="text-blue-500"
                      percent={30}
                    />
                    <MacroCard
                      label="Carbs"
                      value={calculatorData.macroGoals.carbs}
                      unit="g"
                      color="bg-green-500/10"
                      textColor="text-green-500"
                      percent={40}
                    />
                    <MacroCard
                      label="Fat"
                      value={calculatorData.macroGoals.fat}
                      unit="g"
                      color="bg-purple-500/10"
                      textColor="text-purple-500"
                      percent={30}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">About Your Macros</p>
                      <p className="text-sm text-muted-foreground">
                        These calculations are based on your BMR and activity level. Adjust your intake
                        based on your specific goals and progress.
                      </p>
                      {calculatorData.macroGoals.lastCalculated && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last calculated: {new Date(calculatorData.macroGoals.lastCalculated).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-6 text-center">
                <PieChart className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Calculate Your Macros</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in your details to get personalized macro recommendations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Macro Card Component
function MacroCard({
  label,
  value,
  unit,
  color,
  textColor,
  percent,
}: {
  label: string;
  value: number;
  unit: string;
  color?: string;
  textColor?: string;
  percent?: number;
}) {
  return (
    <div className={`rounded-lg ${color} p-4`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${textColor}`}>{label}</p>
        {percent && (
          <p className="text-xs text-muted-foreground">{percent}%</p>
        )}
      </div>
      <p className={`mt-2 text-2xl font-bold ${textColor}`}>
        {value}
        <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
    </div>
  );
} 
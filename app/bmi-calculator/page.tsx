"use client";

import { useState } from "react";
import { Calculator, Scale, Ruler, Info } from "lucide-react";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmiValue = weightInKg / (heightInM * heightInM);
    setBMI(parseFloat(bmiValue.toFixed(1)));

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 25) setCategory("Normal weight");
    else if (bmiValue < 30) setCategory("Overweight");
    else setCategory("Obese");
  };

  const getCategoryColor = () => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal weight":
        return "text-green-500";
      case "Overweight":
        return "text-orange-500";
      case "Obese":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            BMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your Body Mass Index (BMI) to assess if you&apos;re at a healthy weight
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="order-2 md:order-1">
            <form onSubmit={calculateBMI} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="height" className="text-sm font-medium flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                    placeholder="Enter height in centimeters"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="weight" className="text-sm font-medium flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-background transition-colors hover:border-primary"
                    placeholder="Enter weight in kilograms"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Calculate BMI
              </button>
            </form>
          </div>

          {/* Results Card */}
          <div className="order-1 md:order-2">
            {bmi !== null ? (
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Your Results</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Your BMI is</p>
                    <p className="text-4xl font-bold text-primary">{bmi}</p>
                    <p className={`text-lg font-medium mt-1 ${getCategoryColor()}`}>
                      {category}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">What does this mean?</p>
                        <p className="text-sm text-muted-foreground">
                          BMI is a measure of body fat based on height and weight. However, it&apos;s not a
                          diagnostic tool and should be used as a general guideline.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-md bg-muted">
                        <p className="font-medium">Underweight</p>
                        <p className="text-muted-foreground">Below 18.5</p>
                      </div>
                      <div className="p-3 rounded-md bg-muted">
                        <p className="font-medium">Normal weight</p>
                        <p className="text-muted-foreground">18.5 - 24.9</p>
                      </div>
                      <div className="p-3 rounded-md bg-muted">
                        <p className="font-medium">Overweight</p>
                        <p className="text-muted-foreground">25 - 29.9</p>
                      </div>
                      <div className="p-3 rounded-md bg-muted">
                        <p className="font-medium">Obese</p>
                        <p className="text-muted-foreground">30 or greater</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center h-full gap-2">
                  <Calculator className="h-12 w-12 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Calculate Your BMI</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your height and weight to calculate your Body Mass Index
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
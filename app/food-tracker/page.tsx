"use client";

import { useState, useEffect } from "react";
import { Apple, Search, Plus, Loader2, AlertCircle, Utensils, Scale, Flame, Cookie, Beef, Trash2, Coffee, Sun, Moon, Heart, Settings, type LucideIcon } from "lucide-react";
import type { BrandedFood, SearchResult, SearchResponse, NutritionixResponse } from "./types";
import { useFoodStore } from "../store/foodStore";
import type { NutritionGoals } from "../store/foodStore";
import { useMacroStore } from "../store/macroStore";

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

export default function FoodTracker() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<FoodItem['mealType']>('breakfast');
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  
  const { 
    trackedFoods, 
    favoriteItems,
    nutritionGoals,
    addFood: addFoodToStore, 
    removeFood, 
    clearFoods,
    addToFavorites,
    removeFromFavorites,
    updateNutritionGoals
  } = useFoodStore();

  const { calculatorData } = useMacroStore();

  // Update nutrition goals when macro goals change
  useEffect(() => {
    if (calculatorData.macroGoals) {
      updateNutritionGoals({
        calories: calculatorData.macroGoals.calories,
        protein: calculatorData.macroGoals.protein,
        carbs: calculatorData.macroGoals.carbs,
        fat: calculatorData.macroGoals.fat
      });
    }
  }, [calculatorData.macroGoals, updateNutritionGoals]);

  const addToTracker = (food: FoodItem) => {
    addFoodToStore(food, selectedMealType);
    setSearchResults([]);
    setQuery("");
  };

  const getMealTypeIcon = (mealType: FoodItem['mealType']): LucideIcon => {
    switch (mealType) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sun;
      case 'dinner': return Moon;
      case 'snack': return Cookie;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupedFoods = trackedFoods.reduce((acc, food) => {
    if (!acc[food.mealType]) {
      acc[food.mealType] = [];
    }
    acc[food.mealType].push(food);
    return acc;
  }, {} as Record<FoodItem['mealType'], FoodItem[]>);

  const searchFood = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // First, get instant search results
      const searchResponse = await fetch(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`,
        {
          headers: {
            "x-app-id": process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID!,
            "x-app-key": process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY!,
          },
        }
      );
      
      const searchData = (await searchResponse.json()) as SearchResponse;
      
      // Get detailed nutrition info for each common food
      const commonFoods = await Promise.all(
        searchData.common.slice(0, 5).map(async (item: SearchResult) => {
          const detailResponse = await fetch(
            "https://trackapi.nutritionix.com/v2/natural/nutrients",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-app-id": process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID!,
                "x-app-key": process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY!,
              },
              body: JSON.stringify({
                query: item.food_name,
              }),
            }
          );
          const detailData = (await detailResponse.json()) as NutritionixResponse;
          return detailData.foods?.[0];
        })
      );

      // Get branded foods info
      const brandedFoods = searchData.branded.slice(0, 5).map((item: BrandedFood) => ({
        food_name: item.food_name,
        serving_qty: item.serving_qty,
        serving_unit: item.serving_unit,
        nf_calories: item.nf_calories,
        nf_protein: item.nf_protein || 0,
        nf_total_carbohydrate: item.nf_total_carbohydrate || 0,
        nf_total_fat: item.nf_total_fat || 0,
        brand_name: item.brand_name,
        mealType: 'breakfast',
        timestamp: new Date().toISOString(),
      }));

      // Combine and filter out null results
      const combinedResults = [...commonFoods, ...brandedFoods]
        .filter(Boolean)
        .map(food => ({
          ...food,
          mealType: selectedMealType,
          timestamp: new Date().toISOString()
        }));
      setSearchResults(combinedResults);
    } catch (error) {
      console.error("Error searching for food:", error);
      setError("Failed to search for food. Please try again.");
    }
    setLoading(false);
  };

  const getTotalNutrients = () => {
    const totals: NutritionGoals = trackedFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.nf_calories,
        protein: acc.protein + food.nf_protein,
        carbs: acc.carbs + food.nf_total_carbohydrate,
        fat: acc.fat + food.nf_total_fat,
        isFromCalculator: false
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, isFromCalculator: false }
    );
    return totals;
  };

  const getNutritionProgress = () => {
    const totals = getTotalNutrients();
    return {
      calories: (totals.calories / nutritionGoals.calories) * 100,
      protein: (totals.protein / nutritionGoals.protein) * 100,
      carbs: (totals.carbs / nutritionGoals.carbs) * 100,
      fat: (totals.fat / nutritionGoals.fat) * 100,
    };
  };

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Apple className="h-8 w-8 text-primary" />
              Food Tracker
            </h1>
            <p className="text-muted-foreground">
              Track your daily food intake and monitor your nutrition
            </p>
          </div>
          <button
            onClick={() => setShowGoalsModal(true)}
            className="p-2 hover:bg-accent rounded-full"
            aria-label="Set nutrition goals"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Nutrition Goals Progress */}
        <div className="grid gap-4">
          <h2 className="font-semibold">Daily Goals Progress</h2>
          <div className="grid gap-3">
            {Object.entries(getNutritionProgress()).map(([nutrient, progress]) => (
              <div key={nutrient} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{nutrient}</span>
                  <span className="text-muted-foreground">
                    {Math.round(getTotalNutrients()[nutrient as 'calories' | 'protein' | 'carbs' | 'fat'])}
                    {nutrient === 'calories' ? 'kcal' : 'g'} /
                    {nutritionGoals[nutrient as keyof NutritionGoals]}
                    {nutrient === 'calories' ? 'kcal' : 'g'}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search and Favorites Section */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as FoodItem['mealType'])}
                    className="p-2 border rounded-lg bg-background"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <form onSubmit={searchFood} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full p-3 pr-10 border rounded-lg bg-background transition-colors hover:border-primary"
                        placeholder="Search food (e.g., '1 apple' or '100g chicken')"
                        disabled={loading}
                      />
                      {loading && (
                        <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      disabled={loading || !query.trim()}
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </form>

                <div className="space-y-4">
                  {searchResults.map((food, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <h3 className="font-medium capitalize truncate">
                            {food.food_name}
                            {food.brand_name && (
                              <span className="text-sm text-muted-foreground ml-2">
                                by {food.brand_name}
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {food.serving_qty} {food.serving_unit}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            {Math.round(food.nf_calories)} cal
                          </span>
                          <span className="flex items-center gap-1">
                            <Beef className="h-4 w-4 text-blue-500" />
                            {Math.round(food.nf_protein)}g protein
                          </span>
                          <span className="flex items-center gap-1">
                            <Cookie className="h-4 w-4 text-green-500" />
                            {Math.round(food.nf_total_carbohydrate)}g carbs
                          </span>
                          <span className="flex items-center gap-1">
                            <Scale className="h-4 w-4 text-purple-500" />
                            {Math.round(food.nf_total_fat)}g fat
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToFavorites(food)}
                          className="p-2 hover:bg-accent rounded-full"
                          aria-label="Add to favorites"
                        >
                          <Heart className="h-4 w-4 text-red-500" />
                        </button>
                        <button
                          onClick={() => addToTracker(food)}
                          className="p-2 hover:bg-accent rounded-full"
                        >
                          <Plus className="h-4 w-4 text-primary" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Favorites Section */}
            {favoriteItems.length > 0 && (
              <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Favorite Foods
                </h2>
                <div className="space-y-3">
                  {favoriteItems.map((food, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary transition-colors">
                      <div>
                        <h3 className="font-medium capitalize">{food.food_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {food.serving_qty} {food.serving_unit} • {Math.round(food.nf_calories)} cal
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addFoodToStore(food, selectedMealType)}
                          className="p-2 hover:bg-accent rounded-full"
                          aria-label="Add to tracker"
                        >
                          <Plus className="h-4 w-4 text-primary" />
                        </button>
                        <button
                          onClick={() => removeFromFavorites(index)}
                          className="p-2 hover:bg-accent rounded-full"
                          aria-label="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tracked Foods Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MacroCard
                icon={Flame}
                label="Calories"
                value={Math.round(getTotalNutrients().calories)}
                unit="kcal"
                color="text-orange-500"
              />
              <MacroCard
                icon={Beef}
                label="Protein"
                value={Math.round(getTotalNutrients().protein)}
                unit="g"
                color="text-blue-500"
              />
              <MacroCard
                icon={Cookie}
                label="Carbs"
                value={Math.round(getTotalNutrients().carbs)}
                unit="g"
                color="text-green-500"
              />
              <MacroCard
                icon={Scale}
                label="Fat"
                value={Math.round(getTotalNutrients().fat)}
                unit="g"
                color="text-purple-500"
              />
            </div>

            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Today&apos;s Food Log</h2>
                {trackedFoods.length > 0 && (
                  <button
                    onClick={clearFoods}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="divide-y">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
                  const foods = groupedFoods[mealType] || [];
                  if (foods.length === 0) return null;

                  const MealIcon = getMealTypeIcon(mealType);
                  return (
                    <div key={mealType} className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <MealIcon className="h-5 w-5 text-primary" />
                        <h3 className="font-medium capitalize">{mealType}</h3>
                      </div>
                      <div className="space-y-4">
                        {foods.map((food, index) => (
                          <div key={index} className="pl-7">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium capitalize">{food.food_name}</h4>
                                  <span className="text-sm text-muted-foreground">
                                    {formatTime(food.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {food.serving_qty} {food.serving_unit}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="text-sm font-medium">
                                  {Math.round(food.nf_calories)} cal
                                </p>
                                <button
                                  onClick={() => removeFood(index)}
                                  className="text-muted-foreground hover:text-red-500 transition-colors"
                                  aria-label="Remove food item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                              <span>P: {Math.round(food.nf_protein)}g</span>
                              <span>C: {Math.round(food.nf_total_carbohydrate)}g</span>
                              <span>F: {Math.round(food.nf_total_fat)}g</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {trackedFoods.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No foods logged yet today</p>
                    <p className="text-sm">Search for foods to add them to your log</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-semibold">Set Nutrition Goals</h2>
            <div className="space-y-4">
              {Object.entries(nutritionGoals).map(([nutrient, value]) => (
                <div key={nutrient} className="space-y-2">
                  <label className="block text-sm capitalize">
                    {nutrient} ({nutrient === 'calories' ? 'kcal' : 'g'})
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateNutritionGoals({ [nutrient]: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                    min="0"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowGoalsModal(false)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MacroCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold">
        {value}
        <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
    </div>
  );
} 
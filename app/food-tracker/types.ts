interface CommonFood {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
}

interface BrandedFood {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  nf_total_fat: number;
  brand_name: string;
}

interface SearchResult {
  food_name: string;
}

interface SearchResponse {
  common: SearchResult[];
  branded: BrandedFood[];
}

interface NutritionixResponse {
  foods: CommonFood[];
}

export type { CommonFood, BrandedFood, SearchResult, SearchResponse, NutritionixResponse }; 
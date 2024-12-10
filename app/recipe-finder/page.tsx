"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChefHat, Search, Clock, Users, X, Loader2, AlertCircle, Utensils, Flame } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  healthScore: number;
  diets: string[];
  instructions?: string;
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
      ingredients?: Array<{
        id: number;
        name: string;
      }>;
    }>;
  }>;
  extendedIngredients: {
    id: number;
    original: string;
    amount: number;
    unit: string;
    name: string;
  }[];
  cuisines: string[];
  dishTypes: string[];
}

export default function RecipeFinder() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const loadRecipes = useCallback(async (searchQuery: string, pageNum: number, isNewSearch: boolean = false) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
          process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY
        }&query=${encodeURIComponent(searchQuery)}&offset=${
          (pageNum - 1) * 12
        }&number=12&addRecipeInformation=true&instructionsRequired=true&fillIngredients=true`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }

      if (isNewSearch) {
        setRecipes(data.results);
      } else {
        setRecipes(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.totalResults > pageNum * 12);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setError("Failed to search recipes. Please try again.");
    }
  }, []);

  const searchRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPage(1);
    await loadRecipes(query, 1, true);
    setLoading(false);
  };

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const currentLoader = loader.current;
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && query) {
        setPage(prev => prev + 1);
      }
    }, options);

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading, query]);

  // Load more recipes when page changes
  useEffect(() => {
    if (page > 1 && query) {
      setLoading(true);
      loadRecipes(query, page, false).finally(() => setLoading(false));
    }
  }, [page, query, loadRecipes]);

  const renderInstructions = (recipe: Recipe) => {
    if (recipe.instructions && typeof recipe.instructions === 'string') {
      const steps = recipe.instructions
        .split('\n')
        .filter(step => step.trim().length > 0)
        .map((step, index) => ({
          number: index + 1,
          text: step.trim()
        }));
      
      return steps.map(step => (
        <div key={`text-step-${recipe.id}-${step.number}`} className="flex gap-4">
          <div className="flex-none">
            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
              {step.number}
            </div>
          </div>
          <p className="text-sm">{step.text}</p>
        </div>
      ));
    }

    const steps = recipe.analyzedInstructions?.[0]?.steps;
    if (steps && steps.length > 0) {
      return steps.map(step => (
        <div key={`analyzed-step-${recipe.id}-${step.number}`} className="flex gap-4">
          <div className="flex-none">
            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
              {step.number}
            </div>
          </div>
          <p className="text-sm">{step.step}</p>
        </div>
      ));
    }

    return (
      <div key="no-instructions" className="text-muted-foreground">
        No instructions available for this recipe.
      </div>
    );
  };

  return (
    <div className="container max-w-7xl py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            Recipe Finder
          </h1>
          <p className="text-muted-foreground">
            Discover healthy and delicious recipes for your meal planning
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={searchRecipes} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg bg-background transition-colors hover:border-primary"
                  placeholder="Search recipes (e.g., 'chicken pasta' or 'vegetarian')"
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
        </div>

        {/* Recipe Grid */}
        {recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group rounded-lg border bg-card overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      priority={true}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/recipe-placeholder.jpg'; // Add a placeholder image
                      }}
                    />
                    {recipe.healthScore >= 80 && (
                      <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        Healthy Choice
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.readyInMinutes}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    {recipe.diets?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.diets.slice(0, 2).map((diet) => (
                          <span
                            key={diet}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {diet}
                          </span>
                        ))}
                        {recipe.diets.length > 2 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            +{recipe.diets.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Loading indicator for infinite scroll */}
            <div ref={loader} className="w-full py-8 flex justify-center">
              {loading && hasMore && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              )}
              {!hasMore && recipes.length > 0 && (
                <p className="text-muted-foreground">No more recipes to load</p>
              )}
            </div>
          </>
        ) : !loading && query && (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">No recipes found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-background rounded-lg border shadow-lg">
                <div className="relative">
                  <div className="aspect-[2/1] relative">
                    <Image
                      src={selectedRecipe.image}
                      alt={selectedRecipe.title}
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover w-full h-full rounded-t-lg"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/recipe-placeholder.jpg';
                      }}
                    />
                    <button
                      onClick={() => setSelectedRecipe(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedRecipe.title}</h2>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <span>{selectedRecipe.readyInMinutes} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <span>{selectedRecipe.servings} servings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-5 w-5 text-muted-foreground" />
                          <span>Health Score: {selectedRecipe.healthScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-4 mb-6">
                      {selectedRecipe.diets?.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Dietary Info</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedRecipe.diets.map((diet) => (
                              <span
                                key={diet}
                                className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
                              >
                                {diet}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selectedRecipe.cuisines?.length > 0 && (
                          <div>
                            <h3 className="font-medium mb-2">Cuisine</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedRecipe.cuisines.map((cuisine) => (
                                <span
                                  key={cuisine}
                                  className="text-sm px-3 py-1 rounded-full bg-accent"
                                >
                                  {cuisine}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedRecipe.dishTypes?.length > 0 && (
                          <div>
                            <h3 className="font-medium mb-2">Dish Type</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedRecipe.dishTypes.map((type) => (
                                <span
                                  key={type}
                                  className="text-sm px-3 py-1 rounded-full bg-accent"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="font-medium mb-2">About</h3>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}
                      />
                    </div>

                    {/* Ingredients */}
                    <div className="mb-8">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4">Ingredients</h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {selectedRecipe.extendedIngredients?.map((ingredient) => (
                          <div
                            key={ingredient.id}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-sm">{ingredient.original}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-4">Instructions</h3>
                      <div className="space-y-4">
                        {renderInstructions(selectedRecipe)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
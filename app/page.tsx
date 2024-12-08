"use client";

import Link from "next/link";
import { Calculator, Apple, ChefHat, PieChart, ArrowRight } from "lucide-react";

const features = [
  {
    href: "/bmi-calculator",
    icon: Calculator,
    title: "BMI Calculator",
    description: "Calculate and track your Body Mass Index",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    href: "/food-tracker",
    icon: Apple,
    title: "Food Tracker",
    description: "Track your daily food intake and nutrition",
    color: "bg-green-500/10 text-green-500",
  },
  {
    href: "/recipe-finder",
    icon: ChefHat,
    title: "Recipe Finder",
    description: "Discover healthy and delicious recipes",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    href: "/macro-tracker",
    icon: PieChart,
    title: "Macro Tracker",
    description: "Monitor your daily macro nutrients",
    color: "bg-purple-500/10 text-purple-500",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center py-12 sm:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Your Journey to a{" "}
                <span className="text-primary">Healthier Lifestyle</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Track your nutrition, discover recipes, and achieve your health goals with our comprehensive toolkit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <ArrowRight className="absolute right-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t bg-muted/50">
        <div className="container px-4 md:px-6 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-background border">
              <h3 className="font-semibold mb-2">Comprehensive Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your nutrition, BMI, and macro nutrients all in one place.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border">
              <h3 className="font-semibold mb-2">Recipe Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Find delicious and healthy recipes tailored to your preferences.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border">
              <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations based on your health data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  Calculator, 
  Apple, 
  ChefHat, 
  PieChart, 
  LogIn, 
  LogOut, 
  User 
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  {
    href: "/bmi-calculator",
    icon: Calculator,
    title: "BMI Calculator",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    href: "/food-tracker",
    icon: Apple,
    title: "Food Tracker",
    color: "bg-green-500/10 text-green-500",
  },
  {
    href: "/recipe-finder",
    icon: ChefHat,
    title: "Recipe Finder",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    href: "/macro-tracker",
    icon: PieChart,
    title: "Macro Tracker",
    color: "bg-purple-500/10 text-purple-500",
  },
];

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-bold flex items-center gap-2"
        >
          Nutrition Tracker
        </Link>

        <nav className="flex items-center gap-4">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="group flex items-center gap-2 hover:bg-accent p-2 rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <span className="hidden md:block text-sm">{item.title}</span>
            </Link>
          ))}

          {session ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 hover:bg-accent p-2 rounded-lg transition-colors"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="hidden md:block text-sm">
                  {session.user?.name || session.user?.email}
                </span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 hover:bg-destructive/10 text-destructive p-2 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:block text-sm">Sign Out</span>
              </button>
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/signin" 
                className="flex items-center gap-2 hover:bg-accent p-2 rounded-lg transition-colors"
              >
                <LogIn className="h-5 w-5 text-muted-foreground" />
                <span className="hidden md:block text-sm">Sign In</span>
              </Link>
              <ThemeToggle />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
} 
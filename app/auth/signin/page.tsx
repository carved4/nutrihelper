"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, User, Mail, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign In
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl
        });

        console.log('Sign in result:', result);

        if (result?.error) {
          setError('Invalid email or password');
          setLoading(false);
          return;
        }

        if (result?.ok) {
          // Force a hard navigation to ensure session is properly initialized
          window.location.href = result.url || callbackUrl;
        } else {
          setError('Sign in failed');
        }
      } else {
        // Sign Up
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const signUpResponse = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await signUpResponse.json();

        if (!signUpResponse.ok) {
          setError(data.error || 'Signup failed');
          setLoading(false);
          return;
        }

        // Automatically sign in after successful signup
        const signInResult = await signIn('credentials', {
          redirect: false,
          email,
          password
        });

        if (signInResult?.ok) {
          router.push('/');
        } else {
          setError('Signup successful, but login failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isSignIn 
              ? 'Welcome back to Nutrition Tracker' 
              : 'Create your Nutrition Tracker account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isSignIn && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required={!isSignIn}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
              minLength={6}
            />
          </div>

          {!isSignIn && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required={!isSignIn}
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin">🔄</span>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" /> 
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-primary hover:underline"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
} 
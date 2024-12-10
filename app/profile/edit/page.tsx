"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Weight, Ruler, Calendar, Users, Activity } from "lucide-react";

// Conversion functions
const kgToLbs = (kg: number) => (kg * 2.20462).toFixed(1);
const lbsToKg = (lbs: number) => (lbs / 2.20462).toFixed(1);
const cmToFeetInches = (cm: number) => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return { feet, inches: remainingInches };
};
const feetInchesToCm = (feet: number, inches: number) => {
  const totalInches = (feet * 12) + inches;
  return (totalInches * 2.54).toFixed(1);
};

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    weightLbs: "",
    heightFeet: "",
    heightInches: "",
    age: "",
    gender: "",
    activityLevel: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session.user) {
      // Convert metric to imperial for display
      const weight = session.user.weight ? kgToLbs(session.user.weight) : "";
      const height = session.user.height ? cmToFeetInches(session.user.height) : { feet: "", inches: "" };
      
      setFormData({
        name: session.user.name || "",
        weightLbs: weight,
        heightFeet: height.feet?.toString() || "",
        heightInches: height.inches?.toString() || "",
        age: session.user.age?.toString() || "",
        gender: session.user.gender || "",
        activityLevel: session.user.activityLevel?.toString() || ""
      });
      setLoading(false);
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Convert imperial to metric for storage
      const weightKg = formData.weightLbs ? parseFloat(lbsToKg(parseFloat(formData.weightLbs))) : null;
      const heightCm = (formData.heightFeet && formData.heightInches) 
        ? parseFloat(feetInchesToCm(
            parseInt(formData.heightFeet), 
            parseInt(formData.heightInches)
          ))
        : null;

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          weight: weightKg,
          height: heightCm,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || null,
          activityLevel: formData.activityLevel ? parseInt(formData.activityLevel) : null
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      await update();
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-primary">🔄</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-md p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Edit Profile</h1>
            <p className="text-muted-foreground">Update your profile information</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weightLbs}
                onChange={(e) => setFormData({ ...formData, weightLbs: e.target.value })}
                className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter weight in pounds"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Height</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.heightFeet}
                    onChange={(e) => setFormData({ ...formData, heightFeet: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Feet"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.heightInches}
                    onChange={(e) => setFormData({ ...formData, heightInches: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Inches"
                    min="0"
                    max="11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                className="w-full p-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select activity level</option>
                <option value="1">Sedentary</option>
                <option value="2">Lightly Active</option>
                <option value="3">Moderately Active</option>
                <option value="4">Very Active</option>
                <option value="5">Extra Active</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="flex-1 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <span className="animate-spin">🔄</span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
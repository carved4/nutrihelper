"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Weight, Ruler, Calendar, Users, Activity } from "lucide-react";

// Conversion functions
const kgToLbs = (kg: number) => (kg * 2.20462).toFixed(1);
const cmToFeetInches = (cm: number) => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}'${remainingInches}"`;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

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
            <h1 className="text-3xl font-bold text-primary">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{session?.user?.name || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session?.user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Weight className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium">
                  {session?.user?.weight 
                    ? `${kgToLbs(session.user.weight)} lbs` 
                    : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Ruler className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-medium">
                  {session?.user?.height 
                    ? cmToFeetInches(session.user.height)
                    : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{session?.user?.age || "Not set"} years</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{session?.user?.gender || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Activity Level</p>
                <p className="font-medium">
                  {session?.user?.activityLevel 
                    ? `Level ${session.user.activityLevel}`
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => router.push("/profile/edit")}
              className="w-full bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
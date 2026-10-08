"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole, LanguageCode, Region } from "@/types";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/config";
import { DEFAULT_REGION } from "@/lib/region/config";
import {
  auth,
  signInWithGoogle as fbSignInGoogle,
  signInAsGuest as fbSignInGuest,
  logOut as fbLogOut,
  ensureUserProfile,
} from "@/lib/firebase/client";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  language: LanguageCode;
  region: Region;
  setLanguage: (lang: LanguageCode) => void;
  setRegion: (region: Region) => void;
  switchRole: (role: UserRole) => void;
  loginGoogle: () => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default mock guest for immediate offline fallback
const DEFAULT_GUEST_USER: User = {
  id: "guest-default-01",
  email: "guest@newsengine.local",
  displayName: "Guest Reader",
  photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=guest",
  role: "reader",
  credibilityLevel: 1,
  createdAt: Date.now(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_GUEST_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [region, setRegionState] = useState<Region>(DEFAULT_REGION);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("newsengine_lang") as LanguageCode | null;
      if (storedLang) setLanguageState(storedLang);

      const storedRegion = localStorage.getItem("newsengine_region");
      if (storedRegion) {
        try {
          setRegionState(JSON.parse(storedRegion));
        } catch (e) {
          console.warn("Failed to parse stored region", e);
        }
      }

      // Check stored custom user role override for demo convenience
      const storedRole = localStorage.getItem("newsengine_demo_role") as UserRole | null;
      if (storedRole && user) {
        setUser((prev) => (prev ? { ...prev, role: storedRole } : prev));
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("newsengine_lang", lang);
    }
  };

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    if (typeof window !== "undefined") {
      localStorage.setItem("newsengine_region", JSON.stringify(newRegion));
    }
  };

  // Allow switching roles for testing authorization / contributor / editor permissions
  const switchRole = (newRole: UserRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole } : { ...DEFAULT_GUEST_USER, role: newRole }));
    if (typeof window !== "undefined") {
      localStorage.setItem("newsengine_demo_role", newRole);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const profile = await ensureUserProfile(fbUser);
        const storedRole = (typeof window !== "undefined" && localStorage.getItem("newsengine_demo_role")) as UserRole | null;
        setUser({
          ...profile,
          role: storedRole || profile.role,
        });
      } else {
        const storedRole = (typeof window !== "undefined" && localStorage.getItem("newsengine_demo_role")) as UserRole | null;
        setUser({
          ...DEFAULT_GUEST_USER,
          role: storedRole || "reader",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const fbUser = await fbSignInGoogle();
      const profile = await ensureUserProfile(fbUser);
      setUser(profile);
    } catch (err) {
      console.warn("Google sign in fallback:", err);
      // Fallback demo user
      setUser({
        id: "google-demo-user",
        email: "editor.demo@newsengine.com",
        displayName: "Zee Media Editor",
        photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=editor",
        role: "editor",
        credibilityLevel: 4,
        createdAt: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const loginGuest = async () => {
    setLoading(true);
    try {
      const fbUser = await fbSignInGuest();
      const profile = await ensureUserProfile(fbUser, "reader", true);
      setUser(profile);
    } catch (err) {
      console.warn("Guest sign in fallback:", err);
      setUser(DEFAULT_GUEST_USER);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fbLogOut();
    } catch (e) {
      console.warn("Log out error:", e);
    }
    setUser(DEFAULT_GUEST_USER);
    if (typeof window !== "undefined") {
      localStorage.removeItem("newsengine_demo_role");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role: user?.role || "reader",
        language,
        region,
        setLanguage,
        setRegion,
        switchRole,
        loginGoogle,
        loginGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ReadingPreferences } from "@/types/story";

const defaultPreferences: ReadingPreferences = {
  fontSize: 20,
  fontFamily: "lato",
  theme: "light",
  lineHeight: "relaxed",
  letterSpacing: "normal",
  textOpacity: 1.0,
};

interface ThemeContextType {
  preferences: ReadingPreferences;
  updatePreferences: (preferences: ReadingPreferences) => void;
  getThemeClasses: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "reading-preferences";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] =
    useState<ReadingPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge stored preferences with defaults to handle missing fields
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load preferences from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  const updatePreferences = (newPreferences: ReadingPreferences) => {
    setPreferences(newPreferences);
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      console.error("Failed to save preferences to localStorage:", error);
    }
  };

  const getThemeClasses = () => {
    return "min-h-screen";
  };

  useEffect(() => {
    if (isLoaded) {
      const htmlElement = document.documentElement;
      // Set data-theme attribute for backward compatibility
      htmlElement.setAttribute("data-theme", preferences.theme);
      // Toggle dark class for new theme system
      if (preferences.theme === "dark") {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    }
  }, [preferences.theme, isLoaded]);

  return (
    <ThemeContext.Provider
      value={{ preferences, updatePreferences, getThemeClasses }}
    >
      <div className={`min-h-screen ${getThemeClasses()}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

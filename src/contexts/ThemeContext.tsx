'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ReadingPreferences } from '@/types/story';

const defaultPreferences: ReadingPreferences = {
  fontSize: 16,
  fontFamily: 'lato',
  theme: 'light',
  lineHeight: 'relaxed',
  letterSpacing: 'normal',
  textOpacity: 1.0,
};

interface ThemeContextType {
  preferences: ReadingPreferences;
  updatePreferences: (preferences: ReadingPreferences) => void;
  getThemeClasses: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<ReadingPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const updatePreferences = (newPreferences: ReadingPreferences) => {
    setPreferences(newPreferences);
  };

  const getThemeClasses = () => {
    return 'min-h-screen';
  };

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-theme', preferences.theme);
    }
  }, [preferences.theme, isLoaded]);

  return (
    <ThemeContext.Provider value={{ preferences, updatePreferences, getThemeClasses }}>
      <div className={`min-h-screen ${getThemeClasses()}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
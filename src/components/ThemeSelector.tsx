'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSelector() {
  const { preferences, updatePreferences } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'sepia', label: 'Sepia', icon: '📜' },
    { value: 'high-contrast', label: 'High Contrast', icon: '⚫' },
  ] as const;

  const currentTheme = themes.find(theme => theme.value === preferences.theme);

  const handleThemeChange = (theme: typeof preferences.theme) => {
    updatePreferences({
      ...preferences,
      theme,
    });
    setIsOpen(false);
  };


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary flex items-center space-x-2"
      >
        <span>{currentTheme?.icon}</span>
        <span className="text-sm">{currentTheme?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 surface-elevated rounded-xl shadow-xl z-20">
            <div className="py-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:surface ${
                    preferences.theme === theme.value ? 'font-semibold text-primary' : 'text-secondary'
                  }`}
                >
                  <span className="mr-3">{theme.icon}</span>
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
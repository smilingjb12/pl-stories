'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSelector() {
  const { preferences, updatePreferences } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
  ] as const;

  const handleThemeChange = (theme: typeof preferences.theme) => {
    if (preferences.theme === theme) {
      return;
    }

    updatePreferences({
      ...preferences,
      theme,
    });
  };

  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-elevated/50 p-1">
      {themes.map((theme) => {
        const isActive = preferences.theme === theme.value;

        return (
          <button
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className={`flex h-10 w-10 items-center justify-center text-lg transition-all duration-200 rounded-md ${
              isActive
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'text-secondary hover:text-primary hover:bg-surface'
            }`}
            type="button"
            aria-pressed={isActive}
            aria-label={theme.label}
            title={theme.label}
          >
            <span>{theme.icon}</span>
          </button>
        );
      })}
    </div>
  );
}

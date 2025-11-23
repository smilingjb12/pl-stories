"use client";

import { useTheme } from "@/contexts/ThemeContext";

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default function ThemeSelector() {
  const { preferences, updatePreferences } = useTheme();

  const toggleTheme = () => {
    const newTheme = preferences.theme === "light" ? "dark" : "light";
    updatePreferences({
      ...preferences,
      theme: newTheme,
    });
  };

  // Show the icon for the current theme
  const isDarkMode = preferences.theme === "dark";
  const IconComponent = isDarkMode ? MoonIcon : SunIcon;
  const currentThemeLabel = isDarkMode ? "Dark" : "Light";
  const nextThemeLabel = isDarkMode ? "Light" : "Dark";
  const ariaLabel = `Switch from ${currentThemeLabel} to ${nextThemeLabel} mode`;

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-elevated/50 text-muted-foreground transition-all duration-200 hover:text-primary hover:bg-surface"
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <IconComponent className="h-5 w-5" />
    </button>
  );
}

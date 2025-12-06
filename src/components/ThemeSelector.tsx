"use client";

import { useTheme } from "@/contexts/ThemeContext";

// Sun icon for light mode
const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
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

// Moon icon for dark mode
const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
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

  const isDarkMode = preferences.theme === "dark";
  const ariaLabel = isDarkMode
    ? "Switch to light mode"
    : "Switch to dark mode";

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-2.5 rounded-lg
        text-text-secondary hover:text-primary
        hover:bg-primary/5
        transition-all duration-300"
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {/* Icon container with rotation animation */}
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <SunIcon
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-500
            ${isDarkMode
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
            }
          `}
        />
        {/* Moon icon */}
        <MoonIcon
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-500
            ${isDarkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
            }
          `}
        />
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-primary/10 to-transparent
          transition-opacity duration-300 pointer-events-none"
      />
    </button>
  );
}

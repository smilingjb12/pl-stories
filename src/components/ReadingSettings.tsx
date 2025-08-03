"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { ReadingPreferences } from "@/types/story";

interface ReadingSettingsProps {
  preferences: ReadingPreferences;
  onPreferencesChange: (preferences: ReadingPreferences) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadingSettings({
  preferences,
  onPreferencesChange,
  isOpen,
  onClose,
}: ReadingSettingsProps) {
  const { getThemeClasses } = useTheme();

  if (!isOpen) return null;

  const updatePreference = <K extends keyof ReadingPreferences>(
    key: K,
    value: ReadingPreferences[K]
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  const getModalClasses = () => {
    switch (preferences.theme) {
      case "dark":
        return "bg-gray-800 text-gray-100";
      case "sepia":
        return "bg-amber-100 text-amber-900";
      case "high-contrast":
        return "bg-gray-900 text-white";
      default:
        return "bg-white text-gray-800";
    }
  };

  const getCloseButtonClasses = () => {
    switch (preferences.theme) {
      case "dark":
        return "text-gray-400 hover:text-gray-200";
      case "sepia":
        return "text-amber-700 hover:text-amber-900";
      case "high-contrast":
        return "text-gray-300 hover:text-white";
      default:
        return "text-gray-500 hover:text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-10 pointer-events-auto"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out overflow-y-auto ${getModalClasses()}`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Reading Settings</h2>
            <button
              onClick={onClose}
              className={`text-2xl ${getCloseButtonClasses()}`}
            >
              ×
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Size
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Smaller</span>
                  <span>{preferences.fontSize}px</span>
                  <span>Larger</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={preferences.fontSize}
                  onChange={(e) =>
                    updatePreference("fontSize", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Text Opacity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Opacity
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Lighter</span>
                  <span>{Math.round(preferences.textOpacity * 100)}%</span>
                  <span>Darker</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.1"
                  value={preferences.textOpacity}
                  onChange={(e) =>
                    updatePreference("textOpacity", parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Font Family
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(
                  [
                    "montserrat",
                    "lato",
                    "poppins",
                    "playfair",
                    "source-sans",
                    "raleway",
                  ] as const
                ).map((font) => (
                  <button
                    key={font}
                    onClick={() => updatePreference("fontFamily", font)}
                    className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                      preferences.fontFamily === font
                        ? "bg-primary-500 text-white border-primary-500 shadow-md"
                        : "border-border hover:border-primary-300 hover:shadow-sm"
                    } ${
                      font === "montserrat"
                        ? "font-montserrat"
                        : font === "lato"
                        ? "font-lato"
                        : font === "poppins"
                        ? "font-poppins"
                        : font === "playfair"
                        ? "font-playfair"
                        : font === "source-sans"
                        ? "font-source-sans"
                        : "font-raleway"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {font === "montserrat"
                          ? "Montserrat"
                          : font === "lato"
                          ? "Lato"
                          : font === "poppins"
                          ? "Poppins"
                          : font === "playfair"
                          ? "Playfair Display"
                          : font === "source-sans"
                          ? "Source Sans Pro"
                          : "Raleway"}
                      </span>
                      <span className="text-xs opacity-75 mt-1">
                        {font === "montserrat"
                          ? "Modern classic elegance"
                          : font === "lato"
                          ? "Serious but friendly"
                          : font === "poppins"
                          ? "Rounded & widely popular"
                          : font === "playfair"
                          ? "Elegant serif with contrast"
                          : font === "source-sans"
                          ? "Adobe's professional font"
                          : "Sleek & sophisticated"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["light", "dark", "sepia", "high-contrast"] as const).map(
                  (theme) => (
                    <button
                      key={theme}
                      onClick={() => updatePreference("theme", theme)}
                      className={`p-2 text-center rounded-lg border transition-all duration-200 ${
                        preferences.theme === theme
                          ? "bg-primary-500 text-white border-primary-500 shadow-md"
                          : "border-border hover:border-primary-300 hover:shadow-sm"
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() +
                        theme.slice(1).replace("-", " ")}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Line Height
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "relaxed", "loose"] as const).map((height) => (
                  <button
                    key={height}
                    onClick={() => updatePreference("lineHeight", height)}
                    className={`p-2 text-center rounded-lg border transition-all duration-200 ${
                      preferences.lineHeight === height
                        ? "bg-primary-500 text-white border-primary-500 shadow-md"
                        : "border-border hover:border-primary-300 hover:shadow-sm"
                    }`}
                  >
                    {height.charAt(0).toUpperCase() + height.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Spacing */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Line Spacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "wide", "wider"] as const).map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => updatePreference("letterSpacing", spacing)}
                    className={`p-2 text-center rounded-lg border transition-all duration-200 ${
                      preferences.letterSpacing === spacing
                        ? "bg-primary-500 text-white border-primary-500 shadow-md"
                        : "border-border hover:border-primary-300 hover:shadow-sm"
                    }`}
                  >
                    {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

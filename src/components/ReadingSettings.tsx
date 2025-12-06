"use client";

import { useEffect, useRef } from "react";
import { ReadingPreferences } from "@/types/story";

interface ReadingSettingsProps {
  preferences: ReadingPreferences;
  onPreferencesChange: (preferences: ReadingPreferences) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Close icon
const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ReadingSettings({
  preferences,
  onPreferencesChange,
  isOpen,
  onClose,
}: ReadingSettingsProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

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

  const lineHeightOptions = [
    { value: "normal", label: "Compact" },
    { value: "relaxed", label: "Relaxed" },
    { value: "loose", label: "Spacious" },
  ] as const;

  const letterSpacingOptions = [
    { value: "normal", label: "Normal" },
    { value: "wide", label: "Wide" },
    { value: "wider", label: "Wider" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        style={{ animationDuration: "0.2s" }}
      />

      {/* Side Panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm
          glassmorphism shadow-2xl
          animate-slide-in-right overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border/30">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Reading Settings
              </h2>
              <p className="text-sm text-text-muted mt-0.5">
                Customize your reading experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-foreground
                hover:bg-surface transition-all duration-200"
              aria-label="Close settings"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Font Size
                </label>
                <span className="text-sm font-semibold text-primary">
                  {preferences.fontSize}px
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="14"
                  max="28"
                  step="1"
                  value={preferences.fontSize}
                  onChange={(e) =>
                    updatePreference("fontSize", parseInt(e.target.value))
                  }
                  className="slider w-full"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Smaller</span>
                  <span>Larger</span>
                </div>
              </div>
            </div>

            {/* Text Opacity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Text Opacity
                </label>
                <span className="text-sm font-semibold text-primary">
                  {Math.round(preferences.textOpacity * 100)}%
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={preferences.textOpacity}
                  onChange={(e) =>
                    updatePreference("textOpacity", parseFloat(e.target.value))
                  }
                  className="slider w-full"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Softer</span>
                  <span>Darker</span>
                </div>
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                Line Height
              </label>
              <div className="grid grid-cols-3 gap-2">
                {lineHeightOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePreference("lineHeight", option.value)}
                    className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-300
                      ${preferences.lineHeight === option.value
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-surface text-text-secondary hover:bg-surface-elevated hover:text-foreground border border-border/50"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                Letter Spacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {letterSpacingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updatePreference("letterSpacing", option.value)}
                    className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-300
                      ${preferences.letterSpacing === option.value
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-surface text-text-secondary hover:bg-surface-elevated hover:text-foreground border border-border/50"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

<<<<<<< HEAD
            {/* Preview */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                Preview
              </label>
              <div className="p-4 rounded-xl bg-surface border border-border/50">
                <p
                  className={`
                    reading-text text-text-primary
                    ${preferences.lineHeight === "normal" ? "leading-normal" : preferences.lineHeight === "loose" ? "leading-loose" : "leading-relaxed"}
                    ${preferences.letterSpacing === "wide" ? "tracking-wide" : preferences.letterSpacing === "wider" ? "tracking-wider" : "tracking-normal"}
                  `}
                  style={{
                    fontSize: `${Math.min(preferences.fontSize, 18)}px`,
                    opacity: preferences.textOpacity,
                  }}
                >
                  Pewnego razu, w małej wiosce nad brzegiem jeziora, żyła młoda dziewczyna imieniem Anna.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border/30">
            <button
              onClick={onClose}
              className="w-full btn-primary py-3"
            >
              Done
            </button>
=======
            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Text Alignment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["left", "justify"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updatePreference("textAlign", align)}
                    className={`p-2 text-center rounded-lg border transition-all duration-200 ${
                      preferences.textAlign === align
                        ? "bg-primary text-primary-foreground border-primary shadow-lg"
                        : "border-border hover:border-primary hover:shadow-sm hover:bg-gradient-to-r hover:from-surface-elevated/50 hover:to-surface/30"
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
>>>>>>> c8eea6095e3cef734fdf43f5226fc74a76373ae1
          </div>
        </div>
      </div>
    </div>
  );
}

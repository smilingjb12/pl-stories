"use client";

import { useRouter } from "next/navigation";
import ThemeSelector from "./ThemeSelector";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export default function Header({
  title,
  showBackButton = false,
  showSettings = false,
  onSettingsClick,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 glassmorphism border-b border-border/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left side - Back button or spacer */}
          <div className="w-24 flex justify-start">
            {showBackButton && (
              <button
                onClick={() => router.push("/")}
                className="group flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg
                  text-text-secondary hover:text-primary
                  transition-all duration-300"
                aria-label="Go back to stories"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline text-sm font-medium">
                  Back
                </span>
              </button>
            )}
          </div>

          {/* Center - Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate max-w-[200px] sm:max-w-md text-center tracking-tight">
              {title}
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="w-24 flex items-center justify-end gap-1">
            {showSettings && onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="group p-2.5 rounded-lg
                  text-text-secondary hover:text-primary
                  hover:bg-primary/5
                  transition-all duration-300"
                aria-label="Open reading settings"
                title="Reading Settings"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
            )}
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  );
}

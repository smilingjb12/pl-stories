"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Story } from "@/types/story";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import ReadingSettings from "@/components/ReadingSettings";
import ProgressBar from "@/components/ProgressBar";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Check icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// Book open icon
const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

export default function StoryPage() {
  const params = useParams();
  const [showSettings, setShowSettings] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { preferences, updatePreferences } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchStory(params.id as string);
    }
  }, [params.id]);

  const fetchStory = async (id: string) => {
    try {
      setLoading(true);
      const storyData = await convex.query(api.stories.get, { id });
      setStory(storyData);
    } catch (error) {
      console.error("Error fetching story:", error);
      setStory(null);
    } finally {
      setLoading(false);
    }
  };

  const getFontSizeStyle = () => {
    return { fontSize: `${preferences.fontSize}px` };
  };

  const getLineHeightClass = () => {
    switch (preferences.lineHeight) {
      case "normal":
        return "leading-normal";
      case "loose":
        return "leading-loose";
      default:
        return "leading-relaxed";
    }
  };

  const getLetterSpacingClass = () => {
    switch (preferences.letterSpacing) {
      case "wide":
        return "tracking-wide";
      case "wider":
        return "tracking-wider";
      default:
        return "tracking-normal";
    }
  };

  const handleMarkAsRead = async () => {
    if (params.id && story) {
      try {
        await convex.mutation(api.stories.markAsRead, {
          id: params.id as string,
        });
        setStory({ ...story, isRead: true });
      } catch (error) {
        console.error("Error marking story as read:", error);
      }
    }
  };

  const handleMarkAsUnread = async () => {
    if (params.id && story) {
      try {
        await convex.mutation(api.stories.markAsUnread, {
          id: params.id as string,
        });
        setStory({ ...story, isRead: false });
      } catch (error) {
        console.error("Error marking story as unread:", error);
      }
    }
  };

  return (
    <>
      {/* Progress bar at the very top */}
      <ProgressBar />

      <Header
        title={story?.title || "Loading..."}
        showBackButton={true}
        showSettings={true}
        onSettingsClick={() => setShowSettings(true)}
        hideOnScroll={true}
      />

      {/* Story Content */}
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Loading State */}
          {loading && (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center justify-center py-24">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6">
                    <div className="spinner" />
                  </div>
                  <div className="absolute inset-0 rounded-full loading-pulse" />
                </div>
                <p className="text-lg text-text-secondary">
                  Loading story...
                </p>
              </div>
            </div>
          )}

          {/* Story Not Found */}
          {!loading && !story && (
            <div className="animate-fade-in text-center py-24">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-text-muted" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Story not found
              </h2>
              <p className="text-text-secondary">
                The story you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </div>
          )}

          {/* Story Content */}
          {!loading && story && (
            <article className="animate-fade-in">
              {/* Story Title */}
              <header className="mb-8 sm:mb-12 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 leading-tight">
                  {story.title}
                </h1>
                <div className="divider-ornament">
                  <span className="text-sm text-text-muted italic">
                    Story #{story.id}
                  </span>
                </div>
              </header>

              {/* Story Text */}
              <div
                className={`
                  ${getLineHeightClass()}
                  ${getLetterSpacingClass()}
                  reading-text
                  text-text-primary
                  max-w-reading mx-auto
                `}
                style={{
                  opacity: preferences.textOpacity,
                  ...getFontSizeStyle(),
                }}
              >
                <div className="whitespace-pre-wrap">
                  {story.content}
                </div>
              </div>

              {/* Footer Actions */}
              <footer className="mt-12 sm:mt-16 pt-8 border-t border-border/30">
                {/* Completion ornament */}
                <div className="divider-ornament mb-8">
                  <span className="text-sm italic text-text-muted">
                    ~ Koniec ~
                  </span>
                </div>

                {/* Mark as Read/Unread Button */}
                <div className="flex justify-center">
                  {story.isRead ? (
                    <button
                      onClick={handleMarkAsUnread}
                      className="group flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4
                        bg-gradient-to-r from-primary to-primary-dark
                        text-white rounded-xl
                        shadow-lg shadow-primary/25
                        hover:shadow-xl hover:shadow-primary/30
                        transition-all duration-300
                        hover:-translate-y-0.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">
                        Mark as Unread
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkAsRead}
                      className="group flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4
                        btn-primary"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center
                        group-hover:bg-white/30 transition-colors duration-300">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">
                        Mark as Read
                      </span>
                    </button>
                  )}
                </div>
              </footer>
            </article>
          )}
        </div>
      </main>

      {/* Reading Settings Modal */}
      <ReadingSettings
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Story } from "@/types/story";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import ReadingSettings from "@/components/ReadingSettings";
import ProgressBar from "@/components/ProgressBar";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { preferences, updatePreferences, getThemeClasses } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getFontFamilyClass = () => {
    switch (preferences.fontFamily) {
      case "inter":
        return "font-inter";
      case "lato":
        return "font-lato";
      case "playfair":
        return "font-playfair";
      default:
        return "font-inter";
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
      <Header
        title={story?.title || "Loading..."}
        showBackButton={true}
        showSettings={true}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Story Content */}
      <main className="max-w-4xl mx-auto p-8 relative">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br pointer-events-none" />
        <article
          className={`
            ${getFontFamilyClass()} 
            ${getLineHeightClass()} 
            ${getLetterSpacingClass()}
            max-w-none prose-lg reading-text text-primary relative z-10
            rounded-2xl p-8
          `}
          style={{
            opacity: preferences.textOpacity,
            ...getFontSizeStyle(),
          }}
        >
          <div className="whitespace-pre-wrap max-w-3xl mx-auto">
            {loading ? (
              <div className="text-center text-secondary py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <div className="loading-gradient p-4 rounded-lg">
                  Loading story...
                </div>
              </div>
            ) : story ? (
              story.content
            ) : (
              <div className="text-center text-secondary py-8">
                Story not found
              </div>
            )}
          </div>
        </article>

        {/* Mark as Read Button */}
        {!loading && story && (
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border/30">
            <div className="flex justify-center">
              {story.isRead ? (
                <button
                  onClick={handleMarkAsUnread}
                  className="flex items-center space-x-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="font-semibold">Mark as Unread</span>
                </button>
              ) : (
                <button
                  onClick={handleMarkAsRead}
                  className="flex items-center space-x-3 px-8 py-4 btn-primary"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-semibold">Mark as Read</span>
                </button>
              )}
            </div>
          </div>
        )}
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

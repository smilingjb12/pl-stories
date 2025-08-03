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
      case "montserrat":
        return "font-montserrat";
      case "lato":
        return "font-lato";
      case "poppins":
        return "font-poppins";
      case "playfair":
        return "font-playfair";
      case "source-sans":
        return "font-source-sans";
      case "raleway":
        return "font-raleway";
      default:
        return "font-lato";
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
      <ProgressBar />

      {/* Story Content */}
      <main className="max-w-4xl mx-auto p-8">
        <article
          className={`
            ${getFontFamilyClass()} 
            ${getLineHeightClass()} 
            ${getLetterSpacingClass()}
            max-w-none prose-lg reading-text text-primary
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
                <div>Loading story...</div>
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
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
            <div className="flex justify-center">
              {story.isRead ? (
                <button
                  onClick={handleMarkAsUnread}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>Mark as Unread</span>
                </button>
              ) : (
                <button
                  onClick={handleMarkAsRead}
                  className="flex items-center space-x-2 px-6 py-3 btn-primary"
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
                  <span>Mark as Read</span>
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

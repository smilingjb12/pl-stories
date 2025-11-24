"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StoryMetadata } from "@/types/story";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Home() {
  const [stories, setStories] = useState<StoryMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { preferences } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const storiesData = await convex.query(api.stories.listMetadata);
      // Sort stories by ID numeric value if possible
      const sortedStories = storiesData.sort((a: any, b: any) => {
        const idA = parseInt(a.id);
        const idB = parseInt(b.id);
        return isNaN(idA) || isNaN(idB) ? a.id.localeCompare(b.id) : idA - idB;
      });
      setStories(sortedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const readStories = stories.filter((story) => story.isRead).length;
  const totalStories = stories.length;
  const progressPercentage =
    totalStories > 0 ? (readStories / totalStories) * 100 : 0;

  const getStorySlug = (filename: string) => {
    return filename.replace(".txt", "");
  };

  return (
    <>
      <Header title="Polish Stories" />
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-12">
          {!loading && totalStories > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-medium text-muted-foreground">
                  Reading Progress
                </span>
                <span className="text-base font-medium text-foreground">
                  {readStories} / {totalStories} stories
                </span>
              </div>
              <div
                className="relative w-full h-4 rounded-full overflow-hidden"
                style={{
                  backgroundColor:
                    "color-mix(in oklch, var(--primary) 20%, transparent)",
                }}
              >
                <div
                  className="h-full transition-all duration-500 ease-out bg-primary rounded-full"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="space-y-0 divide-y divide-white/10">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/story/${story.id}`}
                className="group flex items-center justify-between py-5 transition-colors duration-200"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      story.isRead
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {story.isRead ? (
                      <svg
                        className="w-7 h-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <span className="font-medium text-sm opacity-50">
                        {story.id}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground text-lg uppercase tracking-wide mb-1">
                      {story.title}
                    </h3>
                    <p className="text-md text-accent truncate font-medium">
                      Story #{getStorySlug(story.filename)}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground ml-4 flex-shrink-0 group-hover:text-primary transition-colors duration-200">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

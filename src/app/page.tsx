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
      setStories(storiesData);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Polish Stories" />
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/3 via-transparent to-accent-500/3 pointer-events-none rounded-3xl" />
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Polish Stories Collection
          </h2>
          <p className="text-secondary text-lg gradient-text-subtle">
            Select a story to begin your reading journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className={`block gradient-card p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2 group relative overflow-hidden ${
                story.isRead
                  ? "ring-2 ring-emerald-500/50 bg-gradient-to-br from-emerald-50/10 to-emerald-100/5"
                  : ""
              }`}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {story.isRead && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col h-full relative z-10">
                <h2
                  className={`text-xl font-bold mb-4 line-clamp-2 transition-all duration-300 ${
                    story.isRead
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-primary group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-400 group-hover:bg-clip-text group-hover:text-transparent"
                  }`}
                >
                  {story.title}
                </h2>
                <div className="mt-auto flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      story.isRead
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted"
                    }`}
                  >
                    Story #{story.id.replace(/^\D*/, "")}
                  </p>
                  {story.isRead && (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full font-medium">
                      Read
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

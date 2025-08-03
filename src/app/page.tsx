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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-secondary text-lg">
            Select a story to begin reading
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className={`block surface-elevated p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group relative ${
                story.isRead
                  ? "bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800"
                  : ""
              }`}
            >
              {story.isRead && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col h-full">
                <h2
                  className={`text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors ${
                    story.isRead
                      ? "text-green-700 dark:text-green-300"
                      : "text-primary"
                  }`}
                >
                  {story.title}
                </h2>
                <p
                  className={`text-sm mt-auto ${
                    story.isRead
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted"
                  }`}
                >
                  Story #{story.id.replace(/^\D*/, "")}
                  {story.isRead && " • Read"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

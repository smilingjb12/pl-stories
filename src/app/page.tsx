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
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-10"></div>

        <div className="space-y-2">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className="group block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {story.isRead && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Story #{story.id.replace(/^\D*/, "")}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

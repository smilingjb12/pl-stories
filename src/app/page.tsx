"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StoryMetadata } from "@/types/story";
import Header from "@/components/Header";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Book icon for unread stories
const BookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

// Checkmark icon for read stories
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// Chevron icon for navigation
const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function Home() {
  const [stories, setStories] = useState<StoryMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const storiesData = await convex.query(api.stories.listMetadata);
      const sortedStories = storiesData.sort((a: StoryMetadata, b: StoryMetadata) => {
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
  const progressPercentage = totalStories > 0 ? (readStories / totalStories) * 100 : 0;

  return (
    <>
      <Header title="Polish Stories" />

      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-14 animate-fade-in">
            <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-md mx-auto italic">
              A curated collection of stories to enhance your Polish reading journey
            </p>
          </div>

          {/* Progress Section */}
          {!loading && totalStories > 0 && (
            <div className="mb-10 sm:mb-14 animate-slide-up stagger-1">
              <div className="card-literary p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Reading Progress
                      </h2>
                      <p className="text-sm text-text-muted">
                        {readStories} of {totalStories} stories completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold gradient-text">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="progress-track h-2 sm:h-2.5">
                  <div
                    className="progress-fill h-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="card-literary p-5 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-surface loading-shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 rounded bg-surface loading-shimmer" />
                      <div className="h-4 w-1/2 rounded bg-surface loading-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stories List */}
          {!loading && (
            <div className="space-y-3 sm:space-y-4">
              {stories.map((story, index) => (
                <Link
                  key={story.id}
                  href={`/story/${story.id}`}
                  className="group block animate-slide-up opacity-0"
                  style={{ animationDelay: `${(index + 2) * 0.05}s` }}
                >
                  <article
                    className={`
                      card-literary p-4 sm:p-5 flex items-center gap-4 sm:gap-5
                      ${story.isRead ? "border-l-4 border-primary-solid bg-primary-5" : "border-l-4 border-transparent"}
                    `}
                  >
                    {/* Story Number/Status */}
                    <div
                      className={`
                        relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0
                        flex items-center justify-center
                        transition-all duration-500
                        ${story.isRead
                          ? "bg-primary-solid text-white shadow-primary-glow"
                          : "bg-primary-10 border-2 border-primary-20 group-hover:border-primary-50 group-hover:bg-primary-15"
                        }
                      `}
                    >
                      {story.isRead ? (
                        <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <BookIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-60 group-hover:text-primary-color transition-colors duration-300" />
                      )}

                      {/* Hover ring effect */}
                      <div
                        className="absolute inset-0 rounded-full transition-all duration-500 ease-out group-hover:ring-4 ring-primary-20"
                      />
                    </div>

                    {/* Story Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg sm:text-xl font-semibold mb-1 truncate transition-colors duration-300 ${story.isRead ? "text-primary-color" : "text-foreground group-hover:text-primary-color"}`}>
                        {story.title}
                      </h3>
                      <p className="text-sm">
                        {story.isRead ? (
                          <span className="text-primary-80 font-medium">Completed</span>
                        ) : (
                          <span className="text-text-muted">Not started</span>
                        )}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className={`flex-shrink-0 transition-all duration-300 ${story.isRead ? "text-primary-color" : "text-primary-40 group-hover:text-primary-color"}`}>
                      <ChevronIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && stories.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <BookIcon className="w-10 h-10 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No stories yet
              </h3>
              <p className="text-text-secondary max-w-sm mx-auto">
                Stories will appear here once they are added to the collection.
              </p>
            </div>
          )}

          {/* Footer ornament */}
          {!loading && stories.length > 0 && (
            <div className="mt-12 sm:mt-16 divider-ornament animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <span className="text-sm italic text-text-muted">Miłej lektury</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

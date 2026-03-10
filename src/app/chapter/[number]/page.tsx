"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chapter } from "@/types/story";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import ReadingSettings from "@/components/ReadingSettings";
import ProgressBar from "@/components/ProgressBar";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const HEADER_OFFSET = 72;

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const BookmarkIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

function splitIntoParagraphs(content: string): string[] {
  return content.split(/\n/).filter((line) => line.trim().length > 0);
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const { preferences, updatePreferences } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);

  // Bookmark state
  const [bookmarkedIndex, setBookmarkedIndex] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [saving, setSaving] = useState(false);

  const chapterNumber = Number(params.number);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedIndex(-1);
  }, [chapterNumber]);

  useEffect(() => {
    if (chapterNumber >= 1 && chapterNumber <= 17) {
      fetchChapter(chapterNumber);
    } else {
      setLoading(false);
    }
  }, [chapterNumber]);

  const paragraphs = useMemo(
    () => (chapter ? splitIntoParagraphs(chapter.content) : []),
    [chapter],
  );

  // Set bookmarked index from loaded chapter data
  useEffect(() => {
    if (chapter) {
      setBookmarkedIndex(chapter.paragraphIndex > 0 ? chapter.paragraphIndex : -1);
    }
  }, [chapter]);

  // Scroll to bookmarked paragraph after content renders
  useEffect(() => {
    if (!chapter || loading || chapter.paragraphIndex <= 0) return;
    const container = contentRef.current;
    if (!container) return;

    const savedIndex = chapter.paragraphIndex;

    // Use a small timeout to ensure paragraphs have rendered in the DOM
    const timer = setTimeout(() => {
      const target = container.querySelector(
        `[data-paragraph-index="${savedIndex}"]`,
      ) as HTMLElement | null;
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: "instant" });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [chapter, loading]);

  const fetchChapter = async (num: number) => {
    try {
      setLoading(true);
      setBookmarkedIndex(-1);
      setSelectedIndex(-1);
      const data = await convex.query(api.chapters.getByNumber, { number: num });
      setChapter(data as Chapter | null);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      setChapter(null);
    } finally {
      setLoading(false);
    }
  };

  const handleParagraphTap = useCallback((index: number) => {
    setSelectedIndex((prev) => (prev === index ? -1 : index));
  }, []);

  const handleBookmark = useCallback(
    async (index: number) => {
      if (saving) return;
      setSaving(true);

      // If tapping the already-bookmarked paragraph, remove bookmark
      const newIndex = bookmarkedIndex === index ? 0 : index;

      try {
        await convex.mutation(api.chapters.updateProgress, {
          number: chapterNumber,
          paragraphIndex: newIndex,
          totalParagraphs: paragraphs.length,
        });
        setBookmarkedIndex(newIndex === 0 ? -1 : newIndex);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error saving bookmark:", error);
      } finally {
        setSaving(false);
      }
    },
    [bookmarkedIndex, chapterNumber, paragraphs.length, saving],
  );

  // Dismiss selection when tapping outside content
  useEffect(() => {
    if (selectedIndex === -1) return;
    const handleClickOutside = (e: MouseEvent) => {
      const container = contentRef.current;
      if (container && !container.contains(e.target as Node)) {
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [selectedIndex]);

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

  const navigateToChapter = (num: number) => {
    router.push(`/chapter/${num}`);
  };

  return (
    <>
      <ProgressBar />

      <Header
        title={chapter ? `Rozdział ${chapter.number}` : "Loading..."}
        showBackButton={true}
        showSettings={true}
        onSettingsClick={() => setShowSettings(true)}
      />

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
                  Loading chapter...
                </p>
              </div>
            </div>
          )}

          {/* Chapter Not Found */}
          {!loading && !chapter && (
            <div className="animate-fade-in text-center py-24">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-text-muted" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Chapter not found
              </h2>
              <p className="text-text-secondary">
                The chapter you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          )}

          {/* Chapter Content */}
          {!loading && chapter && (
            <article className="animate-fade-in">
              {/* Chapter Title */}
              <header className="mb-8 sm:mb-12 text-center">
                <p className="text-sm text-text-muted uppercase tracking-widest mb-2">
                  Rozdział {chapter.number}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 leading-tight">
                  {chapter.title}
                </h1>
                <div className="divider-ornament">
                  <span className="text-sm text-text-muted italic">
                    &bull; &bull; &bull;
                  </span>
                </div>
              </header>

              {/* Chapter Text */}
              <div
                ref={contentRef}
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
                {paragraphs.map((text, i) => {
                  const isBookmarked = bookmarkedIndex === i;
                  const isSelected = selectedIndex === i;

                  return (
                    <div key={i}>
                      {/* Bookmark button — appears above the tapped paragraph */}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(i);
                          }}
                          disabled={saving}
                          className={`
                            flex items-center gap-1.5 px-3 py-1 mb-1 rounded-full
                            text-xs font-medium
                            shadow-sm transition-all duration-200 animate-fade-in
                            ${isBookmarked
                              ? "bg-primary-solid text-white hover:bg-primary-dark"
                              : "bg-background border border-border/50 text-primary hover:bg-primary/10"
                            }
                            ${saving ? "opacity-50" : "hover:scale-105"}
                          `}
                          title={isBookmarked ? "Remove bookmark" : "Bookmark here"}
                        >
                          <BookmarkIcon
                            className="w-3.5 h-3.5"
                            filled={isBookmarked}
                          />
                          {isBookmarked ? "Remove bookmark" : "Bookmark here"}
                        </button>
                      )}
                      <p
                        data-paragraph-index={i}
                        onClick={() => handleParagraphTap(i)}
                        className={`
                          mb-1 whitespace-pre-wrap cursor-pointer
                          transition-all duration-300 rounded-sm
                          ${isBookmarked
                            ? "bg-primary/10 border-l-2 border-primary-solid pl-3 -ml-3"
                            : isSelected
                              ? "bg-primary/5"
                              : ""
                          }
                        `}
                      >
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Footer Navigation */}
              <footer className="mt-12 sm:mt-16 pt-8 border-t border-border/30">
                <div className="divider-ornament mb-8">
                  <span className="text-sm italic text-text-muted">
                    ~ Koniec rozdziału ~
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {chapterNumber > 1 ? (
                    <button
                      onClick={() => navigateToChapter(chapterNumber - 1)}
                      className="group flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3
                        rounded-xl border border-border/50
                        text-text-secondary hover:text-primary hover:border-primary/30
                        transition-all duration-300"
                    >
                      <ChevronLeftIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                      <span className="font-medium text-sm sm:text-base">Previous</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {chapterNumber < 17 ? (
                    <button
                      onClick={() => navigateToChapter(chapterNumber + 1)}
                      className="group flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3
                        btn-primary"
                    >
                      <span className="font-medium text-sm sm:text-base">Next Chapter</span>
                      <ChevronRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </footer>
            </article>
          )}
        </div>
      </main>

      <ReadingSettings
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}

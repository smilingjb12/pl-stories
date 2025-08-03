'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Story } from '@/types/story';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/ThemeSelector';
import { isStoryRead, getReadStories } from '@/lib/readStatus';

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [readStories, setReadStories] = useState<Set<string>>(new Set());
  const { preferences } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (mounted) {
      setReadStories(getReadStories());
    }
  }, [mounted]);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (response.ok) {
        const storiesData = await response.json();
        setStories(storiesData);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };


  if (!mounted || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center text-secondary">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <h1 className="text-4xl font-bold text-primary font-playfair flex-1">Polish Stories</h1>
          <div className="flex-1 flex justify-end">
            <ThemeSelector />
          </div>
        </div>
        <p className="text-secondary text-lg">Select a story to begin reading</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => {
          const isRead = readStories.has(story.id);
          return (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className={`block surface-elevated p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group relative ${
                isRead ? 'bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800' : ''
              }`}
            >
              {isRead && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              )}
              <div className="flex flex-col h-full">
                <h2 className={`text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors ${
                  isRead ? 'text-green-700 dark:text-green-300' : 'text-primary'
                }`}>
                  {story.title}
                </h2>
                <p className={`text-sm mt-auto ${
                  isRead ? 'text-green-600 dark:text-green-400' : 'text-muted'
                }`}>
                  Story #{story.id.replace(/^\D*/, '')}
                  {isRead && ' • Read'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
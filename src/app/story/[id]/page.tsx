'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Story } from '@/types/story';
import { useTheme } from '@/contexts/ThemeContext';
import ReadingSettings from '@/components/ReadingSettings';
import ProgressBar from '@/components/ProgressBar';
import { markStoryAsRead, isStoryRead, markStoryAsUnread } from '@/lib/readStatus';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const { preferences, updatePreferences, getThemeClasses } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchStory();
  }, [params.id]);

  useEffect(() => {
    if (mounted && params.id) {
      setIsRead(isStoryRead(params.id as string));
    }
  }, [mounted, params.id]);

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/${params.id}`);
      if (response.ok) {
        const storyData = await response.json();
        setStory(storyData);
      } else {
        console.error('Story not found');
      }
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFontSizeStyle = () => {
    return { fontSize: `${preferences.fontSize}px` };
  };

  const getLineHeightClass = () => {
    switch (preferences.lineHeight) {
      case 'normal':
        return 'leading-normal';
      case 'loose':
        return 'leading-loose';
      default:
        return 'leading-relaxed';
    }
  };

  const getLetterSpacingClass = () => {
    switch (preferences.letterSpacing) {
      case 'wide':
        return 'tracking-wide';
      case 'wider':
        return 'tracking-wider';
      default:
        return 'tracking-normal';
    }
  };

  const getFontFamilyClass = () => {
    switch (preferences.fontFamily) {
      case 'montserrat':
        return 'font-montserrat';
      case 'lato':
        return 'font-lato';
      case 'poppins':
        return 'font-poppins';
      case 'playfair':
        return 'font-playfair';
      case 'source-sans':
        return 'font-source-sans';
      case 'raleway':
        return 'font-raleway';
      default:
        return 'font-lato';
    }
  };

  const handleMarkAsRead = () => {
    if (params.id) {
      markStoryAsRead(params.id as string);
      setIsRead(true);
    }
  };

  const handleMarkAsUnread = () => {
    if (params.id) {
      markStoryAsUnread(params.id as string);
      setIsRead(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-secondary">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-primary">Story not found</h1>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }


  return (
    <>
      <ProgressBar />
      {/* Header */}
      <header className="sticky top-0 z-40 surface-elevated border-b border-border backdrop-blur-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          
          <h1 className="text-lg font-semibold truncate mx-4 text-primary">{story.title}</h1>
          
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </header>

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
            ...getFontSizeStyle()
          }}
        >
          <div className="whitespace-pre-wrap max-w-3xl mx-auto">
            {story.content}
          </div>
        </article>

        {/* Mark as Read Button */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
          <div className="flex justify-center">
            {isRead ? (
              <button
                onClick={handleMarkAsUnread}
                className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>Mark as Unread</span>
              </button>
            ) : (
              <button
                onClick={handleMarkAsRead}
                className="flex items-center space-x-2 px-6 py-3 btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span>Mark as Read</span>
              </button>
            )}
          </div>
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
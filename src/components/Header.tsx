'use client';

import { useRouter } from 'next/navigation';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export default function Header({ 
  title, 
  showBackButton = false, 
  showSettings = false, 
  onSettingsClick 
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 surface-elevated border-b border-border backdrop-blur-sm p-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {showBackButton ? (
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        ) : (
          <div className="w-20"></div>
        )}
        
        <h1 className="text-lg font-semibold truncate mx-4 text-primary text-center flex-1">
          {title}
        </h1>
        
        <div className="flex items-center space-x-2">
          {showSettings && onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="flex items-center space-x-2 text-primary hover:text-primary-600 transition-colors btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          )}
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
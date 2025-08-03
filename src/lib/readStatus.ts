const READ_STORIES_KEY = 'readStories';

export function getReadStories(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const stored = localStorage.getItem(READ_STORIES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function markStoryAsRead(storyId: string): void {
  if (typeof window === 'undefined') return;
  
  const readStories = getReadStories();
  readStories.add(storyId);
  
  try {
    localStorage.setItem(READ_STORIES_KEY, JSON.stringify(Array.from(readStories)));
  } catch (error) {
    console.error('Failed to save read status:', error);
  }
}

export function isStoryRead(storyId: string): boolean {
  return getReadStories().has(storyId);
}

export function markStoryAsUnread(storyId: string): void {
  if (typeof window === 'undefined') return;
  
  const readStories = getReadStories();
  readStories.delete(storyId);
  
  try {
    localStorage.setItem(READ_STORIES_KEY, JSON.stringify(Array.from(readStories)));
  } catch (error) {
    console.error('Failed to save read status:', error);
  }
}
export interface Story {
  id: string;
  title: string;
  filename: string;
  content: string;
  isRead: boolean;
}

export interface StoryMetadata {
  id: string;
  title: string;
  filename: string;
  isRead: boolean;
}

export interface ReadingPreferences {
  fontSize: number; // 12 to 24 (px)
  fontFamily: 'inter' | 'lato' | 'playfair';
  theme: 'light' | 'dark';
  lineHeight: 'normal' | 'relaxed' | 'loose';
  letterSpacing: 'normal' | 'wide' | 'wider';
  textOpacity: number; // 0.3 to 1.0
  textAlign: 'left' | 'justify';
}

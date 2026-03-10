export interface Chapter {
  _id: string;
  number: number;
  title: string;
  content: string;
  paragraphIndex: number;
  totalParagraphs: number;
}

export interface ChapterMetadata {
  _id: string;
  number: number;
  title: string;
  paragraphIndex: number;
  totalParagraphs: number;
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

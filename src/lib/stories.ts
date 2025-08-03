import { promises as fs } from 'fs';
import path from 'path';
import { Story } from '@/types/story';

export async function getStories(): Promise<Story[]> {
  const storiesDirectory = path.join(process.cwd(), 'stories');
  const filenames = await fs.readdir(storiesDirectory);
  
  const stories: Story[] = [];
  
  for (const filename of filenames) {
    if (filename.endsWith('.txt')) {
      const filepath = path.join(storiesDirectory, filename);
      const content = await fs.readFile(filepath, 'utf8');
      
      // Extract title from content (first non-empty line after the header)
      const lines = content.split('\n');
      let title = filename.replace('.txt', '').replace(/^\d+-/, '').replace(/-/g, ' ');
      
      // Try to find a better title in the content
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('CZEŚĆ') && trimmed.length > 3 && trimmed.length < 50) {
          title = trimmed.replace(/^\d+\.\s*/, '');
          break;
        }
      }
      
      stories.push({
        id: filename.replace('.txt', ''),
        title: title.charAt(0).toUpperCase() + title.slice(1),
        filename,
        content
      });
    }
  }
  
  return stories.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}
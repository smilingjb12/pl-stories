import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const storiesDirectory = path.join(process.cwd(), 'stories');
    
    // Find the file that matches the ID
    const filenames = await fs.readdir(storiesDirectory);
    const matchingFile = filenames.find(filename => 
      filename.replace('.txt', '') === id
    );
    
    if (!matchingFile) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    
    const filepath = path.join(storiesDirectory, matchingFile);
    const content = await fs.readFile(filepath, 'utf8');
    
    // Extract title from content
    const lines = content.split('\n');
    let title = matchingFile.replace('.txt', '').replace(/^\d+-/, '').replace(/-/g, ' ');
    
    // Try to find a better title in the content
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('CZEŚĆ') && trimmed.length > 3 && trimmed.length < 50) {
        title = trimmed.replace(/^\d+\.\s*/, '');
        break;
      }
    }
    
    const story = {
      id,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      filename: matchingFile,
      content
    };
    
    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
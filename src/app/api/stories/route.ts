import { NextResponse } from 'next/server';
import { getStories } from '@/lib/stories';

export async function GET() {
  try {
    const stories = await getStories();
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
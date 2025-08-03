# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture Overview

This is a Next.js 15 reading application for Polish stories with customizable reading preferences. The app uses TypeScript, React 19, and Tailwind CSS for styling.

### Core Structure

- **File-based story management**: Stories are stored as `.txt` files in the `/stories` directory, automatically loaded and served via API routes
- **Theme system**: Custom theme context with data attributes (`data-theme`) for light/dark/sepia/high-contrast modes
- **Reading preferences**: Font size, family, line height, letter spacing, and text opacity stored in localStorage
- **Mobile-first responsive design**: Optimized for mobile reading with sticky headers and touch-friendly controls

### Key Components

- `ThemeContext` - Global state for reading preferences with localStorage persistence
- `ReadingSettings` - Modal component for customizing reading experience
- `ProgressBar` - Reading progress indicator
- Story loading system in `lib/stories.ts` with automatic title extraction

### API Routes

- `/api/stories` - Returns all available stories with metadata
- `/api/stories/[id]` - Returns specific story content by filename ID

### Story Format

Stories are text files named with pattern `{number}-{title}.txt`. The system automatically extracts titles and sorts numerically. Content is displayed with preserved whitespace using `whitespace-pre-wrap`.

### Styling System

Uses Tailwind with custom CSS variables for theming. Font families are configured as Tailwind font utilities (font-montserrat, font-lato, etc.). Theme switching is handled via data attributes on the document element.
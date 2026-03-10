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

# Push Convex schema/functions
CONVEX_DEPLOYMENT="dev:outgoing-cobra-625" npx convex dev --once

# Re-seed chapters (if needed)
node seed-chapters.js && npx convex import --table chapters --replace chapters.jsonl
```

## Architecture Overview

This is a Next.js 16 single-book chapter reader for "Harry Potter i Kamień Filozoficzny" (Polish). The app uses TypeScript, React 19, Tailwind CSS, and Convex for backend storage.

### Core Structure

- **Convex backend**: Chapters stored in `chapters` table with `number`, `title`, `content`, `scrollProgress` fields
- **Theme system**: Custom theme context with data attributes (`data-theme`) for light/dark modes
- **Reading preferences**: Font size, family, line height, letter spacing, and text opacity stored in localStorage
- **Scroll-based progress**: Per-chapter scroll progress tracked and persisted to Convex (debounced 5s, 2% threshold)
- **Mobile-first responsive design**: Optimized for mobile reading with sticky headers and touch-friendly controls

### Key Components

- `ThemeContext` - Global state for reading preferences with localStorage persistence
- `ReadingSettings` - Modal component for customizing reading experience
- `ProgressBar` - Visual scroll progress indicator at top of reader
- `useScrollProgress` - Hook for tracking/restoring scroll position per chapter

### Convex Functions (`convex/chapters.ts`)

- `listMetadata` — All chapters ordered by number, without content (home page)
- `getByNumber({ number })` — Single chapter with full content (reader page)
- `updateScrollProgress({ number, scrollProgress })` — Mutation to save reading progress

### Pages

- `/` — Home page with chapter list, per-chapter progress bars, overall completion count
- `/chapter/[number]` — Chapter reader with scroll tracking, prev/next navigation

### Data Seeding

- Source files: `C:\Repos\random\chapter{1-17}.txt`
- `seed-chapters.js` parses chapter headers (ROZDZIAŁ / ordinal / ALL-CAPS title lines) and generates `chapters.jsonl`
- Title format: "CHŁOPIEC, KTÓRY PRZEŻYŁ" → "Chłopiec, Który Przeżył" (title case)

### Styling System

Uses Tailwind with custom CSS variables for theming. Font families are configured as Tailwind font utilities. Theme switching is handled via data attributes on the document element. DM Sans is the default font family.

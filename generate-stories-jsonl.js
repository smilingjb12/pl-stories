const fs = require('fs');
const path = require('path');

const storiesDir = './stories';
const outputFile = 'stories.jsonl';

// Read all story files
const files = fs.readdirSync(storiesDir)
  .filter(file => file.endsWith('.txt'))
  .sort((a, b) => {
    // Extract number from filename for proper sorting
    const numA = parseInt(a.split('-')[0]);
    const numB = parseInt(b.split('-')[0]);
    return numA - numB;
  });

const stories = [];

files.forEach(filename => {
  try {
    const filePath = path.join(storiesDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract story number and title from filename
    const match = filename.match(/^(\d+)-(.+)\.txt$/);
    if (!match) return;
    
    const [, numberStr, titleSlug] = match;
    const storyNumber = parseInt(numberStr);
    
    // Extract title from content (usually the second line)
    const lines = content.split('\n');
    let title = '';
    
    // Look for the title in the first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('CZEŚĆ') && !line.includes('MAM NA IMIĘ')) {
        // Remove leading numbers and dots
        title = line.replace(/^\d+\.\s*/, '').trim();
        if (title) break;
      }
    }
    
    // Fallback to filename-based title if not found in content
    if (!title) {
      title = titleSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    const story = {
      id: filename.replace('.txt', ''), // Use filename without extension as ID
      number: storyNumber,
      title: title,
      content: content.trim(),
      filename: filename,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    stories.push(story);
    console.log(`Processed: ${storyNumber}. ${title}`);
    
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
});

// Write JSONL file (one JSON object per line)
const jsonlContent = stories.map(story => JSON.stringify(story)).join('\n');

fs.writeFileSync(outputFile, jsonlContent, 'utf-8');

console.log(`\nGenerated ${outputFile} with ${stories.length} stories`);
console.log(`File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
// Import script for Convex
// Run this after setting up your Convex deployment:
// 1. Run `npx convex dev` to set up your deployment
// 2. Run `node import-to-convex.js` to import the stories

const fs = require('fs');
const readline = require('readline');

async function importStories() {
  console.log('📚 Story Import Helper for Convex');
  console.log('');
  console.log('To import your stories to Convex:');
  console.log('');
  console.log('1. First, set up your Convex deployment:');
  console.log('   npx convex dev');
  console.log('');
  console.log('2. Then import the stories:');
  console.log('   npx convex import --table stories stories.jsonl');
  console.log('');
  console.log('3. Your Convex functions are ready in convex/stories.ts:');
  console.log('   - list: Get all stories');
  console.log('   - get: Get story by ID');
  console.log('   - getByNumber: Get story by number');
  console.log('');
  
  // Check if stories.jsonl exists
  if (fs.existsSync('./stories.jsonl')) {
    console.log('✅ stories.jsonl found and ready for import');
    
    // Count stories
    const fileStream = fs.createReadStream('./stories.jsonl');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let count = 0;
    for await (const line of rl) {
      if (line.trim()) count++;
    }
    
    console.log(`📊 Found ${count} stories ready to import`);
  } else {
    console.log('❌ stories.jsonl not found');
  }
}

importStories().catch(console.error);
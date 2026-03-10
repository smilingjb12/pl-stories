const fs = require("fs");
const path = require("path");

const CHAPTERS_DIR = "C:\\Repos\\random";
const OUTPUT_FILE = path.join(__dirname, "chapters.jsonl");

function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|\s|,\s*)(\S)/g, (match, prefix, char) => prefix + char.toUpperCase());
}

function parseChapter(filePath, chapterNumber) {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split("\n");

  // Header: ROZDZIAŁ, then ordinal, then title lines (ALL CAPS)
  // Body starts at first non-uppercase, non-empty line after the title
  let titleLines = [];
  let bodyStartIndex = -1;

  function isAllCaps(str) {
    const trimmed = str.trim();
    if (!trimmed) return false;
    // Check that letters are all uppercase (ignoring punctuation, spaces)
    return trimmed === trimmed.toUpperCase() && /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(trimmed);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip "ROZDZIAŁ" line
    if (i === 0 && line.trim() === "ROZDZIAŁ") continue;
    // Skip ordinal line (line 1, always all caps)
    if (i === 1) continue;

    // Title lines are ALL CAPS
    if (isAllCaps(line)) {
      titleLines.push(line.trim());
      continue;
    }

    // First non-title, non-empty line = body start
    if (line.trim() || line.startsWith(" ")) {
      bodyStartIndex = i;
      break;
    }
  }

  const rawTitle = titleLines.join(" ");
  const title = toTitleCase(rawTitle);
  const content = bodyStartIndex >= 0 ? lines.slice(bodyStartIndex).join("\n") : "";

  const paragraphs = content.split(/\n/).filter((l) => l.trim().length > 0);

  return {
    number: chapterNumber,
    title,
    content,
    paragraphIndex: 0,
    totalParagraphs: paragraphs.length,
  };
}

const results = [];
for (let i = 1; i <= 17; i++) {
  const filePath = path.join(CHAPTERS_DIR, `chapter${i}.txt`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing: ${filePath}`);
    continue;
  }
  const chapter = parseChapter(filePath, i);
  console.log(`Chapter ${i}: "${chapter.title}" (${chapter.content.length} chars)`);
  results.push(JSON.stringify(chapter));
}

fs.writeFileSync(OUTPUT_FILE, results.join("\n") + "\n", "utf-8");
console.log(`\nWrote ${results.length} chapters to ${OUTPUT_FILE}`);
console.log("Run: npx convex import --table chapters chapters.jsonl");

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chapters: defineTable({
    number: v.number(),
    title: v.string(),
    content: v.string(),
    paragraphIndex: v.number(),
    totalParagraphs: v.number(),
  }).index("by_number", ["number"]),
});

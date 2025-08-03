import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stories: defineTable({
    id: v.string(),
    number: v.number(),
    title: v.string(),
    content: v.string(),
    filename: v.string(),
    isRead: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_number", ["number"]),
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listMetadata = query({
  args: {},
  handler: async (ctx) => {
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_number")
      .collect();

    return chapters.map((chapter) => ({
      _id: chapter._id,
      number: chapter.number,
      title: chapter.title,
      paragraphIndex: chapter.paragraphIndex,
      totalParagraphs: chapter.totalParagraphs,
    }));
  },
});

export const getByNumber = query({
  args: { number: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chapters")
      .withIndex("by_number")
      .filter((q) => q.eq(q.field("number"), args.number))
      .first();
  },
});

export const updateProgress = mutation({
  args: {
    number: v.number(),
    paragraphIndex: v.number(),
    totalParagraphs: v.number(),
  },
  handler: async (ctx, args) => {
    const chapter = await ctx.db
      .query("chapters")
      .withIndex("by_number")
      .filter((q) => q.eq(q.field("number"), args.number))
      .first();

    if (!chapter) {
      throw new Error(`Chapter ${args.number} not found`);
    }

    await ctx.db.patch(chapter._id, {
      paragraphIndex: args.paragraphIndex,
      totalParagraphs: args.totalParagraphs,
    });
  },
});

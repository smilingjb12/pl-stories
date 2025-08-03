import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("stories")
      .withIndex("by_number")
      .collect();
  },
});

export const listMetadata = query({
  args: {},
  handler: async (ctx) => {
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_number")
      .collect();
    
    return stories.map(story => ({
      id: story.id,
      number: story.number,
      title: story.title,
      filename: story.filename,
      isRead: story.isRead ?? false,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }));
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const story = await ctx.db
      .query("stories")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!story) {
      return null;
    }
    
    return {
      ...story,
      isRead: story.isRead ?? false,
    };
  },
});

export const getByNumber = query({
  args: { number: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stories")
      .withIndex("by_number")
      .filter((q) => q.eq(q.field("number"), args.number))
      .first();
  },
});

export const markAsRead = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const story = await ctx.db
      .query("stories")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!story) {
      throw new Error("Story not found");
    }
    
    await ctx.db.patch(story._id, { isRead: true });
  },
});

export const markAsUnread = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const story = await ctx.db
      .query("stories")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
    
    if (!story) {
      throw new Error("Story not found");
    }
    
    await ctx.db.patch(story._id, { isRead: false });
  },
});
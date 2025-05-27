import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media files table for storing uploaded images and videos
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(),
  url: varchar("url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  category: varchar("category"), // 'image', 'video'
  metadata: jsonb("metadata"), // width, height, duration, etc.
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content sections table for managing editable content
export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(), // 'about', 'hero', 'skills', etc.
  title: varchar("title").notNull(),
  content: text("content"),
  metadata: jsonb("metadata"), // additional data like subtitle, image urls, etc.
  isPublished: boolean("is_published").default(true),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skills table for managing skill entries
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  level: integer("level").notNull().default(0), // percentage 0-100
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio gallery items
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category"), // 'action', 'fights', 'stunts'
  mediaFileId: integer("media_file_id").references(() => mediaFiles.id),
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table for managing video content
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category"), // 'reel', 'behind', 'training'
  mediaFileId: integer("media_file_id").references(() => mediaFiles.id),
  thumbnailId: integer("thumbnail_id").references(() => mediaFiles.id),
  duration: integer("duration"), // in seconds
  visibility: varchar("visibility").default("public"), // 'public', 'private'
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const mediaFilesRelations = relations(mediaFiles, ({ one }) => ({
  user: one(users, {
    fields: [mediaFiles.userId],
    references: [users.id],
  }),
}));

export const contentSectionsRelations = relations(contentSections, ({ one }) => ({
  user: one(users, {
    fields: [contentSections.userId],
    references: [users.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const portfolioItemsRelations = relations(portfolioItems, ({ one }) => ({
  user: one(users, {
    fields: [portfolioItems.userId],
    references: [users.id],
  }),
  mediaFile: one(mediaFiles, {
    fields: [portfolioItems.mediaFileId],
    references: [mediaFiles.id],
  }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  mediaFile: one(mediaFiles, {
    fields: [videos.mediaFileId],
    references: [mediaFiles.id],
  }),
  thumbnail: one(mediaFiles, {
    fields: [videos.thumbnailId],
    references: [mediaFiles.id],
  }),
}));

// Insert schemas
export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentSectionSchema = createInsertSchema(contentSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;

export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type ContentSection = typeof contentSections.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

import {
  users,
  mediaFiles,
  contentSections,
  skills,
  portfolioItems,
  videos,
  type User,
  type UpsertUser,
  type MediaFile,
  type InsertMediaFile,
  type ContentSection,
  type InsertContentSection,
  type Skill,
  type InsertSkill,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Video,
  type InsertVideo,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Media file operations
  createMediaFile(mediaFile: InsertMediaFile): Promise<MediaFile>;
  getMediaFiles(userId: string): Promise<MediaFile[]>;
  getMediaFile(id: number): Promise<MediaFile | undefined>;
  updateMediaFile(id: number, mediaFile: Partial<InsertMediaFile>): Promise<MediaFile>;
  deleteMediaFile(id: number): Promise<void>;
  
  // Content section operations
  createContentSection(contentSection: InsertContentSection): Promise<ContentSection>;
  getContentSections(userId: string): Promise<ContentSection[]>;
  getContentSection(key: string): Promise<ContentSection | undefined>;
  updateContentSection(key: string, contentSection: Partial<InsertContentSection>): Promise<ContentSection>;
  
  // Skills operations
  createSkill(skill: InsertSkill): Promise<Skill>;
  getSkills(userId: string): Promise<Skill[]>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;
  
  // Portfolio operations
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getPortfolioItems(userId: string): Promise<PortfolioItem[]>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<void>;
  
  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  getVideos(userId: string): Promise<Video[]>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: number): Promise<void>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    totalImages: number;
    totalVideos: number;
    storageUsed: number;
    lastUpdate: Date | null;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Media file operations
  async createMediaFile(mediaFile: InsertMediaFile): Promise<MediaFile> {
    const [file] = await db.insert(mediaFiles).values(mediaFile).returning();
    return file;
  }

  async getMediaFiles(userId: string): Promise<MediaFile[]> {
    return await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.userId, userId))
      .orderBy(desc(mediaFiles.createdAt));
  }

  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    const [file] = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id));
    return file;
  }

  async updateMediaFile(id: number, mediaFile: Partial<InsertMediaFile>): Promise<MediaFile> {
    const [file] = await db
      .update(mediaFiles)
      .set({ ...mediaFile, updatedAt: new Date() })
      .where(eq(mediaFiles.id, id))
      .returning();
    return file;
  }

  async deleteMediaFile(id: number): Promise<void> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }

  // Content section operations
  async createContentSection(contentSection: InsertContentSection): Promise<ContentSection> {
    const [section] = await db.insert(contentSections).values(contentSection).returning();
    return section;
  }

  async getContentSections(userId: string): Promise<ContentSection[]> {
    return await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.userId, userId))
      .orderBy(asc(contentSections.key));
  }

  async getContentSection(key: string): Promise<ContentSection | undefined> {
    const [section] = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.key, key));
    return section;
  }

  async updateContentSection(key: string, contentSection: Partial<InsertContentSection>): Promise<ContentSection> {
    const [section] = await db
      .update(contentSections)
      .set({ ...contentSection, updatedAt: new Date() })
      .where(eq(contentSections.key, key))
      .returning();
    return section;
  }

  // Skills operations
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async getSkills(userId: string): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.userId, userId))
      .orderBy(asc(skills.order), asc(skills.name));
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill> {
    const [updatedSkill] = await db
      .update(skills)
      .set({ ...skill, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Portfolio operations
  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [portfolioItem] = await db.insert(portfolioItems).values(item).returning();
    return portfolioItem;
  }

  async getPortfolioItems(userId: string): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userId))
      .orderBy(asc(portfolioItems.order), desc(portfolioItems.createdAt));
  }

  async updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem> {
    const [updatedItem] = await db
      .update(portfolioItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    return updatedItem;
  }

  async deletePortfolioItem(id: number): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }

  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async getVideos(userId: string): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(asc(videos.order), desc(videos.createdAt));
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video> {
    const [updatedVideo] = await db
      .update(videos)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    totalImages: number;
    totalVideos: number;
    storageUsed: number;
    lastUpdate: Date | null;
  }> {
    const mediaFilesData = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.userId, userId));

    const images = mediaFilesData.filter(file => file.mimeType?.startsWith('image/'));
    const videos = mediaFilesData.filter(file => file.mimeType?.startsWith('video/'));
    const totalSize = mediaFilesData.reduce((sum, file) => sum + (file.size || 0), 0);
    const lastUpdate = mediaFilesData.length > 0 
      ? mediaFilesData.sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))[0].updatedAt
      : null;

    return {
      totalImages: images.length,
      totalVideos: videos.length,
      storageUsed: totalSize,
      lastUpdate,
    };
  }
}

export const storage = new DatabaseStorage();

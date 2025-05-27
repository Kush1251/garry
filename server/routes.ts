import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, getCurrentUser } from "./simpleAuth";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import {
  insertMediaFileSchema,
  insertContentSectionSchema,
  insertSkillSchema,
  insertPortfolioItemSchema,
  insertVideoSchema,
} from "@shared/schema";

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');

// Configure multer for file uploads
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WebP, MP4, and WebM files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.log('Uploads directory already exists or created successfully');
  }

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

  // Health check endpoint for self-hosting
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const stats = await storage.getDashboardStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Media file routes
  app.post('/api/media', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const file = req.file;
      
      console.log('Upload request:', { hasFile: !!file, body: req.body, files: req.files });
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      // Move file to permanent location (in production, you'd use cloud storage)
      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(uploadsDir, filename);
      await fs.rename(file.path, filepath);

      const mediaFile = await storage.createMediaFile({
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${filename}`,
        category: file.mimetype.startsWith('image/') ? 'image' : 'video',
        userId,
      });

      res.json(mediaFile);
    } catch (error) {
      console.error("Error uploading media:", error);
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  app.get('/api/media', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const mediaFiles = await storage.getMediaFiles(userId);
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  app.delete('/api/media/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const mediaFile = await storage.getMediaFile(id);
      
      if (!mediaFile) {
        return res.status(404).json({ message: "Media file not found" });
      }

      // Delete file from filesystem
      try {
        await fs.unlink(path.join('uploads', mediaFile.filename));
      } catch (error) {
        console.error("Error deleting file:", error);
      }

      await storage.deleteMediaFile(id);
      res.json({ message: "Media file deleted successfully" });
    } catch (error) {
      console.error("Error deleting media file:", error);
      res.status(500).json({ message: "Failed to delete media file" });
    }
  });

  // Content section routes
  app.get('/api/content', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const contentSections = await storage.getContentSections(userId);
      res.json(contentSections);
    } catch (error) {
      console.error("Error fetching content sections:", error);
      res.status(500).json({ message: "Failed to fetch content sections" });
    }
  });

  app.get('/api/content/:key', isAuthenticated, async (req, res) => {
    try {
      const key = req.params.key;
      const contentSection = await storage.getContentSection(key);
      res.json(contentSection);
    } catch (error) {
      console.error("Error fetching content section:", error);
      res.status(500).json({ message: "Failed to fetch content section" });
    }
  });

  app.put('/api/content/:key', isAuthenticated, async (req: any, res) => {
    try {
      const key = req.params.key;
      const user = getCurrentUser(req);
      const userId = user.id;
      const validatedData = insertContentSectionSchema.parse({
        ...req.body,
        userId,
        key,
      });

      // Check if content section exists, create if not
      let contentSection = await storage.getContentSection(key);
      if (!contentSection) {
        contentSection = await storage.createContentSection(validatedData);
      } else {
        contentSection = await storage.updateContentSection(key, validatedData);
      }

      res.json(contentSection);
    } catch (error) {
      console.error("Error updating content section:", error);
      res.status(500).json({ message: "Failed to update content section" });
    }
  });

  // Skills routes
  app.get('/api/skills', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const skills = await storage.getSkills(userId);
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post('/api/skills', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const validatedData = insertSkillSchema.parse({
        ...req.body,
        userId,
      });

      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.put('/api/skills/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);

      const skill = await storage.updateSkill(id, validatedData);
      res.json(skill);
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete('/api/skills/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSkill(id);
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const portfolioItems = await storage.getPortfolioItems(userId);
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.post('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const validatedData = insertPortfolioItemSchema.parse({
        ...req.body,
        userId,
      });

      const portfolioItem = await storage.createPortfolioItem(validatedData);
      res.json(portfolioItem);
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      res.status(500).json({ message: "Failed to create portfolio item" });
    }
  });

  app.put('/api/portfolio/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPortfolioItemSchema.partial().parse(req.body);

      const portfolioItem = await storage.updatePortfolioItem(id, validatedData);
      res.json(portfolioItem);
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      res.status(500).json({ message: "Failed to update portfolio item" });
    }
  });

  app.delete('/api/portfolio/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePortfolioItem(id);
      res.json({ message: "Portfolio item deleted successfully" });
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  // Video routes
  app.get('/api/videos', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const videos = await storage.getVideos(userId);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.post('/api/videos', isAuthenticated, async (req: any, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user.id;
      const validatedData = insertVideoSchema.parse({
        ...req.body,
        userId,
      });

      const video = await storage.createVideo(validatedData);
      res.json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put('/api/videos/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertVideoSchema.partial().parse(req.body);

      const video = await storage.updateVideo(id, validatedData);
      res.json(video);
    } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete('/api/videos/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVideo(id);
      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}

import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";

// Simple username/password authentication
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Login endpoint
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      (req.session as any).authenticated = true;
      (req.session as any).user = {
        id: "admin",
        username: DEFAULT_USERNAME,
        email: "admin@portfolio.com",
        firstName: "Admin",
        lastName: "User",
      };
      
      res.json({ 
        success: true, 
        user: (req.session as any).user 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if ((req.session as any)?.authenticated) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};

export const getCurrentUser = (req: any) => {
  return (req.session as any)?.user || null;
};
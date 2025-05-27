# Professional Portfolio & Content Management System

A dynamic content management system designed for professional portfolios, featuring multimedia handling, skills showcasing, and secure authentication. Perfect for fighters, stunt performers, and other professionals who need to showcase their work with rich media content.

## Features

- **Professional Portfolio Display** - Showcase your work with beautiful galleries
- **Skills Management** - Display your abilities with animated progress bars
- **Media Library** - Upload and organize photos and videos
- **Content Management** - Edit all website content through an admin interface
- **Video Integration** - Embed and manage video content
- **Responsive Design** - Looks great on all devices
- **Secure Authentication** - Login system with session management
- **Database-Driven** - PostgreSQL backend for reliable data storage

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: OpenID Connect (Replit Auth)
- **UI**: Tailwind CSS + shadcn/ui components
- **Deployment**: Optimized for Replit but can be self-hosted

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd professional-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=portfolio_db

# Session Configuration
SESSION_SECRET=your-super-secure-session-secret-here

# Authentication (if using Replit Auth)
REPLIT_DOMAINS=your-domain.com
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc

# Development
NODE_ENV=development
PORT=5000
```

### 4. Database Setup

#### Option A: Local PostgreSQL Setup

1. **Install PostgreSQL** on your system
2. **Create a database**:
   ```sql
   createdb portfolio_db
   ```
3. **Create a user** (optional):
   ```sql
   CREATE USER portfolio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
   ```

#### Option B: Docker PostgreSQL (Recommended)

```bash
# Run PostgreSQL in Docker
docker run --name portfolio-postgres \
  -e POSTGRES_DB=portfolio_db \
  -e POSTGRES_USER=portfolio_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15

# Update your .env with:
DATABASE_URL=postgresql://portfolio_user:your_password@localhost:5432/portfolio_db
```

### 5. Initialize Database Schema

```bash
# Push the schema to your database
npm run db:push
```

This will create all necessary tables:
- `users` - User authentication data
- `sessions` - Session storage
- `media_files` - Uploaded images/videos
- `content_sections` - Website content (about, hero, etc.)
- `skills` - Professional skills with levels
- `portfolio_items` - Gallery projects
- `videos` - Video content management

### 6. Start the Application

```bash
# Development mode (recommended for learning)
npm run dev

# Production mode
npm run build
npm start
```

The application will be available at `http://localhost:5000`

## Project Structure

```
professional-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── admin/      # Admin panel components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Application pages
│   │   └── main.tsx        # Entry point
│   └── index.html
├── server/                 # Express backend
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── replitAuth.ts      # Authentication setup
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
├── uploads/               # File upload directory
├── package.json
└── README.md
```

## Key Features Explained

### Admin Panel
- **Content Editor**: Manage all website content
- **Media Library**: Upload and organize images/videos
- **Gallery Management**: Create portfolio projects with multiple images
- **Skills Management**: Add skills with proficiency levels
- **Video Manager**: Embed and manage video content

### Frontend Portfolio
- **Hero Section**: Dynamic background with professional introduction
- **About Section**: Personal biography and background
- **Skills Display**: Animated progress bars showing proficiency levels
- **Portfolio Gallery**: Clickable projects with multiple images
- **Video Showcase**: Embedded video content
- **Contact Information**: Professional contact details

## Database Schema

The application uses PostgreSQL with the following main tables:

```sql
-- Users (authentication)
users (id, email, firstName, lastName, profileImageUrl, createdAt, updatedAt)

-- Media files (images/videos)
media_files (id, filename, originalName, mimeType, size, url, userId, createdAt)

-- Content sections (website content)
content_sections (id, key, title, content, metadata, userId, createdAt, updatedAt)

-- Skills (professional abilities)
skills (id, name, description, level, order, userId, createdAt, updatedAt)

-- Portfolio items (gallery projects)
portfolio_items (id, title, description, category, mediaFileIds, order, userId, createdAt)

-- Videos (video content)
videos (id, title, description, category, videoUrl, thumbnailUrl, userId, createdAt)
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout user

### Content Management
- `GET /api/content` - Get content sections
- `POST /api/content` - Create content section
- `PUT /api/content/:key` - Update content section

### Media Management
- `GET /api/media` - Get media files
- `POST /api/media` - Upload media file
- `DELETE /api/media/:id` - Delete media file

### Portfolio Management
- `GET /api/portfolio` - Get portfolio items
- `POST /api/portfolio` - Create portfolio item
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

### Skills Management
- `GET /api/skills` - Get skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Video Management
- `GET /api/videos` - Get videos
- `POST /api/videos` - Create video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

## Deployment Options

### Self-Hosting (VPS/Cloud)

1. **Set up a server** (Ubuntu/CentOS recommended)
2. **Install dependencies** (Node.js, PostgreSQL, Nginx)
3. **Clone and configure** the application
4. **Set up reverse proxy** with Nginx
5. **Configure SSL** with Let's Encrypt
6. **Set up process manager** (PM2 recommended)

Example PM2 configuration:
```bash
npm install -g pm2
pm2 start npm --name "portfolio" -- run start
pm2 save
pm2 startup
```

### Docker Deployment

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  portfolio-app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://portfolio:password@db:5432/portfolio_db
      - SESSION_SECRET=your-secret-here
    depends_on:
      - db
    
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: portfolio_db
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Security Considerations

- **Environment Variables**: Never commit `.env` files
- **Session Security**: Use strong session secrets
- **File Uploads**: Validate file types and sizes
- **Database**: Use connection pooling and prepared statements
- **HTTPS**: Always use SSL in production
- **Authentication**: Implement proper session management

## Educational Use

This project is excellent for learning:

- **Full-Stack Development**: React + Node.js + PostgreSQL
- **Modern TypeScript**: Strict typing throughout
- **Database Design**: Relational database with proper schemas
- **Authentication**: Session-based auth with OpenID Connect
- **File Handling**: Media upload and management
- **API Design**: RESTful API patterns
- **UI/UX**: Modern design with Tailwind CSS
- **Deployment**: Production-ready configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For educational purposes and learning, this codebase includes:
- Comprehensive TypeScript types
- Detailed comments throughout
- Modular architecture
- Best practices implementation
- Production-ready patterns

Perfect for computer science students, web development bootcamps, and professional portfolio needs!
#!/bin/bash

# Professional Portfolio Deployment Script
# For educational self-hosting purposes

set -e

echo "🚀 Professional Portfolio Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version must be 18 or higher. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check if Docker is available (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker detected - you can use Docker deployment"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker not detected - manual deployment only"
        DOCKER_AVAILABLE=false
    fi
    
    print_success "All requirements met!"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your actual configuration before proceeding!"
        print_warning "Pay special attention to DATABASE_URL and SESSION_SECRET"
        read -p "Press Enter after you've configured your .env file..."
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    print_success "Environment setup complete!"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if command -v pg_isready &> /dev/null; then
        if pg_isready -q; then
            print_success "PostgreSQL is running"
        else
            print_warning "PostgreSQL is not running or not accessible"
            print_status "You may need to start PostgreSQL manually"
        fi
    else
        print_warning "PostgreSQL client tools not found"
        print_status "Make sure your database is accessible via the DATABASE_URL in .env"
    fi
    
    # Run database migrations
    print_status "Applying database schema..."
    npm run db:push
    
    print_success "Database setup complete!"
}

# Build application
build_application() {
    print_status "Building application..."
    
    # Build the frontend
    npm run build
    
    print_success "Application built successfully!"
}

# Docker deployment
deploy_docker() {
    print_status "Starting Docker deployment..."
    
    # Check if docker-compose is available
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose not found"
        exit 1
    fi
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    $COMPOSE_CMD down
    
    # Build and start containers
    print_status "Building and starting containers..."
    $COMPOSE_CMD up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if $COMPOSE_CMD ps | grep -q "Up"; then
        print_success "Docker deployment successful!"
        print_status "Application should be available at http://localhost:5000"
    else
        print_error "Docker deployment failed"
        $COMPOSE_CMD logs
        exit 1
    fi
}

# Manual deployment
deploy_manual() {
    print_status "Starting manual deployment..."
    
    # Create necessary directories
    mkdir -p logs uploads
    
    # Start the application
    print_status "Starting application..."
    
    if command -v pm2 &> /dev/null; then
        print_status "Using PM2 for process management..."
        pm2 delete portfolio 2>/dev/null || true
        pm2 start npm --name "portfolio" -- start
        pm2 save
        print_success "Application started with PM2"
        print_status "Use 'pm2 logs portfolio' to view logs"
        print_status "Use 'pm2 restart portfolio' to restart"
    else
        print_warning "PM2 not installed. Starting in foreground mode..."
        print_status "For production, consider installing PM2: npm install -g pm2"
        npm start
    fi
}

# Health check
health_check() {
    print_status "Running health check..."
    
    # Wait a moment for the server to start
    sleep 5
    
    # Check if the application is responding
    if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
        print_success "Application is healthy and responding!"
    else
        print_warning "Health check failed - application may still be starting"
    fi
}

# Main deployment function
main() {
    echo ""
    print_status "Choose deployment method:"
    echo "1) Docker (recommended for easy setup)"
    echo "2) Manual (direct Node.js deployment)"
    echo "3) Development mode (for testing)"
    echo ""
    
    read -p "Enter your choice (1-3): " choice
    
    case $choice in
        1)
            if [ "$DOCKER_AVAILABLE" = true ]; then
                check_requirements
                setup_environment
                deploy_docker
                health_check
            else
                print_error "Docker is not available on this system"
                exit 1
            fi
            ;;
        2)
            check_requirements
            setup_environment
            setup_database
            build_application
            deploy_manual
            health_check
            ;;
        3)
            check_requirements
            setup_environment
            setup_database
            print_status "Starting development server..."
            npm run dev
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "🎉 Deployment complete!"
    echo ""
    print_status "Access your portfolio at: http://localhost:5000"
    print_status "Admin panel at: http://localhost:5000/admin"
    echo ""
    print_status "Next steps:"
    echo "- Configure your portfolio content through the admin panel"
    echo "- Upload your professional photos and videos"
    echo "- Add your skills and experience"
    echo "- Customize the about section"
    echo ""
    print_status "For production deployment:"
    echo "- Set up a reverse proxy (Nginx)"
    echo "- Configure SSL certificates"
    echo "- Set up proper backup procedures"
    echo "- Monitor application logs"
    echo ""
}

# Run main function
main "$@"
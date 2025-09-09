#!/bin/bash

# LexiK3 Web Production Deployment Script
# This script deploys the LexiK3 web application to production

set -e

echo "🚀 Starting LexiK3 Web Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please edit .env file with your production values before continuing."
        exit 1
    else
        print_error ".env.example file not found. Please create environment configuration."
        exit 1
    fi
fi

# Load environment variables
source .env

print_status "Environment: ${REACT_APP_ENVIRONMENT:-production}"
print_status "API URL: ${REACT_APP_API_URL:-http://localhost:5071}"

# Build the application
print_status "Building React application..."
npm ci
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the build output."
    exit 1
fi

print_status "Build completed successfully!"

# Build Docker image
print_status "Building Docker image..."
docker build -t lexik3-web:latest .

if [ $? -ne 0 ]; then
    print_error "Docker build failed. Please check the build output."
    exit 1
fi

print_status "Docker image built successfully!"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Start services
print_status "Starting services..."
docker-compose up -d

if [ $? -ne 0 ]; then
    print_error "Failed to start services. Please check the logs."
    exit 1
fi

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if services are running
print_status "Checking service health..."

# Check web service
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✅ Web service is healthy"
else
    print_warning "⚠️ Web service health check failed"
fi

# Check API service
if curl -f http://localhost:5071/health > /dev/null 2>&1; then
    print_status "✅ API service is healthy"
else
    print_warning "⚠️ API service health check failed"
fi

print_status "🎉 Deployment completed successfully!"
print_status "Web application: http://localhost:3000"
print_status "API endpoint: http://localhost:5071"
print_status "Health check: http://localhost:3000/health"

echo ""
print_status "To view logs: docker-compose logs -f"
print_status "To stop services: docker-compose down"
print_status "To restart services: docker-compose restart"

@echo off
REM LexiK3 Web Production Deployment Script for Windows
REM This script deploys the LexiK3 web application to production

echo 🚀 Starting LexiK3 Web Production Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo [WARNING] Please edit .env file with your production values before continuing.
        exit /b 1
    ) else (
        echo [ERROR] .env.example file not found. Please create environment configuration.
        exit /b 1
    )
)

echo [INFO] Environment configuration loaded

REM Build the application
echo [INFO] Building React application...
call npm ci
if %errorlevel% neq 0 (
    echo [ERROR] npm ci failed. Please check the output.
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Please check the build output.
    exit /b 1
)

echo [INFO] Build completed successfully!

REM Build Docker image
echo [INFO] Building Docker image...
docker build -t lexik3-web:latest .
if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed. Please check the build output.
    exit /b 1
)

echo [INFO] Docker image built successfully!

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose down

REM Start services
echo [INFO] Starting services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services. Please check the logs.
    exit /b 1
)

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo [INFO] Checking service health...

REM Check web service
curl -f http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] ✅ Web service is healthy
) else (
    echo [WARNING] ⚠️ Web service health check failed
)

REM Check API service
curl -f http://localhost:5071/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] ✅ API service is healthy
) else (
    echo [WARNING] ⚠️ API service health check failed
)

echo [INFO] 🎉 Deployment completed successfully!
echo [INFO] Web application: http://localhost:3000
echo [INFO] API endpoint: http://localhost:5071
echo [INFO] Health check: http://localhost:3000/health
echo.
echo [INFO] To view logs: docker-compose logs -f
echo [INFO] To stop services: docker-compose down
echo [INFO] To restart services: docker-compose restart

pause

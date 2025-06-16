#!/bin/bash

# Earnings Sentiment Analyzer - Local Development Setup Script
# Usage: ./scripts/local-setup.sh [--reset] [--no-docker]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
RESET_DATA=${1:-false}
NO_DOCKER=${2:-false}

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites for local development..."
    
    local missing_tools=()
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing_tools+=("node.js (>=18)")
    else
        local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            missing_tools+=("node.js (>=18, current: $(node -v))")
        fi
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        missing_tools+=("python3")
    else
        local python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
        if ! python3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)" 2>/dev/null; then
            missing_tools+=("python3 (>=3.9, current: $python_version)")
        fi
    fi
    
    # Check pip
    if ! command -v pip3 &> /dev/null && ! python3 -m pip --version &> /dev/null; then
        missing_tools+=("pip3")
    fi
    
    # Check Docker (if not skipped)
    if [ "$NO_DOCKER" != "--no-docker" ]; then
        if ! command -v docker &> /dev/null; then
            missing_tools+=("docker")
        fi
        
        if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
            missing_tools+=("docker-compose")
        fi
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools:"
        printf '%s\n' "${missing_tools[@]}"
        echo
        echo "Please install the missing tools and try again."
        echo
        echo "Installation guides:"
        echo "- Node.js: https://nodejs.org/"
        echo "- Python: https://python.org/"
        echo "- Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Create root .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating root .env file..."
        cat > .env << 'EOF'
# AWS Configuration (for local development with AWS services)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_DEFAULT_REGION=us-east-1

# API Keys
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key

# Terraform State Bucket (for deployment)
TF_STATE_BUCKET=your-terraform-state-bucket

# Amplify App IDs (for deployment)
AMPLIFY_APP_ID_DEV=your-dev-amplify-app-id
AMPLIFY_APP_ID_PROD=your-prod-amplify-app-id
EOF
        print_warning "Created .env file with placeholder values. Please update with your actual credentials."
    else
        print_status "Root .env file already exists"
    fi
    
    # Create frontend .env.local file
    if [ ! -f frontend/.env.local ]; then
        print_status "Creating frontend/.env.local file..."
        cat > frontend/.env.local << 'EOF'
# Local development environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=local
NEXT_PUBLIC_DEBUG=true
EOF
        print_success "Created frontend/.env.local"
    else
        print_status "Frontend .env.local file already exists"
    fi
    
    # Create backend .env file
    if [ ! -f backend/.env ]; then
        print_status "Creating backend/.env file..."
        cat > backend/.env << 'EOF'
# Local development environment variables
ENVIRONMENT=local
PYTHONPATH=/app
FLASK_ENV=development
FLASK_DEBUG=1

# AWS Configuration (for local development)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1

# Local service endpoints
DYNAMODB_ENDPOINT=http://localhost:8001
S3_ENDPOINT=http://localhost:4566

# Buckets (will be created in LocalStack)
ML_MODELS_BUCKET=local-ml-models
EARNINGS_DATA_BUCKET=local-earnings-data

# API Keys (replace with real values)
ALPHA_VANTAGE_API_KEY=demo
EOF
        print_success "Created backend/.env"
    else
        print_status "Backend .env file already exists"
    fi
}

# Function to set up frontend
setup_frontend() {
    print_status "Setting up frontend dependencies..."
    
    cd frontend
    
    # Create package.json if it doesn't exist
    if [ ! -f package.json ]; then
        print_status "Creating frontend package.json..."
        cat > package.json << 'EOF'
{
  "name": "earnings-sentiment-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "^1.6.2",
    "recharts": "^2.8.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "20.10.4",
    "@types/react": "18.2.42",
    "@types/react-dom": "18.2.17",
    "typescript": "5.3.3",
    "eslint": "8.55.0",
    "eslint-config-next": "14.0.4",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5"
  }
}
EOF
    fi
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create basic Next.js config
    if [ ! -f next.config.js ]; then
        print_status "Creating Next.js configuration..."
        cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: 'earnings-sentiment',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
EOF
    fi
    
    # Create TypeScript config
    if [ ! -f tsconfig.json ]; then
        print_status "Creating TypeScript configuration..."
        cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "../../*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    fi
    
    cd ..
    
    print_success "Frontend setup completed"
}

# Function to set up backend
setup_backend() {
    print_status "Setting up backend dependencies..."
    
    cd backend
    
    # Create requirements.txt if it doesn't exist
    if [ ! -f requirements.txt ]; then
        print_status "Creating backend requirements.txt..."
        cat > requirements.txt << 'EOF'
fastapi==0.108.0
uvicorn[standard]==0.25.0
pydantic==2.5.2
boto3==1.34.34
scikit-learn==1.4.0
pandas==2.2.0
numpy==1.26.3
requests==2.31.0
python-multipart==0.0.6
python-dotenv==1.0.0
pymongo==4.6.1
aiofiles==23.2.1
EOF
    fi
    
    # Create dev requirements if it doesn't exist
    if [ ! -f requirements-dev.txt ]; then
        print_status "Creating backend requirements-dev.txt..."
        cat > requirements-dev.txt << 'EOF'
pytest==7.4.3
pytest-cov==4.1.0
pytest-asyncio==0.21.1
flake8==6.1.0
black==23.12.0
isort==5.13.2
mypy==1.8.0
httpx==0.25.2
EOF
    fi
    
    # Create virtual environment
    if [ ! -d venv ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    print_status "Installing backend dependencies..."
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    pip install -r requirements-dev.txt
    
    # Create basic project structure
    mkdir -p src/handlers src/models src/services src/utils tests
    
    # Create basic main.py if it doesn't exist
    if [ ! -f src/main.py ]; then
        print_status "Creating basic FastAPI application..."
        cat > src/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Earnings Sentiment Analyzer", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Earnings Sentiment Analyzer API", "environment": os.getenv("ENVIRONMENT", "local")}

@app.get("/health")
async def health():
    return {"status": "healthy", "environment": os.getenv("ENVIRONMENT", "local")}
EOF
    fi
    
    cd ..
    
    print_success "Backend setup completed"
}

# Function to initialize local services
init_local_services() {
    if [ "$NO_DOCKER" = "--no-docker" ]; then
        print_status "Skipping Docker services setup"
        return
    fi
    
    print_status "Initializing local services with Docker..."
    
    # Reset data if requested
    if [ "$RESET_DATA" = "--reset" ]; then
        print_warning "Resetting local data..."
        docker-compose down -v
        docker system prune -f
    fi
    
    # Start services
    print_status "Starting local services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    local services=("frontend:3000" "backend:8000" "dynamodb-local:8001" "localstack:4566")
    
    for service in "${services[@]}"; do
        IFS=':' read -r name port <<< "$service"
        print_status "Checking $name service..."
        
        local retries=30
        while [ $retries -gt 0 ]; do
            if curl -f http://localhost:$port/health >/dev/null 2>&1 || \
               curl -f http://localhost:$port >/dev/null 2>&1; then
                print_success "$name service is ready"
                break
            fi
            retries=$((retries - 1))
            sleep 2
        done
        
        if [ $retries -eq 0 ]; then
            print_warning "$name service may not be ready"
        fi
    done
    
    print_success "Local services initialized"
    print_status "Services available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:8000"
    echo "  - DynamoDB Admin: http://localhost:8002"
    echo "  - LocalStack: http://localhost:4566"
}

# Function to display usage information
show_usage() {
    echo "Earnings Sentiment Analyzer - Local Development Setup"
    echo
    echo "Usage: ./scripts/local-setup.sh [OPTIONS]"
    echo
    echo "Options:"
    echo "  --reset      Reset all local data and containers"
    echo "  --no-docker  Skip Docker services setup"
    echo "  --help       Show this help message"
    echo
    echo "Examples:"
    echo "  ./scripts/local-setup.sh                 # Normal setup"
    echo "  ./scripts/local-setup.sh --reset         # Reset and setup"
    echo "  ./scripts/local-setup.sh --no-docker     # Setup without Docker"
}

# Main setup function
main() {
    if [ "$1" = "--help" ]; then
        show_usage
        exit 0
    fi
    
    print_status "Starting local development environment setup"
    
    check_prerequisites
    create_env_files
    setup_frontend
    setup_backend
    init_local_services
    
    print_success "Local development environment setup completed!"
    echo
    print_status "Next steps:"
    echo "1. Update .env files with your actual API keys and credentials"
    echo "2. Start development:"
    echo "   - Frontend: cd frontend && npm run dev"
    echo "   - Backend: cd backend && source venv/bin/activate && python -m uvicorn src.main:app --reload"
    echo "3. Or use Docker: docker-compose up"
    echo
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@"
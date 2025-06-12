#!/bin/bash

# Earnings Sentiment Analyzer - Deployment Script
# Usage: ./scripts/deploy.sh [dev|prod] [--infrastructure-only|--backend-only|--frontend-only]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-dev}
DEPLOY_TYPE=${2:-all}
AWS_REGION=${AWS_REGION:-us-east-1}
PROJECT_NAME="earnings-sentiment"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|prod)$ ]]; then
    echo -e "${RED}Error: Environment must be 'dev' or 'prod'${NC}"
    echo "Usage: ./scripts/deploy.sh [dev|prod] [--infrastructure-only|--backend-only|--frontend-only]"
    exit 1
fi

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
    print_status "Checking prerequisites..."
    
    # Check if required tools are installed
    local missing_tools=()
    
    if ! command -v terraform &> /dev/null; then
        missing_tools+=("terraform")
    fi
    
    if ! command -v aws &> /dev/null; then
        missing_tools+=("aws-cli")
    fi
    
    if ! command -v docker &> /dev/null; then
        missing_tools+=("docker")
    fi
    
    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo "Please install the missing tools and try again."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured or invalid"
        echo "Please run 'aws configure' or set AWS environment variables"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to deploy infrastructure
deploy_infrastructure() {
    print_status "Deploying infrastructure for $ENVIRONMENT environment..."
    
    cd terraform
    
    # Initialize Terraform
    print_status "Initializing Terraform..."
    terraform init \
        -backend-config="bucket=${TF_STATE_BUCKET:-$PROJECT_NAME-terraform-state}" \
        -backend-config="key=$PROJECT_NAME/$ENVIRONMENT/terraform.tfstate" \
        -backend-config="region=$AWS_REGION"
    
    # Plan
    print_status "Creating Terraform plan..."
    terraform plan -var-file="environments/$ENVIRONMENT.tfvars" -out=tfplan
    
    # Apply
    print_status "Applying Terraform changes..."
    terraform apply tfplan
    
    # Get outputs
    print_status "Getting infrastructure outputs..."
    API_GATEWAY_URL=$(terraform output -raw api_gateway_url)
    ML_MODELS_BUCKET=$(terraform output -raw ml_models_bucket)
    EARNINGS_DATA_BUCKET=$(terraform output -raw earnings_data_bucket)
    
    echo "API_GATEWAY_URL=$API_GATEWAY_URL" > ../deployment_outputs.env
    echo "ML_MODELS_BUCKET=$ML_MODELS_BUCKET" >> ../deployment_outputs.env
    echo "EARNINGS_DATA_BUCKET=$EARNINGS_DATA_BUCKET" >> ../deployment_outputs.env
    
    cd ..
    
    print_success "Infrastructure deployment completed"
    print_status "API Gateway URL: $API_GATEWAY_URL"
}

# Function to deploy backend
deploy_backend() {
    print_status "Deploying backend Lambda functions..."
    
    # Source deployment outputs
    if [ -f deployment_outputs.env ]; then
        source deployment_outputs.env
    else
        print_error "deployment_outputs.env not found. Run infrastructure deployment first."
        exit 1
    fi
    
    cd backend
    
    # Build and package Lambda functions
    print_status "Building Lambda deployment packages..."
    
    # Create deployment directory
    rm -rf deployment
    mkdir -p deployment
    
    # Install dependencies
    pip install -r requirements.txt -t deployment/
    
    # Copy source code
    cp -r src/* deployment/
    
    # Create zip file
    cd deployment
    zip -r ../lambda-deployment.zip .
    cd ..
    
    # Deploy each Lambda function
    local functions=("sentiment-analyzer" "stock-data-fetcher" "prediction-engine")
    
    for func in "${functions[@]}"; do
        local function_name="$PROJECT_NAME-$func-$ENVIRONMENT"
        print_status "Updating Lambda function: $function_name"
        
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file fileb://lambda-deployment.zip \
            --region "$AWS_REGION"
        
        # Wait for update to complete
        aws lambda wait function-updated \
            --function-name "$function_name" \
            --region "$AWS_REGION"
        
        print_success "Updated $function_name"
    done
    
    # Clean up
    rm -rf deployment lambda-deployment.zip
    
    cd ..
    
    print_success "Backend deployment completed"
}

# Function to deploy frontend
deploy_frontend() {
    print_status "Deploying frontend to AWS Amplify..."
    
    # Source deployment outputs
    if [ -f deployment_outputs.env ]; then
        source deployment_outputs.env
    else
        print_warning "deployment_outputs.env not found. Using placeholder API URL."
        API_GATEWAY_URL="https://placeholder-api-url"
    fi
    
    cd frontend
    
    # Update environment file
    cat > .env.production << EOF
NEXT_PUBLIC_API_URL=$API_GATEWAY_URL
NEXT_PUBLIC_ENVIRONMENT=$ENVIRONMENT
EOF
    
    # Build the application
    print_status "Building Next.js application..."
    npm ci
    npm run build
    
    # Get Amplify app ID based on environment
    if [ "$ENVIRONMENT" = "prod" ]; then
        AMPLIFY_APP_ID=${AMPLIFY_APP_ID_PROD}
        BRANCH_NAME="main"
    else
        AMPLIFY_APP_ID=${AMPLIFY_APP_ID_DEV}
        BRANCH_NAME="develop"
    fi
    
    if [ -z "$AMPLIFY_APP_ID" ]; then
        print_warning "Amplify App ID not set. Please deploy via Git push or set AMPLIFY_APP_ID_${ENVIRONMENT^^} environment variable."
    else
        # Trigger Amplify deployment
        print_status "Triggering Amplify deployment..."
        JOB_ID=$(aws amplify start-job \
            --app-id "$AMPLIFY_APP_ID" \
            --branch-name "$BRANCH_NAME" \
            --job-type RELEASE \
            --query 'jobSummary.jobId' \
            --output text \
            --region "$AWS_REGION")
        
        print_status "Amplify deployment started with Job ID: $JOB_ID"
        print_status "Monitor deployment at: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID"
    fi
    
    cd ..
    
    print_success "Frontend deployment initiated"
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Source deployment outputs
    if [ -f deployment_outputs.env ]; then
        source deployment_outputs.env
    else
        print_warning "deployment_outputs.env not found. Skipping health checks."
        return
    fi
    
    # Test API Gateway health endpoint
    if [ -n "$API_GATEWAY_URL" ]; then
        print_status "Testing API Gateway health endpoint..."
        
        local health_url="$API_GATEWAY_URL/health"
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$health_url" || echo "000")
        
        if [ "$response" = "200" ]; then
            print_success "API Gateway health check passed"
        else
            print_warning "API Gateway health check failed (HTTP $response)"
        fi
    fi
    
    # Test Lambda functions
    local functions=("sentiment-analyzer" "stock-data-fetcher" "prediction-engine")
    
    for func in "${functions[@]}"; do
        local function_name="$PROJECT_NAME-$func-$ENVIRONMENT"
        print_status "Testing Lambda function: $function_name"
        
        local result=$(aws lambda invoke \
            --function-name "$function_name" \
            --payload '{"httpMethod": "GET", "path": "/health"}' \
            --region "$AWS_REGION" \
            /tmp/lambda-response.json 2>/dev/null && echo "success" || echo "failed")
        
        if [ "$result" = "success" ]; then
            print_success "Lambda function $func test passed"
        else
            print_warning "Lambda function $func test failed"
        fi
    done
    
    rm -f /tmp/lambda-response.json
}

# Main deployment function
main() {
    print_status "Starting deployment for $ENVIRONMENT environment"
    print_status "Deploy type: $DEPLOY_TYPE"
    
    check_prerequisites
    
    case $DEPLOY_TYPE in
        "--infrastructure-only")
            deploy_infrastructure
            ;;
        "--backend-only")
            deploy_backend
            ;;
        "--frontend-only")
            deploy_frontend
            ;;
        "all"|*)
            deploy_infrastructure
            deploy_backend
            deploy_frontend
            ;;
    esac
    
    run_health_checks
    
    print_success "Deployment completed successfully!"
    
    if [ -f deployment_outputs.env ]; then
        source deployment_outputs.env
        echo
        print_status "Deployment Summary:"
        echo "Environment: $ENVIRONMENT"
        echo "API Gateway URL: $API_GATEWAY_URL"
        echo "ML Models Bucket: $ML_MODELS_BUCKET"
        echo "Earnings Data Bucket: $EARNINGS_DATA_BUCKET"
    fi
}

# Run main function
main "$@"
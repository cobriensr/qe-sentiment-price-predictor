# Multi-stage Dockerfile for Python FastAPI backend using secure ECR base image

# Base image using secure ECR Python Alpine
FROM public.ecr.aws/docker/library/python:3.12.9-alpine3.22 AS base

# Switch to root for system installations
USER root

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Create app directory
WORKDIR /app

# Install required tools and ensure musl compatibility
RUN apk add --no-cache \
    curl \
    findutils \
    gcc \
    gcompat \
    libc6-compat \
    libstdc++ \
    linux-headers \
    musl-dev \
    python3-dev \
    zip \
    && chown 1000:1000 /app

# Development stage
FROM base AS development

# Copy requirements first for better caching
COPY --chown=1000:1000 requirements.txt .
COPY --chown=1000:1000 requirements-dev.txt* ./

# Install Python dependencies as root, then switch user
RUN pip install --no-cache-dir -r requirements.txt && \
    if [ -f requirements-dev.txt ]; then pip install --no-cache-dir -r requirements-dev.txt; fi

# Create directories for models and data
RUN mkdir -p /app/models /app/data /app/.cache /app/src && \
    chown -R 1000:1000 /app

# Switch to non-root user for all subsequent operations
USER 1000:1000

# Copy source code
COPY --chown=1000:1000 src/ ./src/
COPY --chown=1000:1000 models/ ./models/

# Expose port
EXPOSE 8000

# Development command (will be overridden by docker-compose)
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage
FROM base AS production

# Copy requirements and install
COPY --chown=1000:1000 requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories and set permissions
RUN mkdir -p /app/data /app/.cache /app/logs /app/src /app/models && \
    chown -R 1000:1000 /app

# Switch to non-root user for all subsequent operations
USER 1000:1000

# Copy source code
COPY --chown=1000:1000 src/ ./src/
COPY --chown=1000:1000 models/ ./models/

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Production command
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]

# Lambda stage (for AWS Lambda deployment)
FROM public.ecr.aws/lambda/python:3.12 AS lambda

# Switch to root for installations
USER root

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code with proper ownership
COPY --chown=sbx_user1051:495 src/ ${LAMBDA_TASK_ROOT}/src/
COPY --chown=sbx_user1051:495 models/ ${LAMBDA_TASK_ROOT}/models/

# Switch back to lambda user
USER sbx_user1051

# Set the Lambda handler
CMD ["src.handlers.lambda_handler.handler"]
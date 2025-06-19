# backend/services/fmp/Dockerfile
FROM public.ecr.aws/lambda/python:3.13.2025.06.18.18

# Set explicit path (LAMBDA_TASK_ROOT=/var/task in base image)
ENV LAMBDA_TASK_ROOT=/var/task

# Copy requirements first for better layer caching
COPY requirements.txt ${LAMBDA_TASK_ROOT}/

# Install dependencies with optimizations
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt

# Copy only specific files
COPY fmp.py ${LAMBDA_TASK_ROOT}/services/fmp/
COPY __init__.py ${LAMBDA_TASK_ROOT}/services/fmp/

# Set the CMD to your handler
CMD ["services.fmp.lambda_handler"]
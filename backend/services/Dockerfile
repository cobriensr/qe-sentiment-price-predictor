# backend/services/Dockerfile
FROM public.ecr.aws/lambda/python:3.11

# Copy requirements first for better caching
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install dependencies
RUN pip install -r requirements.txt

# Copy all files from current directory (services folder) to services/ in container
COPY . ${LAMBDA_TASK_ROOT}/services/

# Set the CMD to your handler
CMD ["services.fmp.lambda_handler"]
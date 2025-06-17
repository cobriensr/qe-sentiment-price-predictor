variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "earnings-sentiment"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "python3.9"
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "lambda_memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 512
}

variable "api_gateway_stage_name" {
  description = "API Gateway stage name"
  type        = string
  default     = "v1"
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project   = "earnings-sentiment"
    ManagedBy = "terraform"
  }
}

variable "app_name" {
  description = "Application name"
  default     = "nextjs-app"
}

variable "next_public_url" {
  description = "Next.js public URL"
  type        = string
}

variable docker_context_path {
  description = "Path to the Docker context directory"
  type        = string
}
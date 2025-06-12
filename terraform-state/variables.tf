variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "earnings-sentiment"
}

variable "aws_region" {
  description = "AWS region for the state bucket"
  type        = string
  default     = "us-east-1"
}

variable "terraform_state_bucket" {
  description = "Name of the S3 bucket for storing Terraform state"
  type        = string
  # This should be globally unique, so include account ID or random suffix
}

variable "terraform_state_logs_bucket" {
  description = "Name of the S3 bucket for storing Terraform state access logs"
  type        = string
  # This should be globally unique, so include account ID or random suffix
}

variable "terraform_state_lock_table" {
  description = "Name of the DynamoDB table for Terraform state locking"
  type        = string
  default     = "earnings-sentiment-terraform-state-lock"
}
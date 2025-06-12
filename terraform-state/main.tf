# Terraform State Management Infrastructure
# This creates the S3 bucket and KMS key for storing Terraform state securely
# Deploy this FIRST before the main application infrastructure

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = "shared"
      ManagedBy   = "terraform"
      Purpose     = "terraform-state-management"
    }
  }
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

# KMS key for S3 buckets encryption
resource "aws_kms_key" "terraform_state" {
  description             = "KMS key for ${var.project_name} Terraform state buckets encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "AllowS3Service"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "AllowTerraformAccess"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "s3.${var.aws_region}.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-terraform-state-kms-key"
  }
}

resource "aws_kms_alias" "terraform_state" {
  name          = "alias/${var.project_name}-terraform-state"
  target_key_id = aws_kms_key.terraform_state.key_id
}

# S3 bucket for Terraform state
resource "aws_s3_bucket" "terraform_state" {
  bucket = var.terraform_state_bucket

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-terraform-state"
    Description = "Terraform state storage for ${var.project_name}"
  }
}

# Enable versioning for rollback capability
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.terraform_state.arn
    }
    bucket_key_enabled = true
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 bucket for storing access logs of the Terraform state bucket
resource "aws_s3_bucket" "terraform_state_access_logs" {
  bucket = var.terraform_state_logs_bucket

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-terraform-state-logs"
    Description = "Access logs for ${var.project_name} Terraform state bucket"
  }
}

# Enable versioning for the access logs bucket
resource "aws_s3_bucket_versioning" "terraform_state_access_logs" {
  bucket = aws_s3_bucket.terraform_state_access_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable encryption for the access logs bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_access_logs" {
  bucket = aws_s3_bucket.terraform_state_access_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.terraform_state.arn
    }
    bucket_key_enabled = true
  }
}

# Block public access for the access logs bucket
resource "aws_s3_bucket_public_access_block" "terraform_state_access_logs" {
  bucket = aws_s3_bucket.terraform_state_access_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable logging for the Terraform state bucket
resource "aws_s3_bucket_logging" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  target_bucket = aws_s3_bucket.terraform_state_access_logs.id
  target_prefix = "terraform-state-logs/"
}

# Lifecycle configuration for access logs cleanup
resource "aws_s3_bucket_lifecycle_configuration" "terraform_state_access_logs" {
  bucket = aws_s3_bucket.terraform_state_access_logs.id

  rule {
    id     = "access_logs_lifecycle"
    status = "Enabled"

    filter {
      prefix = "terraform-state-logs/"
    }

    expiration {
      days = 90
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_state_lock" {
  name         = var.terraform_state_lock_table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  # Enable point-in-time recovery
  point_in_time_recovery {
    enabled = true
  }

  # Server-side encryption
  server_side_encryption {
    enabled = true
  }

  tags = {
    Name        = "${var.project_name}-terraform-state-lock"
    Description = "Terraform state locking for ${var.project_name}"
  }

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }
}
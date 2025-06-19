# S3 bucket for storing ML models
resource "aws_s3_bucket" "ml_models" {
  bucket = "${var.project_name}-ml-models-${var.environment}-${random_string.bucket_suffix.result}"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-ml-models-${var.environment}"
    Environment = var.environment
    Purpose     = "ML model storage"
  })
}

# S3 bucket for storing earnings data
resource "aws_s3_bucket" "earnings_data" {
  bucket = "${var.project_name}-earnings-data-${var.environment}-${random_string.bucket_suffix.result}"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-data-${var.environment}"
    Environment = var.environment
    Purpose     = "Earnings data cache"
  })
}

# Random string to ensure unique bucket names
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# S3 bucket versioning for ML models
resource "aws_s3_bucket_versioning" "ml_models_versioning" {
  bucket = aws_s3_bucket.ml_models.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket versioning for earnings data
resource "aws_s3_bucket_versioning" "earnings_data_versioning" {
  bucket = aws_s3_bucket.earnings_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket server-side encryption for ML models
resource "aws_s3_bucket_server_side_encryption_configuration" "ml_models_encryption" {
  bucket = aws_s3_bucket.ml_models.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 bucket server-side encryption for earnings data
resource "aws_s3_bucket_server_side_encryption_configuration" "earnings_data_encryption" {
  bucket = aws_s3_bucket.earnings_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 bucket public access block for ML models
resource "aws_s3_bucket_public_access_block" "ml_models_pab" {
  bucket = aws_s3_bucket.ml_models.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 bucket public access block for earnings data
resource "aws_s3_bucket_public_access_block" "earnings_data_pab" {
  bucket = aws_s3_bucket.earnings_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
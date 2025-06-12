output "terraform_state_bucket" {
  description = "Name of the Terraform state S3 bucket"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "terraform_state_bucket_arn" {
  description = "ARN of the Terraform state S3 bucket"
  value       = aws_s3_bucket.terraform_state.arn
}

output "terraform_state_logs_bucket" {
  description = "Name of the Terraform state logs S3 bucket"
  value       = aws_s3_bucket.terraform_state_access_logs.bucket
}

output "terraform_state_lock_table" {
  description = "Name of the DynamoDB table for state locking"
  value       = aws_dynamodb_table.terraform_state_lock.name
}

output "kms_key_id" {
  description = "ID of the KMS key used for encryption"
  value       = aws_kms_key.terraform_state.key_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key used for encryption"
  value       = aws_kms_key.terraform_state.arn
}

output "kms_alias_name" {
  description = "Name of the KMS key alias"
  value       = aws_kms_alias.terraform_state.name
}

# Backend configuration values to use in main Terraform
output "backend_config" {
  description = "Backend configuration for main Terraform"
  value = {
    bucket         = aws_s3_bucket.terraform_state.bucket
    region         = var.aws_region
    encrypt        = true
    kms_key_id     = aws_kms_key.terraform_state.arn
    dynamodb_table = aws_dynamodb_table.terraform_state_lock.name
  }
}
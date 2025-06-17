data "aws_availability_zones" "available" {
  state = "available"
}

# Data source for current AWS caller identity
data "aws_caller_identity" "current" {}

# Data source for current AWS region
data "aws_region" "current" {}

# Data source for AWS partition
data "aws_partition" "current" {}

# Configure Docker provider
data "aws_ecr_authorization_token" "token" {}
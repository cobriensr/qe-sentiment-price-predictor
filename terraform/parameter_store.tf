# Store credentials in AWS Systems Manager Parameter Store
resource "aws_ssm_parameter" "github_actions_access_key_id" {
  name  = "/${var.project_name}/${var.environment}/github-actions/access-key-id"
  type  = "String"
  value = aws_iam_access_key.github_actions_deploy.id

  tags = merge(var.tags, {
    Name        = "${var.project_name}-github-actions-access-key-id-${var.environment}"
    Environment = var.environment
  })
}

resource "aws_ssm_parameter" "github_actions_secret_access_key" {
  name  = "/${var.project_name}/${var.environment}/github-actions/secret-access-key"
  type  = "SecureString"
  value = aws_iam_access_key.github_actions_deploy.secret

  tags = merge(var.tags, {
    Name        = "${var.project_name}-github-actions-secret-access-key-${var.environment}"
    Environment = var.environment
  })
}

# Store FMP API key in Parameter Store
resource "aws_ssm_parameter" "fmp_api_key" {
  name  = "/${var.project_name}/${var.environment}/fmp-api-key"
  type  = "SecureString"
  value = var.fmp_api_key

  tags = merge(var.tags, {
    Name        = "${var.project_name}-fmp-api-key-${var.environment}"
    Environment = var.environment
  })
}

# Store DynamoDB table name in Parameter Store
resource "aws_ssm_parameter" "earnings_table_name" {
  name  = "/${var.project_name}/${var.environment}/earnings-calendar-table"
  type  = "String"
  value = aws_dynamodb_table.earnings_cache.name

  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-table-name-${var.environment}"
    Environment = var.environment
  })
}

# Store Alpha Vantage API key in Parameter Store
resource "aws_ssm_parameter" "alpha_vantage_api_key" {
  name  = "/${var.project_name}/${var.environment}/alpha-vantage-api-key"
  type  = "SecureString"
  value = var.alpha_vantage_api_key

  tags = merge(var.tags, {
    Name        = "${var.project_name}-alpha-vantage-api-key-${var.environment}"
    Environment = var.environment
  })
}

# Store the transcript table name in Parameter Store
resource "aws_ssm_parameter" "transcript_table_name" {
  name  = "/${var.project_name}/${var.environment}/earnings-transcripts-table"
  type  = "String"
  value = aws_dynamodb_table.earnings_transcripts.name
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-transcript-table-name-${var.environment}"
    Environment = var.environment
  })
}

# Store S3 bucket names in Parameter Store for Lambda access
resource "aws_ssm_parameter" "earnings_data_bucket" {
  name  = "/${var.project_name}/${var.environment}/earnings-data-bucket"
  type  = "String"
  value = aws_s3_bucket.earnings_data.bucket
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-data-bucket-${var.environment}"
    Environment = var.environment
  })
}

resource "aws_ssm_parameter" "ml_models_bucket" {
  name  = "/${var.project_name}/${var.environment}/ml-models-bucket"
  type  = "String"
  value = aws_s3_bucket.ml_models.bucket
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-ml-models-bucket-${var.environment}"
    Environment = var.environment
  })
}
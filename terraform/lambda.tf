# Create placeholder zip file for initial deployment
data "archive_file" "lambda_placeholder" {
  type        = "zip"
  output_path = "placeholder.zip"

  source {
    content  = "def handler(event, context): return {'statusCode': 200, 'body': 'Placeholder function'}"
    filename = "placeholder.py"
  }
}

# Lambda function for sentiment analysis
resource "aws_lambda_function" "sentiment_analyzer" {
  function_name = "${var.project_name}-sentiment-analyzer-${var.environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "handlers.sentiment.handler"
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  # Placeholder zip file - will be updated by CI/CD
  filename         = "placeholder.zip"
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT          = var.environment
      ML_MODELS_BUCKET     = aws_s3_bucket.ml_models.bucket
      EARNINGS_DATA_BUCKET = aws_s3_bucket.earnings_data.bucket
      DYNAMODB_TABLE       = aws_dynamodb_table.earnings_cache.name
      PROJECT_NAME         = var.project_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy_attachment.lambda_s3_policy_attachment,
    aws_iam_role_policy_attachment.lambda_dynamodb_policy_attachment,
    aws_iam_role_policy_attachment.lambda_ssm_policy_attachment,
  ]

  tags = merge(var.tags, {
    Name        = "${var.project_name}-sentiment-analyzer-${var.environment}"
    Environment = var.environment
    Function    = "sentiment-analysis"
  })
}

# Lambda function for stock data fetching
resource "aws_lambda_function" "stock_data_fetcher" {
  function_name = "${var.project_name}-stock-data-fetcher-${var.environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "handlers.stock_data.handler"
  runtime       = var.lambda_runtime
  timeout       = 60  # Longer timeout for API calls
  memory_size   = 256 # Less memory needed for data fetching

  # Placeholder zip file - will be updated by CI/CD
  filename         = "placeholder.zip"
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT          = var.environment
      ML_MODELS_BUCKET     = aws_s3_bucket.ml_models.bucket
      EARNINGS_DATA_BUCKET = aws_s3_bucket.earnings_data.bucket
      DYNAMODB_TABLE       = aws_dynamodb_table.earnings_cache.name
      PROJECT_NAME         = var.project_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy_attachment.lambda_s3_policy_attachment,
    aws_iam_role_policy_attachment.lambda_dynamodb_policy_attachment,
    aws_iam_role_policy_attachment.lambda_ssm_policy_attachment,
  ]

  tags = merge(var.tags, {
    Name        = "${var.project_name}-stock-data-fetcher-${var.environment}"
    Environment = var.environment
    Function    = "stock-data-fetching"
  })
}

# Lambda function for prediction engine
resource "aws_lambda_function" "prediction_engine" {
  function_name = "${var.project_name}-prediction-engine-${var.environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "handlers.prediction.handler"
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  # Placeholder zip file - will be updated by CI/CD
  filename         = "placeholder.zip"
  source_code_hash = data.archive_file.lambda_placeholder.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT          = var.environment
      ML_MODELS_BUCKET     = aws_s3_bucket.ml_models.bucket
      EARNINGS_DATA_BUCKET = aws_s3_bucket.earnings_data.bucket
      DYNAMODB_TABLE       = aws_dynamodb_table.earnings_cache.name
      PROJECT_NAME         = var.project_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_iam_role_policy_attachment.lambda_s3_policy_attachment,
    aws_iam_role_policy_attachment.lambda_dynamodb_policy_attachment,
    aws_iam_role_policy_attachment.lambda_ssm_policy_attachment,
  ]

  tags = merge(var.tags, {
    Name        = "${var.project_name}-prediction-engine-${var.environment}"
    Environment = var.environment
    Function    = "prediction-engine"
  })
}

# Earnings Calendar Lambda Function (Docker-based)
resource "aws_lambda_function" "earnings_calendar_lambda" {
  image_uri     = "${aws_ecr_repository.fmp_lambda_repo.repository_url}:latest"
  package_type  = "Image"
  function_name = "${var.project_name}-earnings-calendar-${var.environment}"
  role          = aws_iam_role.earnings_lambda_role.arn
  timeout       = 300 # 5 minutes for API calls and data processing
  memory_size   = 256 # Sufficient memory for data processing

  environment {
    variables = {
      FMP_API_KEY             = var.fmp_api_key
      EARNINGS_CALENDAR_TABLE = aws_dynamodb_table.earnings_cache.name
      PROJECT_NAME            = var.project_name
      ENVIRONMENT             = var.environment
    }
  }

  depends_on = [
    docker_registry_image.fmp_lambda_image,
    aws_iam_role_policy_attachment.earnings_lambda_basic_execution,
    aws_iam_role_policy_attachment.earnings_lambda_s3_attachment,
    aws_iam_role_policy_attachment.earnings_lambda_dynamodb_attachment,
    aws_iam_role_policy_attachment.earnings_lambda_ssm_attachment,
  ]

  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-calendar-${var.environment}"
    Environment = var.environment
    Purpose     = "Earnings calendar data processor"
  })
}

# Earnings Transcripts Lambda Function (Docker-based)
resource "aws_lambda_function" "earnings_transcripts_lambda" {
  image_uri     = "${aws_ecr_repository.alpha_vantage_lambda_repo.repository_url}:latest"
  package_type  = "Image"
  function_name = "${var.project_name}-earnings-transcripts-${var.environment}"
  role          = aws_iam_role.earnings_transcripts_lambda_role.arn
  timeout       = 900  # 15 minutes for longer processing tasks
  memory_size   = 512  # More memory for transcript processing

  environment {
    variables = {
      ALPHA_VANTAGE_API_KEY       = var.alpha_vantage_api_key
      EARNINGS_TRANSCRIPTS_TABLE  = aws_dynamodb_table.earnings_transcripts.name
      EARNINGS_DATA_BUCKET        = aws_s3_bucket.earnings_data.bucket
      ML_MODELS_BUCKET            = aws_s3_bucket.ml_models.bucket
      PROJECT_NAME                = var.project_name
      ENVIRONMENT                 = var.environment
    }
  }

  depends_on = [
    docker_registry_image.alpha_vantage_lambda_image,
    aws_iam_role_policy_attachment.earnings_transcripts_lambda_basic_execution,
    aws_iam_role_policy_attachment.earnings_transcripts_lambda_s3_attachment,
    aws_iam_role_policy_attachment.earnings_transcripts_lambda_dynamodb_attachment,
    aws_iam_role_policy_attachment.earnings_transcripts_lambda_ssm_attachment,
  ]

  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-transcripts-${var.environment}"
    Environment = var.environment
    Purpose     = "Earnings transcripts data processor with dual storage"
  })
}
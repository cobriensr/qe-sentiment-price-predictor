# IAM role for Lambda functions
resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.project_name}-lambda-execution-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-lambda-execution-role-${var.environment}"
    Environment = var.environment
  })
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Custom policy for S3 access
resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "${var.project_name}-lambda-s3-policy-${var.environment}"
  description = "IAM policy for Lambda functions to access S3 buckets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.ml_models.arn,
          "${aws_s3_bucket.ml_models.arn}/*",
          aws_s3_bucket.earnings_data.arn,
          "${aws_s3_bucket.earnings_data.arn}/*"
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-lambda-s3-policy-${var.environment}"
    Environment = var.environment
  })
}

# Attach S3 policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

# Custom policy for DynamoDB access (for future phases)
resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "${var.project_name}-lambda-dynamodb-policy-${var.environment}"
  description = "IAM policy for Lambda functions to access DynamoDB tables"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.earnings_cache.arn,
          "${aws_dynamodb_table.earnings_cache.arn}/index/*"
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-lambda-dynamodb-policy-${var.environment}"
    Environment = var.environment
  })
}

# Attach DynamoDB policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

# IAM role for API Gateway to invoke Lambda
resource "aws_iam_role" "api_gateway_lambda_role" {
  name = "${var.project_name}-api-gateway-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-api-gateway-lambda-role-${var.environment}"
    Environment = var.environment
  })
}

# Policy for API Gateway to invoke Lambda functions
resource "aws_iam_policy" "api_gateway_lambda_policy" {
  name        = "${var.project_name}-api-gateway-lambda-policy-${var.environment}"
  description = "IAM policy for API Gateway to invoke Lambda functions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          aws_lambda_function.sentiment_analyzer.arn,
          aws_lambda_function.stock_data_fetcher.arn,
          aws_lambda_function.prediction_engine.arn
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-api-gateway-lambda-policy-${var.environment}"
    Environment = var.environment
  })
}

# Attach Lambda invoke policy to API Gateway role
resource "aws_iam_role_policy_attachment" "api_gateway_lambda_policy_attachment" {
  role       = aws_iam_role.api_gateway_lambda_role.name
  policy_arn = aws_iam_policy.api_gateway_lambda_policy.arn
}
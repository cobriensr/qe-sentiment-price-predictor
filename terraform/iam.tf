# IAM role for Lambda functions (shared)
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

# Custom policy for DynamoDB access
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
          "dynamodb:Scan",
          "dynamodb:BatchWriteItem"
        ]
        Resource = [
          aws_dynamodb_table.earnings_cache.arn,
          "${aws_dynamodb_table.earnings_cache.arn}/index/*",
          aws_dynamodb_table.earnings_transcripts.arn,
          "${aws_dynamodb_table.earnings_transcripts.arn}/index/*"
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

# Custom policy for SSM Parameter Store access
resource "aws_iam_policy" "lambda_ssm_policy" {
  name        = "${var.project_name}-lambda-ssm-policy-${var.environment}"
  description = "IAM policy for Lambda functions to access Parameter Store"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Resource = [
          "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/${var.environment}/*"
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-lambda-ssm-policy-${var.environment}"
    Environment = var.environment
  })
}

# Attach SSM policy to Lambda role
resource "aws_iam_role_policy_attachment" "lambda_ssm_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_ssm_policy.arn
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
          "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:${var.project_name}-*-${var.environment}"
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

# IAM user for GitHub Actions deployment
resource "aws_iam_user" "github_actions_deploy" {
  name = "${var.project_name}-github-actions-deploy-${var.environment}"
  path = "/"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-github-actions-deploy-${var.environment}"
    Environment = var.environment
    Purpose     = "GitHub Actions CI/CD"
  })
}

# Access key for GitHub Actions user
resource "aws_iam_access_key" "github_actions_deploy" {
  user = aws_iam_user.github_actions_deploy.name
}

# Custom policy for GitHub Actions deployment
resource "aws_iam_policy" "github_actions_deploy_policy" {
  name        = "${var.project_name}-github-actions-deploy-policy-${var.environment}"
  description = "IAM policy for GitHub Actions to deploy to ECR and ECS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
          "ecr:DescribeRepositories",
          "ecr:DescribeImages",
          "ecr:ListImages"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition",
          "ecs:UpdateService",
          "ecs:DescribeServices",
          "ecs:DescribeClusters",
          "ecs:ListTasks",
          "ecs:DescribeTasks"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:PassRole"
        ]
        Resource = [
          aws_iam_role.ecs_task_execution_role.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:GetFunction",
          "lambda:InvokeFunction"
        ]
        Resource = [
          "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:${var.project_name}-*-${var.environment}"
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "${var.project_name}-github-actions-deploy-policy-${var.environment}"
    Environment = var.environment
    Purpose     = "GitHub Actions CI/CD"
  })
}

# Attach the deploy policy to GitHub Actions user
resource "aws_iam_user_policy_attachment" "github_actions_deploy_policy_attachment" {
  user       = aws_iam_user.github_actions_deploy.name
  policy_arn = aws_iam_policy.github_actions_deploy_policy.arn
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the Amazon ECS Task Execution Role Policy
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Specific IAM roles for individual Lambda functions
resource "aws_iam_role" "earnings_lambda_role" {
  name = "${var.project_name}-earnings-lambda-role-${var.environment}"

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
    Name        = "${var.project_name}-earnings-lambda-role-${var.environment}"
    Environment = var.environment
    Purpose     = "Earnings calendar lambda execution role"
  })
}

# IAM role for earnings transcripts Lambda function
resource "aws_iam_role" "earnings_transcripts_lambda_role" {
  name = "${var.project_name}-earnings-transcripts-lambda-role-${var.environment}"

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
    Name        = "${var.project_name}-earnings-transcripts-lambda-role-${var.environment}"
    Environment = var.environment
    Purpose     = "Earnings transcripts lambda execution role"
  })
}

# Attach basic execution policy to specific Lambda roles
resource "aws_iam_role_policy_attachment" "earnings_lambda_basic_execution" {
  role       = aws_iam_role.earnings_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "earnings_transcripts_lambda_basic_execution" {
  role       = aws_iam_role.earnings_transcripts_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Attach S3 policy to specific Lambda roles
resource "aws_iam_role_policy_attachment" "earnings_lambda_s3_attachment" {
  role       = aws_iam_role.earnings_lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

resource "aws_iam_role_policy_attachment" "earnings_transcripts_lambda_s3_attachment" {
  role       = aws_iam_role.earnings_transcripts_lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

# Attach DynamoDB policy to specific Lambda roles
resource "aws_iam_role_policy_attachment" "earnings_lambda_dynamodb_attachment" {
  role       = aws_iam_role.earnings_lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "earnings_transcripts_lambda_dynamodb_attachment" {
  role       = aws_iam_role.earnings_transcripts_lambda_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

# Attach SSM policy to specific Lambda roles
resource "aws_iam_role_policy_attachment" "earnings_lambda_ssm_attachment" {
  role       = aws_iam_role.earnings_lambda_role.name
  policy_arn = aws_iam_policy.lambda_ssm_policy.arn
}

resource "aws_iam_role_policy_attachment" "earnings_transcripts_lambda_ssm_attachment" {
  role       = aws_iam_role.earnings_transcripts_lambda_role.name
  policy_arn = aws_iam_policy.lambda_ssm_policy.arn
}

# Lambda permissions for API Gateway to invoke functions (using wildcard patterns for flexibility)
resource "aws_lambda_permission" "earnings_calendar_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway-earnings-calendar"
  action        = "lambda:InvokeFunction"
  function_name = "${var.project_name}-earnings-calendar-${var.environment}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*/*"
}

resource "aws_lambda_permission" "earnings_transcripts_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway-earnings-transcripts"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.earnings_transcripts_lambda.function_name  # Reference the resource
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*/*"

  depends_on = [aws_lambda_function.earnings_transcripts_lambda]
}
resource "aws_lambda_permission" "sentiment_analyzer_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway-sentiment"
  action        = "lambda:InvokeFunction"
  function_name = "${var.project_name}-sentiment-analyzer-${var.environment}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*/*"
}

resource "aws_lambda_permission" "stock_data_fetcher_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway-stock-data"
  action        = "lambda:InvokeFunction"
  function_name = "${var.project_name}-stock-data-fetcher-${var.environment}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*/*"
}

resource "aws_lambda_permission" "prediction_engine_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway-prediction"
  action        = "lambda:InvokeFunction"
  function_name = "${var.project_name}-prediction-engine-${var.environment}"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*/*/*"
}

# Lambda permissions for EventBridge
resource "aws_lambda_permission" "earnings_calendar_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge-earnings-calendar"
  action        = "lambda:InvokeFunction"
  function_name = "${var.project_name}-earnings-calendar-${var.environment}"
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:rule/${var.project_name}-earnings-daily-${var.environment}"
}

resource "aws_lambda_permission" "earnings_transcripts_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge-earnings-transcripts"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.earnings_transcripts_lambda.function_name  # Reference the resource
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:rule/${var.project_name}-earnings-transcripts-schedule-${var.environment}"

  depends_on = [aws_lambda_function.earnings_transcripts_lambda]
}
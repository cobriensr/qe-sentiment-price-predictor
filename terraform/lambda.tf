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
    }
  }

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
    }
  }

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
    }
  }

  tags = merge(var.tags, {
    Name        = "${var.project_name}-prediction-engine-${var.environment}"
    Environment = var.environment
    Function    = "prediction-engine"
  })
}

# Create placeholder zip file for initial deployment
data "archive_file" "lambda_placeholder" {
  type        = "zip"
  output_path = "placeholder.zip"

  source {
    content  = "def handler(event, context): return {'statusCode': 200, 'body': 'Placeholder function'}"
    filename = "placeholder.py"
  }
}

# CloudWatch Log Groups for Lambda functions
resource "aws_cloudwatch_log_group" "sentiment_analyzer_logs" {
  name              = "/aws/lambda/${aws_lambda_function.sentiment_analyzer.function_name}"
  retention_in_days = 14

  tags = merge(var.tags, {
    Name        = "${var.project_name}-sentiment-analyzer-logs-${var.environment}"
    Environment = var.environment
  })
}

resource "aws_cloudwatch_log_group" "stock_data_fetcher_logs" {
  name              = "/aws/lambda/${aws_lambda_function.stock_data_fetcher.function_name}"
  retention_in_days = 14

  tags = merge(var.tags, {
    Name        = "${var.project_name}-stock-data-fetcher-logs-${var.environment}"
    Environment = var.environment
  })
}

resource "aws_cloudwatch_log_group" "prediction_engine_logs" {
  name              = "/aws/lambda/${aws_lambda_function.prediction_engine.function_name}"
  retention_in_days = 14

  tags = merge(var.tags, {
    Name        = "${var.project_name}-prediction-engine-logs-${var.environment}"
    Environment = var.environment
  })
}

# Lambda permissions for API Gateway to invoke functions
resource "aws_lambda_permission" "sentiment_analyzer_api_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sentiment_analyzer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "stock_data_fetcher_api_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.stock_data_fetcher.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "prediction_engine_api_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.prediction_engine.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}
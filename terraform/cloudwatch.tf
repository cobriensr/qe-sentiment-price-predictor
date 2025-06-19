# CloudWatch Log Groups for Lambda functions
resource "aws_cloudwatch_log_group" "earnings_calendar_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.earnings_calendar_lambda.function_name}"
  retention_in_days = 14
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-calendar-logs-${var.environment}"
    Environment = var.environment
  })
}

resource "aws_cloudwatch_log_group" "earnings_transcripts_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.earnings_transcripts_lambda.function_name}"
  retention_in_days = 14
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-transcripts-logs-${var.environment}"
    Environment = var.environment
  })
}

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

# CloudWatch Log Group for ECS Application
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 7
  
  tags = merge(var.tags, {
    Name        = "${var.app_name}-logs"
    Environment = var.environment
  })
}
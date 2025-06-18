# Output API Gateway URL
output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.main.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.main.stage_name}"
}


output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.main.id
}

output "api_gateway_stage_name" {
  description = "Name of the API Gateway stage"
  value       = aws_api_gateway_stage.main.stage_name
}

# S3 bucket outputs
output "ml_models_bucket" {
  description = "Name of the S3 bucket for ML models"
  value       = aws_s3_bucket.ml_models.bucket
}

output "ml_models_bucket_arn" {
  description = "ARN of the S3 bucket for ML models"
  value       = aws_s3_bucket.ml_models.arn
}

output "earnings_data_bucket" {
  description = "Name of the S3 bucket for earnings data"
  value       = aws_s3_bucket.earnings_data.bucket
}

output "earnings_data_bucket_arn" {
  description = "ARN of the S3 bucket for earnings data"
  value       = aws_s3_bucket.earnings_data.arn
}

# Lambda function outputs
output "sentiment_analyzer_function_name" {
  description = "Name of the sentiment analyzer Lambda function"
  value       = aws_lambda_function.sentiment_analyzer.function_name
}

output "sentiment_analyzer_function_arn" {
  description = "ARN of the sentiment analyzer Lambda function"
  value       = aws_lambda_function.sentiment_analyzer.arn
}

output "stock_data_fetcher_function_name" {
  description = "Name of the stock data fetcher Lambda function"
  value       = aws_lambda_function.stock_data_fetcher.function_name
}

output "stock_data_fetcher_function_arn" {
  description = "ARN of the stock data fetcher Lambda function"
  value       = aws_lambda_function.stock_data_fetcher.arn
}

output "prediction_engine_function_name" {
  description = "Name of the prediction engine Lambda function"
  value       = aws_lambda_function.prediction_engine.function_name
}

output "prediction_engine_function_arn" {
  description = "ARN of the prediction engine Lambda function"
  value       = aws_lambda_function.prediction_engine.arn
}

output "earnings_lambda_function_name" {
  description = "Name of the earnings calendar lambda function"
  value       = aws_lambda_function.earnings_calendar_lambda.function_name
}

output "earnings_lambda_function_arn" {
  description = "ARN of the earnings calendar lambda function"
  value       = aws_lambda_function.earnings_calendar_lambda.arn
}

# DynamoDB table outputs
output "earnings_cache_table_name" {
  description = "Name of the earnings cache DynamoDB table"
  value       = aws_dynamodb_table.earnings_cache.name
}

output "earnings_cache_table_arn" {
  description = "ARN of the earnings cache DynamoDB table"
  value       = aws_dynamodb_table.earnings_cache.arn
}

output "sentiment_results_table_name" {
  description = "Name of the sentiment results DynamoDB table"
  value       = aws_dynamodb_table.sentiment_results.name
}

output "sentiment_results_table_arn" {
  description = "ARN of the sentiment results DynamoDB table"
  value       = aws_dynamodb_table.sentiment_results.arn
}

output "stock_prices_table_name" {
  description = "Name of the stock prices DynamoDB table"
  value       = aws_dynamodb_table.stock_prices.name
}

output "stock_prices_table_arn" {
  description = "ARN of the stock prices DynamoDB table"
  value       = aws_dynamodb_table.stock_prices.arn
}

# IAM role outputs
output "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.arn
}

output "lambda_execution_role_name" {
  description = "Name of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.name
}

# CloudWatch log group outputs
output "sentiment_analyzer_log_group_name" {
  description = "Name of the sentiment analyzer CloudWatch log group"
  value       = aws_cloudwatch_log_group.sentiment_analyzer_logs.name
}

output "stock_data_fetcher_log_group_name" {
  description = "Name of the stock data fetcher CloudWatch log group"
  value       = aws_cloudwatch_log_group.stock_data_fetcher_logs.name
}

output "prediction_engine_log_group_name" {
  description = "Name of the prediction engine CloudWatch log group"
  value       = aws_cloudwatch_log_group.prediction_engine_logs.name
}

# Environment and project info
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "project_name" {
  description = "Project name"
  value       = var.project_name
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

# ECS outputs
output "load_balancer_url" {
  description = "URL of the load balancer"
  value       = "http://${aws_lb.main.dns_name}"
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/nextjs-app"
}

# Github Actions outputs
output "github_actions_access_key_id" {
  description = "Access Key ID for GitHub Actions user"
  value       = aws_iam_access_key.github_actions_deploy.id
}

output "github_actions_secret_access_key" {
  description = "Secret Access Key for GitHub Actions user"
  value       = aws_iam_access_key.github_actions_deploy.secret
  sensitive   = true
}

# Https outputs
output "http_url" {
  description = "HTTP URL (redirects to HTTPS)"
  value       = "http://${aws_lb.main.dns_name}"
}

output "https_url" {
  description = "HTTPS URL of the application"
  value       = "https://${aws_lb.main.dns_name}"
}

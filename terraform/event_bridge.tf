# EventBridge Rule for daily execution
resource "aws_cloudwatch_event_rule" "earnings_daily_schedule" {
  name                = "${var.project_name}-earnings-daily-${var.environment}"
  description         = "Trigger earnings calendar lambda daily"
  schedule_expression = "cron(0 6 * * ? *)" # Daily at 6 AM UTC

  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-daily-${var.environment}"
    Environment = var.environment
  })
}

# EventBridge Target
resource "aws_cloudwatch_event_target" "earnings_lambda_target" {
  rule      = aws_cloudwatch_event_rule.earnings_daily_schedule.name
  target_id = "EarningsLambdaTarget"
  arn       = aws_lambda_function.earnings_calendar_lambda.arn
}
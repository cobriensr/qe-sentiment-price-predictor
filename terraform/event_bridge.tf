# EventBridge Rule for daily earnings calendar processing
resource "aws_cloudwatch_event_rule" "earnings_daily_schedule" {
  name                = "${var.project_name}-earnings-daily-${var.environment}"
  description         = "Trigger earnings calendar lambda daily"
  schedule_expression = "cron(0 6 * * ? *)"  # Fixed: Daily at 6 AM UTC
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-daily-${var.environment}"
    Environment = var.environment
  })
}

# EventBridge Target for earnings calendar
resource "aws_cloudwatch_event_target" "earnings_lambda_target" {
  rule      = aws_cloudwatch_event_rule.earnings_daily_schedule.name
  target_id = "EarningsLambdaTarget"
  arn       = aws_lambda_function.earnings_calendar_lambda.arn
}

# EventBridge Rule for manual transcripts processing (disabled by default)
resource "aws_cloudwatch_event_rule" "earnings_transcripts_schedule" {
  name                = "${var.project_name}-earnings-transcripts-${var.environment}"
  description         = "Manual trigger for earnings transcripts processing (disabled by default)"
  state               = "DISABLED"  # Keep it disabled for manual-only execution
  schedule_expression = "cron(0 12 ? * MON *)"  # Example: Weekly on Monday at noon (when enabled)
  
  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-transcripts-${var.environment}"
    Environment = var.environment
  })
}

# EventBridge Target for earnings transcripts
resource "aws_cloudwatch_event_target" "earnings_transcripts_target" {
  rule      = aws_cloudwatch_event_rule.earnings_transcripts_schedule.name
  target_id = "EarningsTranscriptsTarget"
  arn       = aws_lambda_function.earnings_transcripts_lambda.arn
}
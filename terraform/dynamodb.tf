# DynamoDB table for earnings data cache
resource "aws_dynamodb_table" "earnings_cache" {
  name         = "${var.project_name}-earnings-cache-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "stock_symbol"
  range_key    = "earnings_date"

  attribute {
    name = "stock_symbol"
    type = "S"
  }

  attribute {
    name = "earnings_date"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  # Global Secondary Index for querying by date
  global_secondary_index {
    name     = "earnings-date-index"
    hash_key = "earnings_date"

    projection_type = "ALL"
  }

  # Global Secondary Index for querying recent entries
  global_secondary_index {
    name     = "created-at-index"
    hash_key = "created_at"

    projection_type = "ALL"
  }

  # Enable point-in-time recovery
  point_in_time_recovery {
    enabled = true
  }

  # Server-side encryption
  server_side_encryption {
    enabled = true
  }

  # TTL attribute for automatic cleanup of old cache entries
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = merge(var.tags, {
    Name        = "${var.project_name}-earnings-cache-${var.environment}"
    Environment = var.environment
    Purpose     = "Earnings data caching"
  })
}

# DynamoDB table for storing sentiment analysis results
resource "aws_dynamodb_table" "sentiment_results" {
  name         = "${var.project_name}-sentiment-results-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "result_id"
  range_key    = "timestamp"

  attribute {
    name = "result_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "stock_symbol"
    type = "S"
  }

  # Global Secondary Index for querying by stock symbol
  global_secondary_index {
    name      = "stock-symbol-index"
    hash_key  = "stock_symbol"
    range_key = "timestamp"

    projection_type = "ALL"
  }

  # Enable point-in-time recovery
  point_in_time_recovery {
    enabled = true
  }

  # Server-side encryption
  server_side_encryption {
    enabled = true
  }

  # TTL attribute for automatic cleanup
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = merge(var.tags, {
    Name        = "${var.project_name}-sentiment-results-${var.environment}"
    Environment = var.environment
    Purpose     = "Sentiment analysis results storage"
  })
}

# DynamoDB table for storing stock price data
resource "aws_dynamodb_table" "stock_prices" {
  name         = "${var.project_name}-stock-prices-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "stock_symbol"
  range_key    = "date"

  attribute {
    name = "stock_symbol"
    type = "S"
  }

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "price_type"
    type = "S"
  }

  # Global Secondary Index for querying by price type
  global_secondary_index {
    name      = "price-type-index"
    hash_key  = "price_type"
    range_key = "date"

    projection_type = "ALL"
  }

  # Enable point-in-time recovery
  point_in_time_recovery {
    enabled = true
  }

  # Server-side encryption
  server_side_encryption {
    enabled = true
  }

  # TTL attribute for automatic cleanup of old price data
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = merge(var.tags, {
    Name        = "${var.project_name}-stock-prices-${var.environment}"
    Environment = var.environment
    Purpose     = "Stock price data storage"
  })
}
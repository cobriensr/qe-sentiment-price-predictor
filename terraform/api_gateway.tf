# API Gateway REST API
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.project_name}-api-${var.environment}"
  description = "API Gateway for ${var.project_name} ${var.environment} environment"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = merge(var.tags, {
    Name        = "${var.project_name}-api-${var.environment}"
    Environment = var.environment
  })
}

# CORS configuration for API Gateway
resource "aws_api_gateway_gateway_response" "cors" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  response_type = "DEFAULT_4XX"

  response_templates = {
    "application/json" = jsonencode({
      message = "$context.error.messageString"
    })
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
  }
}

# /sentiment resource
resource "aws_api_gateway_resource" "sentiment" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "sentiment"
}

# /stock resource  
resource "aws_api_gateway_resource" "stock" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "stock"
}

# /prediction resource
resource "aws_api_gateway_resource" "prediction" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "prediction"
}

# /health resource
resource "aws_api_gateway_resource" "health" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_rest_api.main.root_resource_id
  path_part   = "health"
}

# POST method for /sentiment
resource "aws_api_gateway_method" "sentiment_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.sentiment.id
  http_method   = "POST"
  authorization = "NONE"
}

# GET method for /stock/{symbol}
resource "aws_api_gateway_resource" "stock_symbol" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  parent_id   = aws_api_gateway_resource.stock.id
  path_part   = "{symbol}"
}

resource "aws_api_gateway_method" "stock_get" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.stock_symbol.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.symbol" = true
  }
}

# POST method for /prediction
resource "aws_api_gateway_method" "prediction_post" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.prediction.id
  http_method   = "POST"
  authorization = "NONE"
}

# GET method for /health
resource "aws_api_gateway_method" "health_get" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.health.id
  http_method   = "GET"
  authorization = "NONE"
}

# OPTIONS methods for CORS
resource "aws_api_gateway_method" "sentiment_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.sentiment.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "stock_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.stock_symbol.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "prediction_options" {
  rest_api_id   = aws_api_gateway_rest_api.main.id
  resource_id   = aws_api_gateway_resource.prediction.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# Lambda integrations
resource "aws_api_gateway_integration" "sentiment_lambda" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.sentiment.id
  http_method = aws_api_gateway_method.sentiment_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.sentiment_analyzer.invoke_arn
}

resource "aws_api_gateway_integration" "stock_lambda" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.stock_symbol.id
  http_method = aws_api_gateway_method.stock_get.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.stock_data_fetcher.invoke_arn
}

resource "aws_api_gateway_integration" "prediction_lambda" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.prediction.id
  http_method = aws_api_gateway_method.prediction_post.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.prediction_engine.invoke_arn
}

# Mock integrations for OPTIONS methods (CORS)
resource "aws_api_gateway_integration" "sentiment_options_mock" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.sentiment.id
  http_method = aws_api_gateway_method.sentiment_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_integration" "stock_options_mock" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.stock_symbol.id
  http_method = aws_api_gateway_method.stock_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_integration" "prediction_options_mock" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.prediction.id
  http_method = aws_api_gateway_method.prediction_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# Health endpoint integration (mock for now)
resource "aws_api_gateway_integration" "health_mock" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.health.id
  http_method = aws_api_gateway_method.health_get.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# Method responses
resource "aws_api_gateway_method_response" "sentiment_post_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.sentiment.id
  http_method = aws_api_gateway_method.sentiment_post.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_method_response" "stock_get_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.stock_symbol.id
  http_method = aws_api_gateway_method.stock_get.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_method_response" "prediction_post_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.prediction.id
  http_method = aws_api_gateway_method.prediction_post.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

# OPTIONS method responses for CORS
resource "aws_api_gateway_method_response" "sentiment_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.sentiment.id
  http_method = aws_api_gateway_method.sentiment_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method_response" "stock_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.stock_symbol.id
  http_method = aws_api_gateway_method.stock_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_method_response" "prediction_options_200" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.prediction.id
  http_method = aws_api_gateway_method.prediction_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# Integration responses for OPTIONS methods
resource "aws_api_gateway_integration_response" "sentiment_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.sentiment.id
  http_method = aws_api_gateway_method.sentiment_options.http_method
  status_code = aws_api_gateway_method_response.sentiment_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.sentiment_options_mock]
}

resource "aws_api_gateway_integration_response" "stock_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.stock_symbol.id
  http_method = aws_api_gateway_method.stock_options.http_method
  status_code = aws_api_gateway_method_response.stock_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.stock_options_mock]
}

resource "aws_api_gateway_integration_response" "prediction_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.main.id
  resource_id = aws_api_gateway_resource.prediction.id
  http_method = aws_api_gateway_method.prediction_options.http_method
  status_code = aws_api_gateway_method_response.prediction_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_integration.prediction_options_mock]
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "main" {
  depends_on = [
    aws_api_gateway_integration.sentiment_lambda,
    aws_api_gateway_integration.stock_lambda,
    aws_api_gateway_integration.prediction_lambda,
    aws_api_gateway_integration.sentiment_options_mock,
    aws_api_gateway_integration.stock_options_mock,
    aws_api_gateway_integration.prediction_options_mock,
    aws_api_gateway_integration.health_mock,
    aws_api_gateway_method.sentiment_post,
    aws_api_gateway_method.stock_get,
    aws_api_gateway_method.prediction_post,
    aws_api_gateway_method.sentiment_options,
    aws_api_gateway_method.stock_options,
    aws_api_gateway_method.prediction_options,
    aws_api_gateway_method.health_get
  ]

  rest_api_id = aws_api_gateway_rest_api.main.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.sentiment.id,
      aws_api_gateway_resource.stock.id,
      aws_api_gateway_resource.prediction.id,
      aws_api_gateway_resource.health.id,
      aws_api_gateway_method.sentiment_post.id,
      aws_api_gateway_method.stock_get.id,
      aws_api_gateway_method.prediction_post.id,
      aws_api_gateway_method.health_get.id,
      aws_api_gateway_integration.sentiment_lambda.id,
      aws_api_gateway_integration.stock_lambda.id,
      aws_api_gateway_integration.prediction_lambda.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway stage
resource "aws_api_gateway_stage" "main" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id
  stage_name    = var.api_gateway_stage_name

  tags = merge(var.tags, {
    Name        = "${var.project_name}-api-stage-${var.environment}"
    Environment = var.environment
  })
}
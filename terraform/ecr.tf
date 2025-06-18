
# ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = var.app_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.app_name}-ecr"
  }
}

# ECR Lifecycle Policy
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# Build and push Docker image
resource "docker_image" "app" {
  name = "${aws_ecr_repository.app.repository_url}:latest"
  build {
    context    = var.docker_context_path  # "./frontend"
    dockerfile = "Dockerfile"
    platform   = "linux/amd64"
  }
  
  triggers = {
    # Rebuild when any file in the frontend context changes
    frontend_hash = sha1(join("", [for f in fileset(var.docker_context_path, "**") : filesha1("${var.docker_context_path}/${f}")]))
  }
}

resource "docker_registry_image" "app" {
  name = docker_image.app.name

  triggers = {
    image_id = docker_image.app.image_id
  }
}

# ECR Repository for Lambda (separate from frontend)
resource "aws_ecr_repository" "lambda_repo" {
  name                 = "${var.app_name}-lambda"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  tags = {
    Name = "${var.app_name}-lambda-ecr"
  }
}

# ECR Lifecycle Policy for Lambda
resource "aws_ecr_lifecycle_policy" "lambda_repo" {
  repository = aws_ecr_repository.lambda_repo.name
  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# Build and push Lambda Docker image
resource "docker_image" "lambda_image" {
  name = "${aws_ecr_repository.lambda_repo.repository_url}:latest"
  build {
    context    = "../backend/services"
    dockerfile = "Dockerfile"
    platform   = "linux/amd64"
  }
  
  triggers = {
    # This should rebuild when your code changes
    services_hash = sha1(join("", [
      for f in fileset("./backend/services", "*.py") : 
      filesha1("./backend/services/${f}")
    ]))
    requirements_hash = filesha1("./backend/services/requirements.txt")
    dockerfile_hash = filesha1("./backend/services/Dockerfile")
  }
}

resource "docker_registry_image" "lambda_image" {
  name = docker_image.lambda_image.name
  triggers = {
    image_id = docker_image.lambda_image.image_id
  }
}
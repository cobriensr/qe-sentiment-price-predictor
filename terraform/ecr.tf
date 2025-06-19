# ECR Repository for Frontend
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

# ECR Lifecycle Policy for Frontend
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

# Build and push Frontend Docker image
resource "docker_image" "app" {
  name = "${aws_ecr_repository.app.repository_url}:latest"
  build {
    context    = var.docker_context_path # "./frontend"
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

# ECR Repository for FMP Lambda
resource "aws_ecr_repository" "fmp_lambda_repo" {
  name                 = "${var.app_name}-fmp-lambda"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.app_name}-fmp-lambda-ecr"
  }
}

# ECR Lifecycle Policy for FMP Lambda
resource "aws_ecr_lifecycle_policy" "fmp_lambda_repo" {
  repository = aws_ecr_repository.fmp_lambda_repo.name
  
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

# Build and push FMP Lambda Docker image
resource "docker_image" "fmp_lambda_image" {
  name = "${aws_ecr_repository.fmp_lambda_repo.repository_url}:latest"
  build {
    context    = "../backend/services/fmp"
    dockerfile = "Dockerfile"
    platform   = "linux/amd64"
  }

  triggers = {
    # Rebuild when FMP service directory changes (simplified)
    fmp_context_hash = sha1(join("", [
      fileexists("../backend/services/fmp/Dockerfile") ? filesha1("../backend/services/fmp/Dockerfile") : "",
      fileexists("../backend/services/fmp/requirements.txt") ? filesha1("../backend/services/fmp/requirements.txt") : "",
      timestamp()  # Force rebuild on each apply for now
    ]))
  }
}

resource "docker_registry_image" "fmp_lambda_image" {
  name = docker_image.fmp_lambda_image.name
  triggers = {
    image_id = docker_image.fmp_lambda_image.image_id
  }
}

# ECR Repository for Alpha Vantage Lambda
resource "aws_ecr_repository" "alpha_vantage_lambda_repo" {
  name                 = "${var.app_name}-alpha-vantage-lambda"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.app_name}-alpha-vantage-lambda-ecr"
  }
}

# ECR Lifecycle Policy for Alpha Vantage Lambda
resource "aws_ecr_lifecycle_policy" "alpha_vantage_lambda_repo" {
  repository = aws_ecr_repository.alpha_vantage_lambda_repo.name
  
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

# Build and push Alpha Vantage Lambda Docker image
resource "docker_image" "alpha_vantage_lambda_image" {
  name = "${aws_ecr_repository.alpha_vantage_lambda_repo.repository_url}:latest"
  build {
    context    = "../backend/services/alpha_vantage"
    dockerfile = "Dockerfile"
    platform   = "linux/amd64"
  }

  triggers = {
    # Rebuild when Alpha Vantage service directory changes (simplified)
    alpha_vantage_context_hash = sha1(join("", [
      fileexists("../backend/services/alpha_vantage/Dockerfile") ? filesha1("../backend/services/alpha_vantage/Dockerfile") : "",
      fileexists("../backend/services/alpha_vantage/requirements.txt") ? filesha1("../backend/services/alpha_vantage/requirements.txt") : "",
      timestamp()  # Force rebuild on each apply for now
    ]))
  }
}

resource "docker_registry_image" "alpha_vantage_lambda_image" {
  name = docker_image.alpha_vantage_lambda_image.name
  triggers = {
    image_id = docker_image.alpha_vantage_lambda_image.image_id
  }
}
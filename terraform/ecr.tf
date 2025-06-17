
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
    context    = var.docker_context_path
    dockerfile = "Dockerfile"
    platform   = "linux/amd64"
  }

  triggers = {
    # Rebuild when any file in the context changes
    dir_sha1 = sha1(join("", [for f in fileset(var.docker_context_path, "**") : filesha1("${var.docker_context_path}/${f}")]))
  }
}

resource "docker_registry_image" "app" {
  name = docker_image.app.name

  triggers = {
    image_id = docker_image.app.image_id
  }
}
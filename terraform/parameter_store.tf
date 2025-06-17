# Store credentials in AWS Systems Manager Parameter Store
resource "aws_ssm_parameter" "github_actions_access_key_id" {
  name  = "/${var.project_name}/${var.environment}/github-actions/access-key-id"
  type  = "String"
  value = aws_iam_access_key.github_actions_deploy.id

  tags = merge(var.tags, {
    Name        = "${var.project_name}-github-actions-access-key-id-${var.environment}"
    Environment = var.environment
  })
}

resource "aws_ssm_parameter" "github_actions_secret_access_key" {
  name  = "/${var.project_name}/${var.environment}/github-actions/secret-access-key"
  type  = "SecureString"
  value = aws_iam_access_key.github_actions_deploy.secret

  tags = merge(var.tags, {
    Name        = "${var.project_name}-github-actions-secret-access-key-${var.environment}"
    Environment = var.environment
  })
}
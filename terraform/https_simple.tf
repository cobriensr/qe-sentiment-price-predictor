# Generate a private key
resource "tls_private_key" "app_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# Create a self-signed certificate
resource "tls_self_signed_cert" "app_cert" {
  private_key_pem = tls_private_key.app_key.private_key_pem

  subject {
    common_name  = aws_lb.main.dns_name
    organization = var.app_name
  }

  validity_period_hours = 8760 # 1 year

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

# Import certificate to ACM
resource "aws_acm_certificate" "app_cert" {
  private_key      = tls_private_key.app_key.private_key_pem
  certificate_body = tls_self_signed_cert.app_cert.cert_pem

  tags = {
    Name = "${var.app_name}-self-signed-cert"
  }
}

# HTTPS Listener
resource "aws_lb_listener" "app_https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.app_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Replace the existing HTTP listener with redirect
resource "aws_lb_listener" "app_http_redirect" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
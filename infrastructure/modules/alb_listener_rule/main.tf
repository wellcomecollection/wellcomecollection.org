resource "aws_alb_listener_rule" "https" {
  listener_arn = var.alb_listener_https_arn
  priority     = var.priority

  action {
    type             = "forward"
    target_group_arn = var.target_group_arn
  }

  condition {
    dynamic "path_pattern" {
      for_each = length(var.path_patterns) > 0 ? [""] : []
      content {
        values = var.path_patterns
      }
    }

    dynamic "host_header" {
      for_each = length(var.host_headers) > 0 ? [""] : []
      content {
        values = var.host_headers
      }
    }
  }

  condition {
    // Add a check for any of the values of the secret headers
    // This is used to allow the loadbalancer to check for secret 
    // headers from CloudFront. We accept multiple headers to allow
    // for secret rotation to take place safely.
    dynamic "http_header" {
      for_each = length(var.cloudfront_header_secrets) > 0 ? [""] : []
      content {
        http_header_name = "x-weco-cloudfront-shared-secret"
        values           = var.cloudfront_header_secrets
      }
    }
  }
}

resource "aws_alb_listener_rule" "http" {
  count = var.alb_listener_http_arn == "" ? 0 : 1

  listener_arn = var.alb_listener_http_arn
  priority     = var.priority

  action {
    type             = "forward"
    target_group_arn = var.target_group_arn
  }

  condition {
    dynamic "path_pattern" {
      for_each = length(var.path_patterns) > 0 ? [""] : []
      content {
        values = var.path_patterns
      }
    }

    dynamic "host_header" {
      for_each = length(var.host_headers) > 0 ? [""] : []
      content {
        values = var.host_headers
      }
    }
  }

  condition {
    // Add a check for any of the values of the secret headers
    // This is used to allow the loadbalancer to check for secret 
    // headers from CloudFront. We accept multiple headers to allow
    // for secret rotation to take place safely.
    dynamic "http_header" {
      for_each = length(var.cloudfront_header_secrets) > 0 ? [""] : []
      content {
        http_header_name = "x-weco-cloudfront-shared-secret"
        values           = var.cloudfront_header_secrets
      }
    }
  }
}

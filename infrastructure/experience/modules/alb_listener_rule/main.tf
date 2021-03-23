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
}

resource "aws_alb_listener_rule" "http" {
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
}

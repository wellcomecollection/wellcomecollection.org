resource "aws_wafv2_web_acl" "wc_org" {
  name        = "weco-cloudfront-acl-${var.namespace}"
  description = "Access control for the wellcomecollection.org CloudFront distributions"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "blanket-rate-limiting"
    priority = 1

    statement {
      rate_based_statement {
        // This number is based on us seeing significant performance degradation for
        // random (404ing) requests at about 8-10k transactions per minute. The number here
        // is for 5 minute windows.
        limit              = 5000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      sampled_requests_enabled   = false
      metric_name                = "weco-cloudfront-acl-rate-limit-${var.namespace}"
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    sampled_requests_enabled   = false
    metric_name                = "weco-cloudfront-acl-metric-${var.namespace}"
  }
}

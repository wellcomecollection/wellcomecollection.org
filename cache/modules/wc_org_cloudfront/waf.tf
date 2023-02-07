locals {
  // Rate limits cover 5 minute windows

  // We saw significant performance degradation for
  // random (404ing) requests at about 8-10k transactions per minute,
  // which led us to set this initially to 5000. We later saw non-random
  // requests (ie, to non-404ing) URLs that were causing the content application
  // to struggle at around 800tpm, leading us to halve that number.
  blanket_rate_limit = 2500

  // A more restrictive limit for expensive URLs (eg /works)
  restrictive_rate_limit  = 1000
  restricted_path_regexes = ["^\\/works$", "^\\/images$", "^\\/concepts$", "^\\/search$"]
}

resource "aws_wafv2_web_acl" "wc_org" {
  name        = "weco-cloudfront-acl-${var.namespace}"
  description = "Access control for the wellcomecollection.org CloudFront distributions"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "ip-allowlist"
    priority = 0

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.allowlist.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      sampled_requests_enabled   = false
      metric_name                = "weco-cloudfront-acl-allowlist-${var.namespace}"
    }
  }

  rule {
    name     = "managed-ip-blocking"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        // https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-ip-block-${var.namespace}"
    }
  }

  rule {
    name     = "blanket-rate-limiting"
    priority = 2

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = local.blanket_rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-rate-limit-${var.namespace}"
    }
  }

  rule {
    name     = "restrictive-rate-limiting"
    priority = 3

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = local.restrictive_rate_limit
        aggregate_key_type = "IP"

        scope_down_statement {
          regex_pattern_set_reference_statement {
            field_to_match {
              uri_path {}
            }

            arn = aws_wafv2_regex_pattern_set.restricted_urls.arn

            text_transformation {
              priority = 1
              type     = "URL_DECODE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-restrictive-rate-limit-${var.namespace}"
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    sampled_requests_enabled   = true
    metric_name                = "weco-cloudfront-acl-metric-${var.namespace}"
  }
}

resource "aws_wafv2_regex_pattern_set" "restricted_urls" {
  name  = "restricted-urls-${var.namespace}"
  scope = "CLOUDFRONT"

  dynamic "regular_expression" {
    for_each = local.restricted_path_regexes
    content {
      regex_string = regular_expression.value
    }
  }
}

resource "aws_wafv2_ip_set" "allowlist" {
  name        = "allowlist-${var.namespace}"
  description = "IPs that we do not apply managed WAF rules to"

  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  # These need to be CIDR blocks rather than plain addresses
  addresses = [for ip in var.waf_ip_allowlist : "${ip}/32"]
}

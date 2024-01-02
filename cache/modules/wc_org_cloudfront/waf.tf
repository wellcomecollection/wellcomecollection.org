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

  // These come from the information security team
  // Qualys is an "enterprise vulnerability management tool"
  // They get the list from the Qualys Cloud Portal
  qualys_scanner_ips = toset([
    "151.104.35.212",
    "151.104.35.215",
    "151.104.32.131",
    "151.104.32.115",
    "151.104.34.237",
    "151.104.34.255",
    "151.104.35.70",
    "151.104.33.138",
    "151.104.33.133",
    "151.104.35.241",
    "151.104.35.184",
    "151.104.33.225",
    "151.104.33.135",
    "151.104.34.102",
    "151.104.34.22",
    "151.104.34.6",
    "151.104.32.9",
  ])

  ip_allowlist = setunion(var.waf_ip_allowlist, local.qualys_scanner_ips)

  // See https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html
  // and comment below for the bot control rule
  bot_control_rule_allowlist = ["CategorySeo"]
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

  // See: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs
  rule {
    name     = "core-rule-group"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-core-${var.namespace}"
    }
  }

  // See: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-sql-db
  rule {
    name     = "sqli-rule-group"
    priority = 5

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-sqli-${var.namespace}"
    }
  }

  // See: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs
  rule {
    name     = "known-bad-inputs-rule-group"
    priority = 6

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-known-bad-inputs-${var.namespace}"
    }
  }

  rule {
    name     = "bot-control-rule-group"
    priority = 7

    // Because the Bot Control rules are quite aggressive, they block some useful bots
    // such as Updown. While we could add overrides for these, we don't want to have to
    // keep coming back here as we use different monitoring services, scripts, etc.
    // Instead, we're starting by defaulting to disabling rule actions and we only enable them
    // for a specified allowlist of rules.
    // Rules can be found here:
    // https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html
    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesBotControlRuleSet"
        vendor_name = "AWS"

        managed_rule_group_configs {
          aws_managed_rules_bot_control_rule_set {
            inspection_level = "COMMON"
          }
        }

        dynamic "rule_action_override" {
          for_each = local.bot_control_rule_allowlist
          content {
            name = rule_action_override.value
            action_to_use {
              count {}
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-bot-control-${var.namespace}"
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
  addresses = [for ip in local.ip_allowlist : "${ip}/32"]
}

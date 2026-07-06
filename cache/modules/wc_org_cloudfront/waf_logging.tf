# Request-level WAF logs, for forensics during incidents. The web ACL's
# sampled requests only retain a small sample for a few hours; these logs
# record every request the WAF acted on (we filter out plain allows to
# keep costs down).
#
# The log group name must begin with "aws-waf-logs-":
# https://docs.aws.amazon.com/waf/latest/developerguide/logging-cw-logs.html

resource "aws_cloudwatch_log_group" "waf" {
  count = var.enable_waf_logging ? 1 : 0

  name              = "aws-waf-logs-weco-${var.namespace}"
  retention_in_days = 30
}

resource "aws_wafv2_web_acl_logging_configuration" "wc_org" {
  count = var.enable_waf_logging ? 1 : 0

  resource_arn            = aws_wafv2_web_acl.wc_org.arn
  log_destination_configs = [aws_cloudwatch_log_group.waf[0].arn]

  logging_filter {
    default_behavior = "DROP"

    filter {
      behavior    = "KEEP"
      requirement = "MEETS_ANY"

      condition {
        action_condition {
          action = "BLOCK"
        }
      }
      condition {
        action_condition {
          action = "COUNT"
        }
      }
      condition {
        action_condition {
          action = "CAPTCHA"
        }
      }
      condition {
        action_condition {
          action = "CHALLENGE"
        }
      }
    }
  }
}

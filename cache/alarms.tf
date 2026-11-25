# CloudFront metrics live in us-east-1, which is this configuration's
# default region. The Chatbot topic renders the alarm in Slack.
resource "aws_cloudwatch_metric_alarm" "prod_cloudfront_5xx" {
  alarm_name          = "wc-org-prod-cloudfront-5xx-alarm"
  alarm_description   = "[component=${local.alarm_component} severity=high] wellcomecollection.org is serving over 2% 5xx responses"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 300
  statistic           = "Average"
  threshold           = 2
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = module.prod_wc_org_cloudfront_distribution.distribution_id
    Region         = "Global"
  }

  alarm_actions = [local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]]
  ok_actions    = [local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]]

  tags = merge(local.alarm_tags, { severity = "high" })
}

# Alert routing tags (wellcomecollection/docs adr/alert_routing.md). CloudFront
# and the WAF IP updaters serve the website, so they report as its Component.
locals {
  alarm_component = "content"

  alarm_tags = {
    "backplane:component"     = local.alarm_component
    "github.com/project-slug" = "wellcomecollection/wellcomecollection.org"
  }
}

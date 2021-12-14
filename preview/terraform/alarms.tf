locals {
  cloudfront_error_topic_arn = data.terraform_remote_state.monitoring.outputs.experience_cloudfront_alerts_topic_arn
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_preview_5xx" {
  alarm_name          = "cloudfront_preview.wc.org_error_5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 60
  threshold           = 0
  statistic           = "Average"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.preview.id
    Region         = "Global"
  }

  alarm_actions = [local.cloudfront_error_topic_arn]
}

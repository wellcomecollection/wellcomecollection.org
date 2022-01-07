locals {
  cloudfront_error_topic_arn = data.terraform_remote_state.monitoring.outputs.experience_cloudfront_alerts_topic_arn
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_prod_5xx" {
  alarm_name          = "cloudfront_wc.org_error_5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 60
  threshold           = 0
  statistic           = "Average"

  dimensions = {
    DistributionId = aws_cloudfront_distribution.wellcomecollection_org.id
    Region         = "Global"
  }

  alarm_actions = [local.cloudfront_error_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_stage_5xx" {
  alarm_name          = "cloudfront_stage.wc.org_error_5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 60
  threshold           = 0
  statistic           = "Average"

  dimensions = {
    DistributionId = module.stage_wc_org_cloudfront_distribution.distribution_id
    Region         = "Global"
  }

  alarm_actions = [local.cloudfront_error_topic_arn]
}

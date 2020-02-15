resource "aws_cloudwatch_metric_alarm" "alb_alarm" {
  count = var.enable_alarm ? 1 : 0

  alarm_name = var.name
  comparison_operator = var.comparison_operator
  evaluation_periods = "1"
  metric_name = var.metric
  namespace = "AWS/ApplicationELB"
  period = "60"
  statistic = "Sum"
  threshold = var.threshold
  treat_missing_data = var.treat_missing_data

  dimensions = {
    LoadBalancer = var.lb_dimension
    TargetGroup = var.tg_dimension
  }

  alarm_description = "This metric monitors ${var.name}"
  alarm_actions = [
    var.topic_arn]
}

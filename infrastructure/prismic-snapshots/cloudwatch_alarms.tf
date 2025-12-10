# CloudWatch Alarm for Lambda Errors
resource "aws_cloudwatch_metric_alarm" "prismic_snapshot_errors" {
  alarm_name          = "${local.lambda_snapshot_name}-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60" # 1 minute
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "This metric monitors errors for the Prismic snapshot Lambda function"
  alarm_actions       = [data.terraform_remote_state.platform_monitoring.outputs.chatbot_topic_arn]

  dimensions = {
    FunctionName = aws_lambda_function.prismic_snapshot.function_name
  }

  tags = {
    Name        = "Prismic Snapshot Error Alarm"
    Environment = "production"
    Purpose     = "monitoring"
  }
}

# CloudWatch Alarm for Lambda Duration (timeout warning)
resource "aws_cloudwatch_metric_alarm" "prismic_snapshot_duration" {
  alarm_name          = "${local.lambda_snapshot_name}-duration-warning"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = "3600" # 1 hour - more likely to capture the daily execution
  statistic           = "Maximum" # Use max since we only have one execution per period
  threshold           = "720000" # 12 minutes (warn before 15min timeout)
  alarm_description   = "This metric monitors duration for the Prismic snapshot Lambda function"
  treat_missing_data  = "notBreaching" # Don't alarm when no data (most of the time)
  alarm_actions       = [data.terraform_remote_state.platform_monitoring.outputs.chatbot_topic_arn]

  dimensions = {
    FunctionName = aws_lambda_function.prismic_snapshot.function_name
  }

  tags = {
    Name        = "Prismic Snapshot Duration Alarm"
    Environment = "production"
    Purpose     = "monitoring"
  }
}

# CloudWatch Alarm for Missing Invocations (scheduled job didn't run)
resource "aws_cloudwatch_metric_alarm" "prismic_snapshot_missing_invocations" {
  alarm_name          = "${local.lambda_snapshot_name}-missing-invocations"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Invocations"
  namespace           = "AWS/Lambda"
  period              = "86400" # 24 hours
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "This metric monitors if the Prismic snapshot Lambda function is being invoked daily"
  treat_missing_data  = "breaching"
  alarm_actions       = [data.terraform_remote_state.platform_monitoring.outputs.chatbot_topic_arn]

  dimensions = {
    FunctionName = aws_lambda_function.prismic_snapshot.function_name
  }

  tags = {
    Name        = "Prismic Snapshot Missing Invocations Alarm"
    Environment = "production"
    Purpose     = "monitoring"
  }
}
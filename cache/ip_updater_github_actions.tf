# Automated GitHub Actions IP Updater
# Fetches latest IP ranges from GitHub and updates the WAF IP set daily

# Lambda function to update GitHub Actions IPs
module "github_actions_ip_updater" {
  source = "./modules/lambda"

  name        = "github-actions-ip-updater"
  description = "Automatically updates GitHub Actions IP ranges in WAF from GitHub's /meta endpoint"
  handler     = "github-actions.handler"
  runtime     = "nodejs24.x"
  timeout     = 60
  memory_size = 256

  source_file           = "${path.module}/ip-updaters/github-actions.js"
  extra_source_files    = ["${path.module}/ip-updaters/helpers.js"]
  alarm_topic_arn       = local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]
  log_retention_in_days = 30

  environment_variables = {
    IP_SET_ID = aws_wafv2_ip_set.github_actions.id
  }
}

# Grant Lambda permission to read and update the WAF IP set
resource "aws_iam_role_policy" "github_actions_ip_updater_waf_access" {
  name = "waf-ipset-access"
  role = module.github_actions_ip_updater.role_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "wafv2:GetIPSet",
          "wafv2:UpdateIPSet"
        ]
        Resource = aws_wafv2_ip_set.github_actions.arn
      }
    ]
  })
}

# EventBridge rule to trigger Lambda daily at 3 AM UTC
resource "aws_cloudwatch_event_rule" "github_actions_ip_update_schedule" {
  name                = "github-actions-ip-update-daily"
  description         = "Trigger GitHub Actions IP update Lambda daily"
  schedule_expression = "cron(0 3 * * ? *)" # 3 AM UTC every day (1 hour after Google bot updater)
}

resource "aws_cloudwatch_event_target" "github_actions_ip_updater" {
  rule      = aws_cloudwatch_event_rule.github_actions_ip_update_schedule.name
  target_id = "GitHubActionsIPUpdater"
  arn       = module.github_actions_ip_updater.arn
}

resource "aws_lambda_permission" "allow_eventbridge_github_actions" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = module.github_actions_ip_updater.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.github_actions_ip_update_schedule.arn
}

# CloudWatch alarm for Lambda throttling
resource "aws_cloudwatch_metric_alarm" "github_actions_ip_updater_throttles" {
  alarm_name          = "lambda-github-actions-ip-updater-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"

  dimensions = {
    FunctionName = module.github_actions_ip_updater.function_name
  }

  alarm_description = "Alert when GitHub Actions IP updater Lambda is throttled"
  alarm_actions     = [local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]]
}

# CloudWatch alarm for validation failures (when IP change > 10%)
resource "aws_cloudwatch_log_metric_filter" "github_actions_ip_change_validation_failure" {
  name           = "github-actions-ip-validation-failure"
  log_group_name = "/aws/lambda/${module.github_actions_ip_updater.function_name}"
  pattern        = "\"IP content change of\" \"exceeds maximum allowed\""

  metric_transformation {
    name      = "ValidationFailures"
    namespace = "GitHubActionsIPUpdater"
    value     = "1"
  }

  depends_on = [module.github_actions_ip_updater]
}

resource "aws_cloudwatch_metric_alarm" "github_actions_ip_change_validation_failure" {
  alarm_name          = "lambda-github-actions-ip-validation-failure"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ValidationFailures"
  namespace           = "GitHubActionsIPUpdater"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  treat_missing_data  = "notBreaching"

  alarm_description = "Alert when GitHub Actions IP update fails validation (>10% change detected)"
  alarm_actions     = [local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]]
}

# Output for manual testing
output "github_actions_ip_updater_lambda_name" {
  value       = module.github_actions_ip_updater.function_name
  description = "Name of the Lambda function that updates GitHub Actions IPs"
}

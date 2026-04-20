# Automated Google Bot IP Updater
# Fetches latest IP ranges from Google and updates the WAF IP set daily

# Lambda function to update Google bot IPs
module "google_bot_ip_updater" {
  source = "./modules/lambda"

  name        = "google-bot-ip-updater"
  description = "Automatically updates Google bot IP ranges in WAF from Google's published lists"
  handler     = "update_google_bot_ips.handler"
  runtime     = "nodejs24.x"
  timeout     = 60
  memory_size = 256

  source_file           = "${path.module}/update_google_bot_ips.js"
  extra_source_files    = ["${path.module}/update_google_bot_ips.helpers.js"]
  log_retention_in_days = 30

  environment_variables = {
    IP_SET_ID = aws_wafv2_ip_set.google_bots.id
  }
}

# Grant Lambda permission to read and update the WAF IP set
resource "aws_iam_role_policy" "google_bot_ip_updater_waf_access" {
  name = "waf-ipset-access"
  role = module.google_bot_ip_updater.role_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "wafv2:GetIPSet",
          "wafv2:UpdateIPSet"
        ]
        Resource = aws_wafv2_ip_set.google_bots.arn
      }
    ]
  })
}

# EventBridge rule to trigger Lambda daily at 2 AM UTC
resource "aws_cloudwatch_event_rule" "google_bot_ip_update_schedule" {
  name                = "google-bot-ip-update-daily"
  description         = "Trigger Google bot IP update Lambda daily"
  schedule_expression = "cron(0 2 * * ? *)" # 2 AM UTC every day
}

resource "aws_cloudwatch_event_target" "google_bot_ip_updater" {
  rule      = aws_cloudwatch_event_rule.google_bot_ip_update_schedule.name
  target_id = "GoogleBotIPUpdater"
  arn       = module.google_bot_ip_updater.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = module.google_bot_ip_updater.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.google_bot_ip_update_schedule.arn
}

# CloudWatch alarm for Lambda throttling
resource "aws_cloudwatch_metric_alarm" "google_bot_ip_updater_throttles" {
  alarm_name          = "lambda-google-bot-ip-updater-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"

  dimensions = {
    FunctionName = module.google_bot_ip_updater.function_name
  }

  alarm_description = "Alert when Google bot IP updater Lambda is throttled"
}

# CloudWatch alarm for validation failures (when IP change > 10%)
# These will appear as Lambda errors and trigger the existing error alarm
resource "aws_cloudwatch_log_metric_filter" "ip_change_validation_failure" {
  name           = "google-bot-ip-validation-failure"
  log_group_name = "/aws/lambda/${module.google_bot_ip_updater.function_name}"
  pattern        = "\"IP content change of\" \"exceeds maximum allowed\""

  metric_transformation {
    name      = "ValidationFailures"
    namespace = "GoogleBotIPUpdater"
    value     = "1"
  }

  depends_on = [module.google_bot_ip_updater]
}

resource "aws_cloudwatch_metric_alarm" "ip_change_validation_failure" {
  alarm_name          = "google-bot-ip-validation-failure"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ValidationFailures"
  namespace           = "GoogleBotIPUpdater"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  treat_missing_data  = "notBreaching"

  alarm_description = "Alert when Google bot IP update fails validation (>10% change detected)"
}

# Output for manual testing
output "google_bot_ip_updater_lambda_name" {
  value       = module.google_bot_ip_updater.function_name
  description = "Name of the Lambda function that updates Google bot IPs"
}

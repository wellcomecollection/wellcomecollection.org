data "archive_file" "deployment_package" {
  type        = "zip"
  source_file = var.source_file
  output_path = "${var.source_file}.zip"
}

resource "aws_lambda_function" "lambda_function" {
  description   = var.description
  function_name = var.name

  filename         = data.archive_file.deployment_package.output_path
  source_code_hash = data.archive_file.deployment_package.output_base64sha256

  role    = aws_iam_role.iam_role.arn
  handler = var.handler
  runtime = var.runtime
  timeout = var.timeout

  memory_size = var.memory_size

  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }

  environment {
    variables = var.environment_variables
  }

  depends_on = [data.archive_file.deployment_package]
}

resource "aws_cloudwatch_metric_alarm" "lambda_alarm" {
  alarm_name          = "lambda-${var.name}-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"

  dimensions = {
    FunctionName = var.name
  }

  alarm_description = "This metric monitors lambda errors for function: ${var.name}"
  alarm_actions     = [var.alarm_topic_arn]
}

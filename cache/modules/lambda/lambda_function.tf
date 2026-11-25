data "archive_file" "deployment_package" {
  type        = "zip"
  output_path = "${var.source_file}.zip"

  source {
    content  = file(abspath(var.source_file))
    filename = basename(var.source_file)
  }

  dynamic "source" {
    for_each = var.extra_source_files
    content {
      content  = file(abspath(source.value))
      filename = basename(source.value)
    }
  }
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

  alarm_description = "${local.alarm_description_prefix}This metric monitors lambda errors for function: ${var.name}"
  alarm_actions     = [var.alarm_topic_arn]

  tags = local.alarm_tags
}

locals {
  // Same inputs as terraform-aws-lambda v1.3.0 (wellcomecollection/docs adr/alert_routing.md)
  alarm_tags = merge(
    var.alarm_tags,
    { severity = var.alarm_severity },
    var.alarm_component != null ? { "backplane:component" = var.alarm_component } : {},
    var.alarm_repository != null ? { "github.com/project-slug" = var.alarm_repository } : {},
  )

  alarm_description_prefix = var.alarm_component != null ? "[component=${var.alarm_component} severity=${var.alarm_severity}] " : ""
}

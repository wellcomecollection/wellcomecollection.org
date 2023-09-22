data "archive_file" "slack_alerts_for_5xx" {
  type        = "zip"
  source_file = "${path.module}/send_slack_alert_for_5xx_errors.js"
  output_path = "${path.module}/send_slack_alert_for_5xx_errors.js.zip"
}

module "slack_alerts_for_5xx_new" {
  source = "github.com/wellcomecollection/terraform-aws-lambda.git?ref=v1.2.0"

  name        = "send_slack_alert_for_5xx_errors"
  description = "Send alerts to Slack when there are 5xx alerts in the CloudFront logs"

  handler = "send_slack_alert_for_5xx_errors.handler"
  runtime = "nodejs16.x"

  filename         = data.archive_file.slack_alerts_for_5xx.output_path
  source_code_hash = data.archive_file.slack_alerts_for_5xx.output_base64sha256

  environment = {
    variables = {
      WEBHOOK_URL = local.slack_webhook_url
    }
  }

  dead_letter_config = {
    target_arn = aws_sqs_queue.send_slack_alert_for_5xx_errors_dlq.arn
  }

  error_alarm_topic_arn = data.terraform_remote_state.monitoring.outputs.experience_cloudfront_error_alerts_topic_arn

  # Note: we used to specify a 30 second timeout here, but occasionally
  # the Lambda would error if there were lots of log events.
  timeout = 300

  # For now we skip sending logs to Elasticsearch, just while we get it working
  # with the new module.
  forward_logs_to_elastic = false
}

resource "aws_sqs_queue" "send_slack_alert_for_5xx_errors_dlq" {
  name = "lambda-send_slack_alert_for_5xx_errors_dlq"
}

resource "aws_iam_role_policy" "send_slack_alert_for_5xx_errors_dlq" {
  name   = "${module.slack_alerts_for_5xx_new.lambda_role.name}_lambda_dlq"
  role   = module.slack_alerts_for_5xx_new.lambda_role.name
  policy = data.aws_iam_policy_document.send_slack_alert_for_5xx_errors_dlq.json
}

data "aws_iam_policy_document" "send_slack_alert_for_5xx_errors_dlq" {
  statement {
    actions = [
      "sqs:SendMessage",
    ]

    resources = [
      aws_sqs_queue.send_slack_alert_for_5xx_errors_dlq.arn,
    ]
  }
}

resource "aws_lambda_permission" "allow_lambda" {
  statement_id  = "AllowExecutionFromS3Bucket_${module.slack_alerts_for_5xx_new.lambda.function_name}"
  action        = "lambda:InvokeFunction"
  function_name = module.slack_alerts_for_5xx_new.lambda.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.cloudfront_logs.arn
}

resource "aws_iam_role_policy" "allow_s3_read" {
  role   = module.slack_alerts_for_5xx_new.lambda_role.name
  policy = data.aws_iam_policy_document.allow_s3_read.json
}

data "aws_iam_policy_document" "allow_s3_read" {
  statement {
    actions = [
      "s3:Get*",
      "s3:List*",
    ]

    resources = [
      aws_s3_bucket.cloudfront_logs.arn,
      "${aws_s3_bucket.cloudfront_logs.arn}/*",
    ]
  }
}

resource "aws_iam_role_policy" "allow_get_secrets" {
  role   = module.slack_alerts_for_5xx_new.lambda_role.name
  policy = data.aws_iam_policy_document.allow_get_secrets.json
}

data "aws_iam_policy_document" "allow_get_secrets" {
  statement {
    actions = [
      "secretsmanager:GetSecretValue",
    ]

    resources = [
      "arn:aws:secretsmanager:us-east-1:130871440101:secret:monitoring/critical_slack_webhook*",
    ]
  }
}

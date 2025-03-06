module "slack_alerts_for_5xx" {
  source = "./modules/lambda"

  source_file = "${path.module}/send_slack_alert_for_5xx_errors.js"
  handler     = "send_slack_alert_for_5xx_errors.handler"
  runtime     = "nodejs20.x"

  description = "Send alerts to Slack when there are 5xx alerts in the CloudFront logs"
  name        = "send_slack_alert_for_5xx_errors"

  environment_variables = {
    WEBHOOK_URL = local.slack_webhook_url
  }

  # TODO: We should be able to pull this from the monitoring remote state,
  # but I don't see it defined there.  Is this topic defined in Terraform?
  alarm_topic_arn = "arn:aws:sns:us-east-1:130871440101:experience_lambda_error_alarm"

  # Note: we used to specify a 30 second timeout here, but occasionally
  # the Lambda would error if there were lots of log events.
  timeout = 300
}

resource "aws_lambda_permission" "allow_lambda" {
  statement_id  = "AllowExecutionFromS3Bucket_${module.slack_alerts_for_5xx.function_name}"
  action        = "lambda:InvokeFunction"
  function_name = module.slack_alerts_for_5xx.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.cloudfront_logs.arn
}

resource "aws_iam_role_policy" "allow_s3_read" {
  role   = module.slack_alerts_for_5xx.role_name
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
  role   = module.slack_alerts_for_5xx.role_name
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

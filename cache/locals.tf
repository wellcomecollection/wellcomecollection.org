data "aws_secretsmanager_secret_version" "slack_webhook" {
  secret_id = "monitoring/critical_slack_webhook"
}

locals {
  edge_lambda_request_version  = 100
  edge_lambda_response_version = 101

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"

  slack_webhook_url = data.aws_secretsmanager_secret_version.slack_webhook.secret_string
}

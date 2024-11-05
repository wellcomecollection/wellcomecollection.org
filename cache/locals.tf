data "aws_secretsmanager_secret_version" "slack_webhook" {
  secret_id = "monitoring/critical_slack_webhook"
}

locals {
  edge_lambda_request_version  = 141
  edge_lambda_response_version = 139

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"

  slack_webhook_url = data.aws_secretsmanager_secret_version.slack_webhook.secret_string

  platform_account_infra = data.terraform_remote_state.platform_account.outputs
  ci_vpc_nat_elastic_ip  = local.platform_account_infra["ci_vpc_nat_elastic_ip"]

  # We exclude requests from the CI VPC's NAT gateway from our managed firewall rules
  # because AWS sometimes identifies them as bots, causing end-to-end tests to fail with 403s
  waf_ip_allowlist = [local.ci_vpc_nat_elastic_ip]
}

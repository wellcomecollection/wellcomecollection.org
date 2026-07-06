data "aws_secretsmanager_secret_version" "slack_webhook" {
  secret_id = "monitoring/critical_slack_webhook"
}

locals {
  edge_lambda_request_version  = 165
  edge_lambda_response_version = 163

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"

  slack_webhook_url = data.aws_secretsmanager_secret_version.slack_webhook.secret_string

  platform_account_infra = data.terraform_remote_state.platform_account.outputs
  monitoring_infra       = data.terraform_remote_state.monitoring.outputs
  ci_vpc_nat_elastic_ip  = local.platform_account_infra["ci_vpc_nat_elastic_ip"]

  # LogicMonitor SiteMonitor checkpoint IPs. Their checks hit /search URLs, so
  # they must not trip the rate limits or challenge rules there. NB the
  # ip-allowlist rule is a terminating ALLOW: these IPs skip every later rule.
  # LogicMonitor warn these IPs can change; the definitive list is at
  # https://www.logicmonitor.com/support/about-logicmonitor/overview/logicmonitor-public-ip-addresses-dns-names
  logicmonitor_ips = [
    "3.106.118.109",
    "3.106.118.110",
    "3.106.118.111",
    "18.139.118.201",
    "18.139.118.202",
    "18.139.118.203",
    "34.223.95.106",
    "34.223.95.107",
    "34.223.95.108",
    "52.202.255.79",
    "52.202.255.82",
    "52.202.255.87",
    "52.215.168.132",
    "52.215.168.133",
    "52.215.168.134",
  ]

  # We exclude requests from the CI VPC's NAT gateway from our managed firewall rules
  # because AWS sometimes identifies them as bots, causing end-to-end tests to fail with 403s
  waf_ip_allowlist = concat([local.ci_vpc_nat_elastic_ip], local.logicmonitor_ips)
}

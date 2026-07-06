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

  # LogicMonitor SiteMonitor synthetic checks run from these IPs and request
  # /search/works?query=botany and /search/images?query=skeletons (inherited from
  # the old updown checks) at a steady rate, so they must not trip the rate
  # limits or any future challenge rules on /search paths. NB the ip-allowlist
  # rule is a terminating ALLOW, so these IPs skip every WAF rule after
  # geo-restriction (blocklist, managed rules, etc), not just the rate limits.
  #
  # Verified against CloudFront logs (2026-07-05/06): all traffic from these IPs
  # carries the "LogicMonitor SiteMonitor/1.0" user agent and hits only the check
  # URLs, from LogicMonitor's five checkpoint regions. NB LogicMonitor warn that
  # checkpoint IPs can change and recommend identifying checks via a custom
  # header instead; if monitoring starts tripping the WAF, refresh this list
  # (or move to a custom-header allow rule configured in the LM portal).
  # The definitive list is at:
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

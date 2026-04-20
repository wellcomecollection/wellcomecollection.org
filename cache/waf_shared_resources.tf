# Shared WAF resources used across all environments (prod, stage, e2e)
# These resources must be defined at the root level to avoid conflicts

resource "aws_wafv2_ip_set" "google_bots" {
  name        = "google-bots"
  description = "Google bot IP ranges automatically updated from https://developers.google.com/static/crawling/ipranges/common-crawlers.json and https://developers.google.com/static/crawling/ipranges/special-crawlers.json"

  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  # Addresses are managed by the google-bot-ip-updater Lambda function
  # Initial empty list - Lambda will populate on first run
  addresses = []

  lifecycle {
    # Lambda manages the addresses field - don't let Terraform overwrite it
    ignore_changes = [addresses]
  }
}

# Shared WAF resources used across all environments (prod, stage, e2e)
# These resources must be defined at the root level to avoid conflicts

resource "aws_wafv2_ip_set" "google_bots" {
  name        = "google-bots"
  description = "Google bot IP ranges from https://developers.google.com/search/apis/ipranges/googlebot.json"

  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  # IPs are managed manually in the AWS WAF console
  # Shared across all environments (prod, stage, e2e)
  addresses = []

  # Prevent Terraform from overwriting manual updates
  lifecycle {
    ignore_changes = [addresses]
  }
}

locals {
  alb_origin_id    = "origin"
  assets_origin_id = "S3-${var.assets_origin.website_uri}"

  all_methods       = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  stateless_methods = ["HEAD", "GET", "OPTIONS"]

  # Use disabled caching for e2e environment to ensure tests always run against fresh content
  # This eliminates the need for CloudFront cache invalidation before test runs
  cache_policy_name = var.namespace == "e2e" ? "Managed-CachingDisabled" : "weco-apps"

  response_policy_name = var.enable_extra_security_headers ? "weco-security-v2" : "weco-security"

  lambda_associations = [
    {
      event_type = "origin-request"
      lambda_arn = var.lambda_arns.request
    },
    {
      event_type = "origin-response"
      lambda_arn = var.lambda_arns.response
    }
  ]
}

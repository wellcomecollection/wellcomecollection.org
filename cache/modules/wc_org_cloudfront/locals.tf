locals {
  alb_origin_id    = "origin"
  assets_origin_id = "S3-${var.assets_origin.website_uri}"

  all_methods       = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  stateless_methods = ["HEAD", "GET", "OPTIONS"]

  # Use disabled caching for e2e environment to ensure tests always run against fresh content
  # This eliminates the need for CloudFront cache invalidation before test runs
  cache_policy_name = var.namespace == "e2e" ? "Managed-CachingDisabled" : "weco-apps"

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

  # Beta test assignment (RFC 094), on the behaviours that serve pages
  function_associations = var.function_arns == null ? [] : [
    {
      event_type   = "viewer-request"
      function_arn = var.function_arns.request
    },
    {
      event_type   = "viewer-response"
      function_arn = var.function_arns.response
    }
  ]
}

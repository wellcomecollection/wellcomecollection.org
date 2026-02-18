locals {
  alb_origin_id         = "origin"
  assets_origin_id      = "S3-${var.assets_origin.website_uri}"
  env_assets_origin_id  = "S3-${var.assets_origin.website_uri}-${var.environment}"

  all_methods       = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  stateless_methods = ["HEAD", "GET", "OPTIONS"]

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

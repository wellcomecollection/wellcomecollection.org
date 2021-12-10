locals {
  edge_lambda_request_version  = 66
  edge_lambda_response_version = 67

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"

  one_minute = 60
  one_hour   = 60 * 60
  one_day    = 24 * local.one_hour
  one_year   = 365 * local.one_day
}

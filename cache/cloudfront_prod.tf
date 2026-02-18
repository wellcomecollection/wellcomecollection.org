module "prod_wc_org_cloudfront_distribution" {
  source = "./modules/wc_org_cloudfront"

  namespace = "prod"
  aliases = [
    "wellcomecollection.org",
    "content.wellcomecollection.org",
    "content.www.wellcomecollection.org",
    "identity.wellcomecollection.org",
    "identity.www.wellcomecollection.org",
    "works.wellcomecollection.org",
    "works.www.wellcomecollection.org",
  ]

  assets_origin = {
    bucket_endpoint = data.terraform_remote_state.assets.outputs.bucket_domain_name
    website_uri     = data.terraform_remote_state.assets.outputs.website_uri
  }
  load_balancer_dns = data.terraform_remote_state.experience.outputs.prod["alb_dns_name"]

  certificate_arn = local.wellcome_cdn_cert_arn
  lambda_arns = {
    request  = data.aws_lambda_function.versioned_edge_lambda_request.qualified_arn
    response = data.aws_lambda_function.versioned_edge_lambda_response.qualified_arn
  }

  cache_policies    = module.cloudfront_policies.cache_policies
  request_policies  = module.cloudfront_policies.request_policies
  response_policies = module.cloudfront_policies.response_policies
  waf_ip_allowlist  = local.waf_ip_allowlist

  header_shared_secret = local.current_shared_secret
  environment          = "prod"
}

data "aws_lambda_function" "versioned_edge_lambda_request" {
  function_name = "cf_edge_lambda_request"
  qualifier     = local.edge_lambda_request_version
}

data "aws_lambda_function" "versioned_edge_lambda_response" {
  function_name = "cf_edge_lambda_response"
  qualifier     = local.edge_lambda_response_version
}

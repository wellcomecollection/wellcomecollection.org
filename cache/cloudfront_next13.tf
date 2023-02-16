module "cloudfront" {
  source = "./modules/wc_org_cloudfront"

  namespace = "next13"
  aliases = [
    "next13.wellcomecollection.org",
    "content.next13.wellcomecollection.org",
    "works.next13.wellcomecollection.org",
    "identity.next13.wellcomecollection.org"
  ]

  assets_origin = {
    bucket_endpoint = data.terraform_remote_state.assets.outputs.bucket_domain_name
    website_uri     = data.terraform_remote_state.assets.outputs.website_uri
  }
  load_balancer_dns = "next13-903280153.eu-west-1.elb.amazonaws.com"

  certificate_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"
  lambda_arns = {
    request  = aws_lambda_function.edge_lambda_request.qualified_arn
    response = aws_lambda_function.edge_lambda_response.qualified_arn
  }

  cache_policies    = module.cloudfront_policies.cache_policies
  request_policies  = module.cloudfront_policies.request_policies
  response_policies = module.cloudfront_policies.response_policies
  waf_ip_allowlist  = local.waf_ip_allowlist
}

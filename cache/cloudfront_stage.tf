module "stage_wc_org_cloudfront_distribution" {
  source = "./modules/wc_org_cloudfront"

  namespace = "stage"
  aliases = [
    "www-stage.wellcomecollection.org",
    "content.www-stage.wellcomecollection.org",
    "works.www-stage.wellcomecollection.org",
    "identity.www-stage.wellcomecollection.org"
  ]

  assets_origin = {
    bucket_endpoint = data.terraform_remote_state.assets.outputs.bucket_domain_name
    website_uri     = data.terraform_remote_state.assets.outputs.website_uri
  }
  load_balancer_dns = data.terraform_remote_state.experience.outputs.stage_alb_dns

  certificate_arn = local.wellcome_cdn_cert_arn
  lambda_arns = {
    request  = aws_lambda_function.edge_lambda_request.qualified_arn
    response = aws_lambda_function.edge_lambda_response.qualified_arn
  }

  cache_policies    = module.cloudfront_policies.cache_policies
  request_policies  = module.cloudfront_policies.request_policies
  response_policies = module.cloudfront_policies.response_policies
}

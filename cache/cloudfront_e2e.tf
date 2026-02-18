module "e2e_cert" {
  source = "github.com/wellcomecollection/terraform-aws-acm-certificate?ref=v1.0.0"

  domain_name = "www-e2e.wellcomecollection.org"

  subject_alternative_names = [
    "content.www-e2e.wellcomecollection.org",
    "works.www-e2e.wellcomecollection.org",
    "identity.www-e2e.wellcomecollection.org",
    "*.www-e2e.wellcomecollection.org",
  ]

  zone_id = data.aws_route53_zone.zone.id

  # The `aws.dns` provider should be a provider with permission to modify
  # DNS records in the `zone_id` Hosted Zone.
  providers = {
    aws.dns = aws.dns
  }
}

module "e2e_wc_org_cloudfront_distribution" {
  source = "./modules/wc_org_cloudfront"

  namespace = "e2e"
  aliases = [
    "www-e2e.wellcomecollection.org",
    "content.www-e2e.wellcomecollection.org",
    "works.www-e2e.wellcomecollection.org",
    "identity.www-e2e.wellcomecollection.org"
  ]

  assets_origin = {
    bucket_endpoint = data.terraform_remote_state.assets.outputs.bucket_domain_name
    website_uri     = data.terraform_remote_state.assets.outputs.website_uri
  }
  load_balancer_dns = data.terraform_remote_state.experience.outputs.e2e["alb_dns_name"]

  certificate_arn = module.e2e_cert.arn

  lambda_arns = {
    request  = aws_lambda_function.edge_lambda_request.qualified_arn
    response = aws_lambda_function.edge_lambda_response.qualified_arn
  }

  cache_policies    = module.cloudfront_policies.cache_policies
  request_policies  = module.cloudfront_policies.request_policies
  response_policies = module.cloudfront_policies.response_policies
  waf_ip_allowlist  = local.waf_ip_allowlist

  header_shared_secret = local.current_shared_secret
  environment          = "e2e"
}

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
  load_balancer_dns = data.terraform_remote_state.experience.outputs.stage["alb_dns_name"]

  certificate_arn = local.wellcome_cdn_cert_arn
  lambda_arns = {
    request  = aws_lambda_function.edge_lambda_request.qualified_arn
    response = aws_lambda_function.edge_lambda_response.qualified_arn
  }

  cache_policies    = module.cloudfront_policies.cache_policies
  request_policies  = module.cloudfront_policies.request_policies
  response_policies = module.cloudfront_policies.response_policies
  waf_ip_allowlist  = local.waf_ip_allowlist
  /* We only need access where servers are running and we don't want to allow access from other countries as we have seen malicious traffic which disrupted staging. */
  allowed_countries = ["GB", "US", "IE"]

  google_bots_ip_set_arn    = aws_wafv2_ip_set.google_bots.arn
  github_actions_ip_set_arn = aws_wafv2_ip_set.github_actions.arn
  header_shared_secret      = local.current_shared_secret

  # Trialling the /search challenge here before prod (see the search-challenge
  # rule in the module for why this is high-risk).
  enable_search_challenge = true

  # Cuts billed challenge responses by blocking provably fabricated user
  # agents first. Matches prod.
  enable_search_legacy_ua_block = true

  # Real users get re-challenged (and billed) once per window instead of
  # every 5 minutes. Matches prod.
  search_challenge_immunity_seconds = 14400

  # Targeted Bot Control, scoped to /search with TGT_ rules counting only.
  # Matches prod.
  bot_control_inspection_level = "TARGETED"

  # Trialling the missing-Accept-Language block here before prod: real
  # browsers always send the header; the clients that omit it are crawlers
  # and bots that never solve the challenge they would otherwise be served.
  enable_search_missing_lang_block = true
}

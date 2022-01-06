resource "aws_cloudfront_distribution" "wc_org" {
  enabled          = true
  retain_on_delete = false
  is_ipv6_enabled  = true
  aliases          = var.aliases

  // The primary load balancer for wc.org apps
  origin {
    domain_name = var.load_balancer_dns
    origin_id   = local.alb_origin_id

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  // The S3 bucket containing some static assets
  origin {
    domain_name = var.assets_origin.bucket_endpoint
    origin_id   = local.assets_origin_id
  }

  # Don't cache 404s
  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 0
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  logging_config {
    include_cookies = false
    bucket          = "wellcomecollection-experience-cloudfront-logs.s3.amazonaws.com"
    prefix          = var.logging_prefix
  }


  # The default cache behaviour is to forward requests to the content app
  default_cache_behavior {
    target_origin_id = local.alb_origin_id

    allowed_methods             = local.all_methods
    cached_methods              = local.stateless_methods
    lambda_function_association = local.lambda_associations
    viewer_protocol_policy      = "redirect-to-https"

    cache_policy_id          = module.content_cache_policy.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_query_strings.id
  }

  # Works
  ordered_cache_behavior {
    path_pattern     = "/works*"
    target_origin_id = local.alb_origin_id

    allowed_methods             = local.stateless_methods
    cached_methods              = local.stateless_methods
    lambda_function_association = local.lambda_associations
    viewer_protocol_policy      = "redirect-to-https"

    cache_policy_id          = module.works_cache_policy.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_query_strings.id
  }

  # Account
  ordered_cache_behavior {
    path_pattern     = "/account*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.all_methods
    cached_methods         = []
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id          = aws_cloudfront_cache_policy.no_cache.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_all.id
  }

  # Images
  ordered_cache_behavior {
    path_pattern     = "/images*"
    target_origin_id = local.alb_origin_id

    allowed_methods             = local.stateless_methods
    cached_methods              = local.stateless_methods
    lambda_function_association = local.lambda_associations
    viewer_protocol_policy      = "redirect-to-https"

    cache_policy_id          = module.images_cache_policy.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_query_strings.id
  }

  # This is for the data fetching routes used in NextJs's getServerSideProps
  # see: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  ordered_cache_behavior {
    path_pattern     = "/_next/data/*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id          = module.toggles_only_policy.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_query_strings.id
  }

  # Static next routes
  ordered_cache_behavior {
    path_pattern     = "/_next/*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id = module.static_cache_policy.id
  }

  # Events
  ordered_cache_behavior {
    path_pattern     = "/events*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id          = module.events_cache_policy.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.forward_query_strings.id
  }

  ordered_cache_behavior {
    path_pattern     = "/humans.txt"
    target_origin_id = local.assets_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id = module.static_cache_policy.id
  }

  ordered_cache_behavior {
    path_pattern     = "/robots.txt"
    target_origin_id = local.assets_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id = module.static_cache_policy.id
  }
}


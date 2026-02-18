resource "aws_cloudfront_distribution" "wc_org" {
  enabled          = true
  retain_on_delete = false
  is_ipv6_enabled  = true
  aliases          = var.aliases

  web_acl_id = aws_wafv2_web_acl.wc_org.arn

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

    # // We need to send the backend token to the load balancer so that it can
    # // authenticate requests to the backend.
    custom_header {
      name  = "x-weco-cloudfront-shared-secret"
      value = var.header_shared_secret
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
    prefix          = "wellcomecollection.org/${var.namespace}/"
  }


  # The default cache behaviour is to forward requests to the content app
  default_cache_behavior {
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.all_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["weco-apps"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }
  }

  # Works
  ordered_cache_behavior {
    path_pattern     = "/works*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["weco-apps"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }
  }

  # Account
  ordered_cache_behavior {
    path_pattern     = "/account*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.all_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    // Caching should be always be disabled for the account/identity app, so that we
    // never send responses meant for one user to another
    cache_policy_id            = var.cache_policies["Managed-CachingDisabled"]
    origin_request_policy_id   = var.request_policies["Managed-AllViewer"]
    response_headers_policy_id = var.response_policies["weco-security"]

    # Note: we deliberately omit the Lambda function association here; this avoids the
    # Edge Lambdas having access to access tokens or other potentially sensitive information.
    #
    # We could revisit this decision at some point -- it's possible to do this securely,
    # but since we don't expect to have many redirects under the `/account` prefix it
    # was easier to bypass the Lambdas for now.
  }

  # Images
  ordered_cache_behavior {
    path_pattern     = "/images*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["weco-apps"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }
  }

  # Concepts
  ordered_cache_behavior {
    path_pattern     = "/concepts*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["weco-apps"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }
  }

  # Search
  ordered_cache_behavior {
    path_pattern     = "/search*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["weco-apps"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }
  }

  # This is for the data fetching routes used in NextJs's getServerSideProps
  # see: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
  ordered_cache_behavior {
    path_pattern     = "/_next/data/*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    # Props on pages are liable to change and so it's safest to respect all query params here
    cache_policy_id            = var.cache_policies["weco-apps-all-params"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]
  }

  # Static next routes
  ordered_cache_behavior {
    path_pattern     = "/_next/*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["static-content"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]
  }

  # Events
  ordered_cache_behavior {
    path_pattern     = "/events*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }

    cache_policy_id            = var.cache_policies["weco-apps"]
    origin_request_policy_id   = var.request_policies["host-query-and-toggles"]
    response_headers_policy_id = var.response_policies["weco-security"]
  }

  ordered_cache_behavior {
    path_pattern     = "/slice-simulator*"
    target_origin_id = local.alb_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id          = var.cache_policies["weco-apps"]
    origin_request_policy_id = var.request_policies["host-query-and-toggles"]

    // We can't apply the security headers policy to Slice Machine routes, as
    // it breaks the Slice Machine preview.

    dynamic "lambda_function_association" {
      for_each = local.lambda_associations
      content {
        event_type = lambda_function_association.value.event_type
        lambda_arn = lambda_function_association.value.lambda_arn
      }
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/humans.txt"
    target_origin_id = local.assets_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["static-content"]
    response_headers_policy_id = var.response_policies["weco-security"]
  }

  ordered_cache_behavior {
    # Serve environment-specific robots.txt (e.g., /robots-prod.txt, /robots-stage.txt)
    path_pattern     = "/robots-${var.environment}.txt"
    target_origin_id = local.assets_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["static-content"]
    response_headers_policy_id = var.response_policies["weco-security"]
  }

  # This is used to verify that we own the domain in
  # the Google Search Console.
  #
  # See https://wellcome.slack.com/archives/C3TQSF63C/p1655464291878209
  ordered_cache_behavior {
    path_pattern     = "/googlea25c86e91ccc343b.html"
    target_origin_id = local.assets_origin_id

    allowed_methods        = local.stateless_methods
    cached_methods         = local.stateless_methods
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = var.cache_policies["static-content"]
    response_headers_policy_id = var.response_policies["weco-security"]
  }
}


resource "aws_cloudfront_distribution" "stage_wc_org" {
  origin {
    domain_name = data.terraform_remote_state.experience.outputs.stage_alb_dns
    origin_id   = local.default_origin_id

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = local.assets_s3_website_endpoint
    origin_id   = local.assets_origin_id
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = [
    "www-stage.wellcomecollection.org",
    "content.www-stage.wellcomecollection.org",
    "works.www-stage.wellcomecollection.org",
  ]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = local.default_origin_id
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      headers      = ["Host"]
      query_string = true

      query_string_cache_keys = [
        "current",
        "page",
        "result",
        "uri",
      ]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles",  # feature toggles
          "toggle_*", # feature toggles
        ]
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = data.aws_lambda_function.versioned_edge_lambda_request.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = data.aws_lambda_function.versioned_edge_lambda_response.qualified_arn
    }
  }

  # Works
  ordered_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = local.default_origin_id
    path_pattern           = "/works*"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      headers      = ["Host"]
      query_string = true

      query_string_cache_keys = [
        "_queryType",
        "canvas",
        "current",
        "items.locations.locationType",
        "page",
        "query",
        "sierraId",
        "workType",
      ]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles",  # feature toggles
          "toggle_*", # feature toggles
          "WC_auth_redirect",
          "_queryType",
        ]
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = data.aws_lambda_function.versioned_edge_lambda_request.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = data.aws_lambda_function.versioned_edge_lambda_response.qualified_arn
    }
  }

  ordered_cache_behavior {
    target_origin_id       = local.default_origin_id
    path_pattern           = "/_next/*"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 86400
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      headers      = ["Host"]
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = local.default_origin_id
    path_pattern           = "/events/*"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 60

    forwarded_values {
      headers      = ["Host"]
      query_string = true

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles", # feature toggles
        ]
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = local.assets_origin_id
    path_pattern           = "/humans.txt"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 86400
    default_ttl            = 86400
    max_ttl                = 3153600

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = local.assets_origin_id
    path_pattern           = "/robots.txt"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 86400
    default_ttl            = 86400
    max_ttl                = 3153600

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = local.wellcome_cdn_cert_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2018"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  retain_on_delete = true
}


# Create the CloudFront distribution
resource "aws_cloudfront_distribution" "devcache_wellcomecollection_org" {
  origin {
    domain_name = data.terraform_remote_state.router.outputs.alb_dns_name
    origin_id   = "origin"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = [
    "devcache.wellcomecollection.org",
  ]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "origin"
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
          "WC_auth_redirect",
        ]
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.edge_lambda_request.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.edge_lambda_response.qualified_arn
    }
  }

  ordered_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "origin"
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
          "_queryType",
        ]
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.edge_lambda_request.qualified_arn
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = aws_lambda_function.edge_lambda_response.qualified_arn
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


data "aws_lambda_function" "versioned_edge_lambda_request" {
  function_name = "cf_edge_lambda_request"
  qualifier     = "${local.edge_lambda_request_version}"
}

data "aws_lambda_function" "versioned_edge_lambda_response" {
  function_name = "cf_edge_lambda_response"
  qualifier     = "${local.edge_lambda_response_version}"
}

# Create the CloudFront distribution
resource "aws_cloudfront_distribution" "wellcomecollection_org" {
  origin {
    domain_name = "${data.terraform_remote_state.router.alb_dns_name}"
    origin_id   = "origin"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = [
    "wellcomecollection.org",
    "next.wellcomecollection.org",
    "blog.wellcomecollection.org",
    "works.wellcomecollection.org",
    "content.wellcomecollection.org",
    "whats-on.wellcomecollection.org",
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
        "page",
        "current",
        "uri",

        # dotmailer gives us a 'result' (if we run out of params,
        # consider making new urls for newsletter pages instead)
        "result",
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
      lambda_arn = "${data.aws_lambda_function.versioned_edge_lambda_request.arn}"
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = "${data.aws_lambda_function.versioned_edge_lambda_response.arn}"
    }
  }

  # Works
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
        "page",
        "current",
        "query",
        "workType",
        "sierraId",
        "canvas",
        "items.locations.locationType",
        "_queryType",
      ]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles",          # feature toggles
          "toggle_*",         # feature toggles
          "WC_auth_redirect",
        ]
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = "${data.aws_lambda_function.versioned_edge_lambda_request.arn}"
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = "${data.aws_lambda_function.versioned_edge_lambda_response.arn}"
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "origin"
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
    target_origin_id       = "origin"
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

  viewer_certificate {
    acm_certificate_arn      = "${data.aws_acm_certificate.wellcomecollection_ssl_cert.arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  retain_on_delete = true
}

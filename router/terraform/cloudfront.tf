data "aws_acm_certificate" "wellcomecollection_ssl_cert" {
  provider = "aws.us-east-1"
  domain   = "wellcomecollection.org"
}

resource "aws_cloudfront_distribution" "wellcomecollection_org" {
  origin {
    domain_name = "${module.router_alb.dns_name}"
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

  # We can't use *.wellcomecollection.org here as we use other subdomains
  # elsewhere which would obviously conflict
  aliases = [
    "wellcomecollection.org",
    "next.wellcomecollection.org",
    "blog.wellcomecollection.org",
    "works.wellcomecollection.org",
    "content.wellcomecollection.org",
    "whats-on.wellcomecollection.org",
    "wellcomeimages.org",
    "*.wellcomeimages.org"
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
        "toggles",   # feature toggles
        "page",
        "current",
        "query",
        "uri",
        "startDate",
        "endDate",
        "MIROPAC",   # Wellcome Images redirect
        "MIRO",      # Wellcome Images redirect

        # dotmailer gives us a 'result' (if we run out of params,
        # consider making new urls for newsletter pages instead)
        "result",
      ]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles",           # feature toggles
        ]
      }
    }
  }

  # Make sure that the next assets always outlive the HTML
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

      query_string_cache_keys = [
        "toggles",   # feature toggles
      ]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles",           # feature toggles
        ]
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "origin"
    path_pattern           = "/eventbrite/*"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "origin"
    path_pattern           = "/preview"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "origin"
    path_pattern           = "/management/*"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }
  }

  ordered_cache_behavior {
    target_origin_id       = "origin"
    path_pattern           = "/ab_testing*"
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = "${aws_lambda_function.ab_testing_lambda.qualified_arn}"
    }

    forwarded_values {
      query_string = false
      headers      = ["Host"]

      cookies {
        forward = "none"
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

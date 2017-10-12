data "aws_acm_certificate" "wellcomecollection_ssl_cert" {
  provider = "aws.us-east-1"
  domain   = "wellcomecollection.org"
}

resource "aws_cloudfront_distribution" "wellcomecollection_org" {
  origin {
    domain_name = "${module.router_alb.dns_name}"
    origin_id   = "${module.router_alb.id}"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = ["dev.wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "${module.router_alb.id}"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      headers                 = ["Host"]
      query_string            = true
      query_string_cache_keys = ["page", "current", "q", "format", "query", "cohort", "uri"]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "WC_wpAuthToken",
          "WC_featuresCohort",
          "*SESS*",

          # A/B tests
          "WC_graphicdesign",
        ]
      }
    }
  }

  # TODO: Deprecate
  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/articles/preview/*"
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/preview/*"
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/flags"
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
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

  # This is all for Drupal...
  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/system/ajax"
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/admin/*"
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/user"
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
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

  cache_behavior {
    target_origin_id       = "${module.router_alb.id}"
    path_pattern           = "/node/*"
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
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

  # End Drupal...

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

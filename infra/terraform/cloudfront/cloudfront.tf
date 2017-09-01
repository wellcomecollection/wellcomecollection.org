variable "wellcomecollection_ssl_cert_arn" {}
variable "website_uri" {}
variable "dns_name" {}
variable "alb_id" {}

resource "aws_cloudfront_distribution" "cardigan" {
  origin {
    domain_name = "cardigan.wellcomecollection.org.s3.amazonaws.com"
    origin_id   = "S3-cardigan.wellcomecollection.org"
  }

  enabled             = true
  default_root_object = "index.html"
  is_ipv6_enabled     = true

  aliases = ["cardigan.wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "S3-cardigan.wellcomecollection.org"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "${var.wellcomecollection_ssl_cert_arn}"
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

resource "aws_cloudfront_distribution" "next" {
  origin {
    domain_name = "${var.dns_name}"
    origin_id   = "${var.alb_id}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = ["${var.website_uri}", "wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "${var.alb_id}"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      headers                 = ["Host", "HTTP_X_FORWARDED_PROTO"]
      query_string            = true
      query_string_cache_keys = ["page", "current", "q", "format", "query", "cohort", "uri"]

      cookies {
        forward           = "whitelist"
        whitelisted_names = ["WC_wpAuthToken", "WC_featuresCohort"]
      }
    }
  }

  # TODO: Deprecate
  cache_behavior {
    target_origin_id       = "${var.alb_id}"
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
    target_origin_id       = "${var.alb_id}"
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
    target_origin_id       = "${var.alb_id}"
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
    target_origin_id       = "${var.alb_id}"
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

  viewer_certificate {
    acm_certificate_arn      = "${var.wellcomecollection_ssl_cert_arn}"
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

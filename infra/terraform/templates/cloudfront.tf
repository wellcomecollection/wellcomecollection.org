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
}

resource "aws_cloudfront_distribution" "next" {
  origin {
    domain_name = "${aws_alb.wellcomecollection_alb.dns_name}"
    origin_id   = "${aws_alb.wellcomecollection_alb.id}"
  }

  enabled             = true
  default_root_object = "/"
  is_ipv6_enabled     = true

  aliases = ["next.wellcomecollection.org", "wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "${aws_alb.wellcomecollection_alb.id}"
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
}

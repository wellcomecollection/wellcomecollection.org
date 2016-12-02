data "aws_acm_certificate" "star_wellcomecollection_org" {
  domain = "*.wellcomecollection.org"
  statuses = ["ISSUED"]
}

resource "aws_cloudfront_distribution" "cardigan" {
  origin {
    domain_name = "cardigan.wellcomecollection.org.s3.amazonaws.com"
    origin_id   = "S3-cardigan.wellcomecollection.org"
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = ["cardigan.wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["GET"]
    cached_methods         = ["GET"]
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
    acm_certificate_arn = "${data.aws_acm_certificate.star_wellcomecollection_org.arn}"
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

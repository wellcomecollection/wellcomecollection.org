data "aws_acm_certificate" "wellcomecollection_ssl_cert" {
  provider = "aws.us-east-1"
  domain   = "wellcomecollection.org"
}

# This is a cache that essentially does nothing, but gives us a shield against our origin ALB
resource "aws_cloudfront_distribution" "preview" {
  origin {
    domain_name = "${local.alb_dns_name}"
    origin_id   = "${local.alb_id}"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true

  aliases = ["preview.wellcomecollection.org"]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "${local.alb_id}"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
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

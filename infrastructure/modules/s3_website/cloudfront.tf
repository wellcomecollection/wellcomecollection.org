locals {
  s3_origin_id = "S3-${var.website_uri}"
}

resource "aws_cloudfront_distribution" "https_s3_website" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.website_bucket.website_endpoint
    origin_id   = local.s3_origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"
  is_ipv6_enabled     = true
  aliases             = [var.website_uri]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = local.s3_origin_id
    compress               = true
    min_ttl                = var.min_ttl
    default_ttl            = var.default_ttl
    max_ttl                = var.max_ttl

    forwarded_values {
      query_string = false

      # this is to respect CORS
      # see: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html#header-caching-web-cors
      headers = [
        "Origin",
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
      ]

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
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

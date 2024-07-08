// This file provisions infrastructure for the RSS CloudFront distribution, 
// it routes requests to the content service at /rss. 
//
// https://rss.wellcomecollection.org/stories -> https://wellcomecollection.org/rss
// 
// This service has been migrated to CloudFront to allow for stats to be
// gathered on usage. There is no staging environment for this service.
resource "aws_cloudfront_distribution" "rss_wc_org" {
  enabled          = true
  retain_on_delete = false
  is_ipv6_enabled  = true
  aliases          = [
    "rss.wellcomecollection.org",
  ]

  origin {
    domain_name = data.terraform_remote_state.experience.outputs.prod["alb_dns_name"]
    origin_id   = "origin"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "x-weco-cloudfront-shared-secret"
      value = local.current_shared_secret
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

  logging_config {
    include_cookies = false
    bucket          = "wellcomecollection-experience-cloudfront-logs.s3.amazonaws.com"
    prefix          = "rss.wellcomecollection.org/"
  }

  default_cache_behavior {
    target_origin_id = "origin"

    allowed_methods        = ["HEAD", "GET"]
    cached_methods         = ["HEAD", "GET"]
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id            = module.cloudfront_policies.cache_policies["weco-apps"]
    origin_request_policy_id   = module.cloudfront_policies.request_policies["host-query-and-toggles"]
    response_headers_policy_id = module.cloudfront_policies.response_policies["weco-security"]

    function_association {
      event_type = "viewer-request"
      function_arn = aws_cloudfront_function.rss_stories_url_rewrite.arn
    }
  }
}

resource "aws_cloudfront_function" "rss_stories_url_rewrite" {
  name    = "rss-stories-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrites /stories to /rss for rss.wellcomecollection.org"
  publish = true
  code    = file("${path.module}/cloudfront_functions/rss-url-rewrite.js")
}
locals {
  one_minute = 60
  one_hour   = 60 * local.one_minute
  one_day    = 24 * local.one_hour
  one_year   = 365 * local.one_day

  max_ttl = {
    dynamic = local.one_day
    static  = local.one_year
    live    = 0
  }
  default_ttl = {
    dynamic = local.one_hour
    static  = local.one_day
    live    = 0
  }
}

resource "aws_cloudfront_cache_policy" "default" {
  name    = "weco-default-${var.name}"
  comment = "A default wc.org caching policy with specific query strings and cookies"

  min_ttl     = 0
  max_ttl     = local.max_ttl[var.ttl_policy]
  default_ttl = local.default_ttl[var.ttl_policy]

  parameters_in_cache_key_and_forwarded_to_origin {
    query_strings_config {
      query_string_behavior = "whitelist"

      query_strings {
        items = sort(var.query_string_whitelist)
      }
    }

    cookies_config {
      cookie_behavior = "whitelist"

      cookies {
        items = sort(var.cookie_whitelist)
      }
    }

    headers_config {
      header_behavior = "whitelist"

      headers {
        items = ["Host"]
      }
    }
  }
}

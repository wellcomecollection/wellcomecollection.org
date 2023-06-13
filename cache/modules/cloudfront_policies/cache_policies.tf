resource "aws_cloudfront_cache_policy" "static_content" {
  name    = "static-content"
  comment = "Longer-lived cache for static content"

  min_ttl     = 0
  default_ttl = local.one_day
  max_ttl     = local.one_year

  parameters_in_cache_key_and_forwarded_to_origin {
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-policy-compressed-objects
    // This needs to be here as, despite what the AWS docs say, adding Accept-Encoding
    // to the headers whitelist in a request policy fails with the grammatically questionable error:
    //
    //   The parameter Headers contains Accept-Encoding that is not allowed.
    //
    enable_accept_encoding_gzip = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "weco_apps" {
  name    = "weco-apps"
  comment = "A general-purpose policy for the wc.org apps, including all their usual query strings"

  min_ttl     = 0
  default_ttl = local.one_hour
  max_ttl     = local.one_day

  parameters_in_cache_key_and_forwarded_to_origin {
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-policy-compressed-objects
    // This needs to be here as, despite what the AWS docs say, adding Accept-Encoding
    // to the headers whitelist in a request policy fails with the grammatically questionable error:
    //
    //   The parameter Headers contains Accept-Encoding that is not allowed.
    //
    enable_accept_encoding_gzip = true

    cookies_config {
      cookie_behavior = "whitelist"

      cookies {
        items = sort(
          distinct(
            concat(
              local.toggles_cookies,
              local.userpreference_cookies,
              local.ga_cookies,
            )
          )
        )
      }
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "whitelist"

      query_strings {
        items = sort(
          distinct(
            concat(
              local.content_query_params,
              local.works_query_params,
              local.images_query_params
            )
          )
        )
      }
    }
  }
}

resource "aws_cloudfront_cache_policy" "short_lived_toggles_only" {
  name    = "short-lived-toggles-only"
  comment = "A short-lived cache policy which whitelists toggles"

  min_ttl     = 0
  default_ttl = local.one_minute
  max_ttl     = local.one_minute

  parameters_in_cache_key_and_forwarded_to_origin {
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html#cache-policy-compressed-objects
    // This needs to be here as, despite what the AWS docs say, adding Accept-Encoding
    // to the headers whitelist in a request policy fails with the grammatically questionable error:
    //
    //   The parameter Headers contains Accept-Encoding that is not allowed.
    //
    enable_accept_encoding_gzip = true

    cookies_config {
      cookie_behavior = "whitelist"

      cookies {
        items = local.toggles_cookies
      }
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

data "aws_cloudfront_cache_policy" "managed_caching_disabled" {
  name = "Managed-CachingDisabled"
}

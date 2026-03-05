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
  comment = "A general-purpose policy for the wc.org apps"

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
            )
          )
        )
      }
    }

    headers_config {
      header_behavior = "whitelist"

      headers {
        items = ["Host"]
      }
    }

    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

resource "aws_cloudfront_cache_policy" "weco_apps_all_params" {
  name    = "weco-apps-all-params"
  comment = "A general-purpose policy for the wc.org apps, using all/any query strings as cache keys"

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
            )
          )
        )
      }
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "all"
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

resource "aws_cloudfront_cache_policy" "weco_apps_e2e" {
  name    = "weco-apps-e2e"
  comment = "Minimal caching for e2e environment to ensure tests always run against fresh content"

  // Minimal TTLs to ensure e2e tests always get fresh content
  // - default_ttl = 0 means no caching by default
  // - max_ttl = 1 minute allows brief caching only if the origin explicitly sets Cache-Control headers
  // This eliminates the need for CloudFront cache invalidation before test runs
  min_ttl     = 0
  default_ttl = 0
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

      // Include toggles and user preference cookies in the cache key so that:
      // - Tests with different feature flags get different (correct) responses
      // - Tests with different user preferences are handled separately
      // This matches the production cache policy to ensure e2e tests behave consistently
      cookies {
        items = sort(
          distinct(
            concat(
              local.toggles_cookies,
              local.userpreference_cookies,
            )
          )
        )
      }
    }

    headers_config {
      header_behavior = "whitelist"

      // Include Host header so requests to different subdomains
      // (e.g., www-e2e vs works.www-e2e) are cached separately
      headers {
        items = ["Host"]
      }
    }

    query_strings_config {
      // Include all query strings in the cache key
      // This ensures different search/filter parameters get different responses
      query_string_behavior = "all"
    }
  }
}

data "aws_cloudfront_cache_policy" "managed_caching_disabled" {
  name = "Managed-CachingDisabled"
}

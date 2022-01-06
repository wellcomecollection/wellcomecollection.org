locals {
  toggles_cookies = ["toggles", "toggle_*"]

  one_minute = 60
  one_hour   = 60 * local.one_minute
  one_day    = 24 * local.one_hour
}

module "toggles_only_policy" {
  source = "../default_cache_policy"

  name       = "toggles-only-${var.namespace}"
  ttl_policy = "dynamic"

  cookie_whitelist = local.toggles_cookies
}

module "content_cache_policy" {
  source = "../default_cache_policy"

  name       = "content-${var.namespace}"
  ttl_policy = "dynamic"

  cookie_whitelist = local.toggles_cookies
  query_string_whitelist = [
    "cachebust",
    "current",
    "page",
    "result",
    "toggle",
    "uri",

    # This is used to fetch articles client-side, e.g. related stories.
    # When it's missing, we may show the wrong stories as "read this next"
    # on articles.
    #
    # See https://github.com/wellcomecollection/wellcomecollection.org/issues
    "params"
  ]
}

module "works_cache_policy" {
  source = "../default_cache_policy"

  name       = "works-${var.namespace}"
  ttl_policy = "dynamic"

  cookie_whitelist = concat(local.toggles_cookies, ["_queryType"])
  query_string_whitelist = [
    "_queryType",
    "availabilities",
    "canvas",
    "current",
    "genres.label",
    "items.locations.locationType",
    "languages",
    "manifest",
    "page",
    "query",
    "source",
    "subjects.label",
    "contributors.agent.label",
    "toggle",
    "cachebust",
    "workType",
  ]
}

module "images_cache_policy" {
  source = "../default_cache_policy"

  name       = "images-${var.namespace}"
  ttl_policy = "dynamic"

  cookie_whitelist = concat(local.toggles_cookies, ["_queryType"])
  query_string_whitelist = [
    "cachebust",
    "color",
    "locations.license",
    "page",
    "query",
    "source",
    "source.contributors.agent.label",
    "source.genres.label",
    "toggle",
  ]
}

module "static_cache_policy" {
  source = "../default_cache_policy"

  name       = "static-${var.namespace}"
  ttl_policy = "static"
}

module "events_cache_policy" {
  source = "../default_cache_policy"

  name       = "events-${var.namespace}"
  ttl_policy = "live"

  cookie_whitelist = local.toggles_cookies
}

resource "aws_cloudfront_cache_policy" "no_cache" {
  name    = "no-cache"
  comment = "Disables all caching"

  min_ttl     = 0
  max_ttl     = 0
  default_ttl = 0

  parameters_in_cache_key_and_forwarded_to_origin {
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

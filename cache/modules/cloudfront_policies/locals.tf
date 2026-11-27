locals {
  toggles_cookies        = ["toggles", "toggle_*", "starred_toggles"]
  userpreference_cookies = ["WC_*", "CookieControl"] // CookieControl is Civic UK (our Consent Management Platform)'s cookie that stores user preferences
  // The beta test cookies (beta_tests, beta_bucket) are left out, because the request function turns them into toggle_ cookies before the cache

  one_minute = 60
  one_hour   = 60 * local.one_minute
  one_day    = 24 * local.one_hour
  one_year   = 365 * local.one_day
}

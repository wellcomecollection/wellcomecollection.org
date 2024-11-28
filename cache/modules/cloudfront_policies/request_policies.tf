resource "aws_cloudfront_origin_request_policy" "host_query_and_toggles" {
  name    = "host-query-and-toggles"
  comment = "Forwards all query strings"

  query_strings_config {
    query_string_behavior = "all"
  }

  cookies_config {
    cookie_behavior = "whitelist"

    cookies {
      items = sort(
        concat(
          local.toggles_cookies,
          local.userpreference_cookies,
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
}

data "aws_cloudfront_origin_request_policy" "managed_all_viewer" {
  name = "Managed-AllViewer"
}

resource "aws_cloudfront_origin_request_policy" "forward_all" {
  name    = "forward-all"
  comment = "Forwards all headers, query strings and cookies"

  cookies_config {
    cookie_behavior = "all"
  }

  headers_config {
    header_behavior = "allViewerAndWhitelistCloudFront"
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_origin_request_policy" "forward_query_strings" {
  name    = "forward-query-strings"
  comment = "Forwards all query strings"

  query_strings_config {
    query_string_behavior = "all"
  }

  cookies_config {
    cookie_behavior = ""
  }

  headers_config {

  }
}

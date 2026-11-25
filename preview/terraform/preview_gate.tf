resource "aws_cloudfront_function" "preview_gate" {
  name    = "preview-gate"
  runtime = "cloudfront-js-1.0"
  comment = "Redirects non-preview requests on preview.wellcomecollection.org to the main site"
  publish = true
  code    = file("${path.module}/cloudfront_functions/preview-gate.js")
}

resource "aws_cloudfront_response_headers_policy" "preview_noindex" {
  name    = "preview-noindex"
  comment = "Keeps preview.wellcomecollection.org out of search indexes"

  custom_headers_config {
    items {
      header   = "X-Robots-Tag"
      value    = "noindex"
      override = true
    }
  }
}

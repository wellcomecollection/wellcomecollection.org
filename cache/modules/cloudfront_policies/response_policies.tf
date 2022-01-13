resource "aws_cloudfront_response_headers_policy" "weco_security" {
  name    = "weco-security"
  comment = "Security headers for wellcomecollection.org"

  security_headers_config {
    strict_transport_security {
      // TODO slowly increase this to > 1 year as per
      // https://github.com/wellcomecollection/wellcomecollection.org/issues/7348
      access_control_max_age_sec = 7 * local.one_day
      include_subdomains         = false
      override                   = true
      preload                    = false
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }
  }
}

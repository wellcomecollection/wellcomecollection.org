resource "aws_cloudfront_response_headers_policy" "weco_security" {
  name    = "weco-security"
  comment = "Security headers for wellcomecollection.org"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 2 * local.one_year
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

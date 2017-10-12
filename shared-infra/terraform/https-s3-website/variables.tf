variable "website_uri" {
  description = "The URI that people will get to your bucket from."
}

variable "acm_certificate_arn" {
  description = "The arn of the certificate for the Cloudfront distribution. Must be in us-east-1."
}

module "static" {
  source              = "../../infrastructure/modules/s3_website"
  website_uri         = "toggles.wellcomecollection.org"
  acm_certificate_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"
}

module "wellcomecollection_cert" {
  source = "../modules/certificate"

  domain_name = "wellcomecollection.org"

  zone_id = data.aws_route53_zone.zone.id

  providers = {
    aws.dns = aws.dns
  }

  subject_alternative_names = [
    "www.wellcomecollection.org",
    "*.wellcomecollection.org",
    "*.www.wellcomecollection.org",
    "*.www-stage.wellcomecollection.org",
    "www-stage.wellcomecollection.org"
  ]
}

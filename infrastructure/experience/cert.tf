module "wellcomecollection_cert" {
  source = "github.com/wellcomecollection/terraform-aws-acm-certificate?ref=v1.0.0"

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

module "wellcomecollection_e2e_cert" {
  source = "github.com/wellcomecollection/terraform-aws-acm-certificate?ref=v1.0.0"

  domain_name = "www-e2e.wellcomecollection.org"

  zone_id = data.aws_route53_zone.zone.id

  providers = {
    aws.dns = aws.dns
  }

  subject_alternative_names = [
    "*.www-e2e.wellcomecollection.org",
  ]
}

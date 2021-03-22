resource "aws_route53_record" "prod" {
  provider = aws.dns

  name    = "account-admin.wellcomecollection.org"
  type    = "CNAME"
  records = [module.prod.alb_dns_name]

  zone_id = data.aws_route53_zone.zone.id

  ttl = 60
}

resource "aws_route53_record" "stage" {
  provider = aws.dns

  name    = "account-admin-stage.wellcomecollection.org"
  type    = "CNAME"
  records = [module.stage.alb_dns_name]

  zone_id = data.aws_route53_zone.zone.id

  ttl = 60
}

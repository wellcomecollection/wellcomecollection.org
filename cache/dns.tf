locals {
  cname_records = {
    "www-e2e.wellcomecollection.org"          = module.e2e_wc_org_cloudfront_distribution.domain_name
    "works.www-e2e.wellcomecollection.org"    = module.e2e_wc_org_cloudfront_distribution.domain_name
    "content.www-e2e.wellcomecollection.org"  = module.e2e_wc_org_cloudfront_distribution.domain_name
    "identity.www-e2e.wellcomecollection.org" = module.e2e_wc_org_cloudfront_distribution.domain_name

  }
}

data "aws_route53_zone" "zone" {
  provider = aws.dns

  name = "wellcomecollection.org."
}

resource "aws_route53_record" "cname" {
  for_each = local.cname_records

  zone_id = data.aws_route53_zone.zone.id
  name    = each.key
  type    = "CNAME"
  records = [each.value]
  ttl     = 60

  provider = aws.dns
}

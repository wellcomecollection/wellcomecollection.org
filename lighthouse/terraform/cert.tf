module "lighthouse_cert" {
  source = "../../infrastructure/modules/certificate"

  domain_name = local.lhci_origin
  zone_id     = local.hosted_zone_id

  providers = {
    aws.dns = aws.dns
  }
}

resource "aws_route53_record" "certificate_validation" {
  provider = aws.dns
  for_each = {
    for dvo in module.lighthouse_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = local.hosted_zone_id

  name    = each.value.name
  records = [each.value.record]
  type    = each.value.type

  allow_overwrite = true
  ttl             = 60
}

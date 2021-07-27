resource "aws_route53_record" "lighthouse" {
  provider = aws.dns

  name    = local.lhci_origin
  zone_id = local.hosted_zone_id
  type    = "A"

  alias {
    name                   = module.alb.dns_name
    zone_id                = module.alb.zone_id
    evaluate_target_health = true
  }
}

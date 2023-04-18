module "lighthouse_cert" {
  source = "github.com/wellcomecollection/terraform-aws-acm-certificate?ref=v1.0.0"

  domain_name = local.lhci_origin
  zone_id     = local.hosted_zone_id

  providers = {
    aws.dns = aws.dns
  }
}

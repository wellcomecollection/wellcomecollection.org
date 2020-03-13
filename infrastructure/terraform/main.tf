module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = local.wc_org_cert_arn
}

module "stage" {
  source = "./stack"

  namespace = "stage"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = local.wc_org_cert_arn
}

module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id   = local.identity_vpc_id
  subnets  = local.identity_public_subnets
  cert_arn = module.wellcomecollection_cert_identity.arn
}

module "stage" {
  source = "./stack"

  namespace = "stage"

  vpc_id   = local.identity_vpc_id
  subnets  = local.identity_public_subnets
  cert_arn = module.wellcomecollection_cert_identity.arn
}

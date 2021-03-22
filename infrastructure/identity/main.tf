module "identity_prod" {
  source = "./stack"

  namespace = "fe-prod"

  vpc_id   = local.identity_vpc_id
  subnets  = local.identity_public_subnets
  cert_arn = module.wellcomecollection_cert_identity.arn
}

module "identity_stage" {
  source = "./stack"

  namespace = "fe-stage"

  vpc_id   = local.identity_vpc_id
  subnets  = local.identity_public_subnets
  cert_arn = module.wellcomecollection_cert_identity.arn
}

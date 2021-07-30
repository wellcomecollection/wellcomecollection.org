module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id   = local.prod_identity_vpc_id
  subnets  = local.prod_identity_public_subnets
  cert_arn = module.wellcomecollection_cert_identity.arn
}

module "stage" {
  source = "./stack"

  namespace = "stage"

  vpc_id   = local.stage_identity_vpc_id
  subnets  = local.stage_identity_public_subnets
  cert_arn = module.wellcomecollection_cert_identity.arn

  providers = {
    aws = aws.stage
  }
}

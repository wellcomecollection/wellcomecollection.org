module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = module.wellcomecollection_cert.arn
}

module "stage" {
  source = "./stack"

  namespace = "stage"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = module.wellcomecollection_cert.arn
}

module "e2e" {
  source = "./stack"

  namespace = "e2e"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = module.wellcomecollection_e2e_cert.arn
}

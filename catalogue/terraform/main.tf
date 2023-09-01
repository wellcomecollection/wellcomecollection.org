// The service should be available at: "works.www.wellcomecollection.org/works"

module "catalogue-prod" {
  source = "./stack"

  container_image = local.prod_app_image
  env_suffix      = "prod"

  environment = data.terraform_remote_state.experience_shared.outputs.prod

  subdomain = "works.www"
}

// The service should be available at: "works.www-stage.wellcomecollection.org/works"

module "catalogue-stage" {
  source = "./stack"

  container_image = local.stage_app_image
  env_suffix      = "stage"

  environment = data.terraform_remote_state.experience_shared.outputs.stage

  subdomain = "works.www-stage"

  use_fargate_spot              = true
  turn_off_outside_office_hours = true

  providers = {
    aws = aws.stage
  }
}


// The service should be available at: "works.www-e2e.wellcomecollection.org/works"

/*module "catalogue-e2e" {
  source = "./stack-new"

  container_image = local.e2e_app_image
  env_suffix      = "e2e"

  environment = data.terraform_remote_state.experience_shared.outputs.e2e

  subdomain = "works.www-e2e"

  use_fargate_spot              = true

  providers = {
    aws = aws.stage
  }
}*/

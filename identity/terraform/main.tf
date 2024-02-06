// The service should be available at: "https://identity.www.wellcomecollection.org"

module "identity-prod" {
  source = "./stack"

  container_image = local.prod_app_image
  env_suffix      = "prod"

  environment = data.terraform_remote_state.experience_shared.outputs.prod
  cloudfront_header_secrets = local.cloudfront_header_secrets

  env_vars = merge(
    local.service_env["prod"]["env_vars"],
    { SITE_BASE_URL = "https://wellcomecollection.org" }
  )
  secret_env_vars = local.service_env["prod"]["secret_env_vars"]

  subdomain = "identity.www"
}

// The service should be available at: "https://identity.www-stage.wellcomecollection.org"

module "identity-stage" {
  source = "./stack"

  container_image = local.stage_app_image
  env_suffix      = "stage"

  environment = data.terraform_remote_state.experience_shared.outputs.stage
  cloudfront_header_secrets = local.cloudfront_header_secrets

  env_vars = merge(
    local.service_env["stage"]["env_vars"],
    { SITE_BASE_URL = "https://www-stage.wellcomecollection.org" }
  )
  secret_env_vars = local.service_env["stage"]["secret_env_vars"]

  subdomain = "identity.www-stage"

  use_fargate_spot              = true
  turn_off_outside_office_hours = true

  providers = {
    aws = aws.stage
  }
}


// The service should be available at: "https://identity.www-e2e.wellcomecollection.org"

module "identity-e2e" {
  source = "./stack"

  container_image = local.e2e_app_image
  env_suffix      = "e2e"

  environment = data.terraform_remote_state.experience_shared.outputs.e2e
  cloudfront_header_secrets = local.cloudfront_header_secrets

  env_vars = merge(
    local.service_env["stage"]["env_vars"],
    { SITE_BASE_URL = "https://www-e2e.wellcomecollection.org" }
  )
  secret_env_vars = local.service_env["stage"]["secret_env_vars"]

  subdomain = "identity.www-e2e"

  use_fargate_spot = true

  providers = {
    aws = aws.stage
  }
}

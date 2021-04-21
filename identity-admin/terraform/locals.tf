locals {
  prod_cluster_arn  = data.terraform_remote_state.identity-experience_shared.outputs.prod_cluster_arn
  prod_namespace_id = data.terraform_remote_state.identity-experience_shared.outputs.prod_namespace_id

  prod_alb_listener_http_arn  = data.terraform_remote_state.identity-experience_shared.outputs.prod_alb_listener_http_arn
  prod_alb_listener_https_arn = data.terraform_remote_state.identity-experience_shared.outputs.prod_alb_listener_https_arn

  prod_interservice_security_group_id   = data.terraform_remote_state.identity-experience_shared.outputs.prod_interservice_security_group_id
  prod_service_egress_security_group_id = data.terraform_remote_state.identity-experience_shared.outputs.prod_service_egress_security_group_id

  stage_cluster_arn  = data.terraform_remote_state.identity-experience_shared.outputs.stage_cluster_arn
  stage_namespace_id = data.terraform_remote_state.identity-experience_shared.outputs.stage_namespace_id

  stage_alb_listener_http_arn  = data.terraform_remote_state.identity-experience_shared.outputs.stage_alb_listener_http_arn
  stage_alb_listener_https_arn = data.terraform_remote_state.identity-experience_shared.outputs.stage_alb_listener_https_arn

  stage_interservice_security_group_id   = data.terraform_remote_state.identity-experience_shared.outputs.stage_interservice_security_group_id
  stage_service_egress_security_group_id = data.terraform_remote_state.identity-experience_shared.outputs.stage_service_egress_security_group_id

  stage_app_image = "${data.terraform_remote_state.identity-experience_shared.outputs.identity-admin_webapp_ecr_uri}:env.stage"
  prod_app_image  = "${data.terraform_remote_state.identity-experience_shared.outputs.identity-admin_webapp_ecr_uri}:env.prod"

  nginx_image = "760097843905.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/nginx_experience:78090f62ee23a39a1b4e929f25417bfa128c2aa8"

  vpc_id          = data.terraform_remote_state.infra_shared.outputs.identity_vpc_id
  private_subnets = data.terraform_remote_state.infra_shared.outputs.identity_vpc_private_subnets
  public_subnets  = data.terraform_remote_state.infra_shared.outputs.identity_vpc_public_subnets

  service_env_names = ["stage", "prod"]

  service_env = {for env_name in local.service_env_names : env_name => {
    env_vars = {
      AUTH0_CLIENT_ID       = data.aws_ssm_parameter.auth0_client_id[env_name].value
      API_BASE_URL          = data.aws_ssm_parameter.api_base_url[env_name].value
      AUTH0_BASE_URL        = "https://${data.aws_ssm_parameter.auth0_base_url[env_name].value}"
      AUTH0_ISSUER_BASE_URL = "https://${data.aws_ssm_parameter.auth0_domain[env_name].value}"
    }

    secret_env_vars = {
      AUTH0_SECRET        = aws_secretsmanager_secret.auth0_secret[env_name].name
      AUTH0_CLIENT_SECRET = "identity/${env_name}/account_admin_system/auth0_client_secret"
      API_KEY             = "identity/${env_name}/account_admin_system/api_key"
    }
  }}

  auth0_base_url_param_name = data.terraform_remote_state.identity-experience_shared.outputs.identity_admin_base_url_param_name
}

data "aws_ssm_parameter" "auth0_client_id"{
  for_each = toset(local.service_env_names)

  name = "/identity/stage/account_admin_system/auth0_client_id"
}

data "aws_ssm_parameter" "api_base_url"{
  for_each = toset(local.service_env_names)
  name     = "/identity/${each.key}/account_admin_system/api_base_url"
}

data "aws_ssm_parameter" "auth0_base_url"{
  for_each = toset(local.service_env_names)
  name     = local.auth0_base_url_param_name[each.key]
}

data "aws_ssm_parameter" "auth0_domain"{
  for_each = toset(local.service_env_names)
  name     = "/identity/${each.key}/account_admin_system/auth0_domain"

}

// Generate AUTH0_SECRET

resource "aws_secretsmanager_secret" "auth0_secret" {
  for_each = toset(local.service_env_names)
  name     = "identity/${each.key}/account_admin_system/auth0_secret"
}

resource "aws_secretsmanager_secret_version" "auth0_secret" {
  for_each = toset(local.service_env_names)

  secret_id     = aws_secretsmanager_secret.auth0_secret[each.key].id
  secret_string = random_password.auth0_secret[each.key].result
}

resource "random_password" "auth0_secret" {
  for_each = toset(local.service_env_names)

  special  = true
  length   = 32
}

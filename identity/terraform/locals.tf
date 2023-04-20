locals {
  prod_cluster_arn  = data.terraform_remote_state.experience_shared.outputs.prod_cluster_arn
  prod_namespace_id = data.terraform_remote_state.experience_shared.outputs.prod_namespace_id

  prod_alb_listener_http_arn  = data.terraform_remote_state.experience_shared.outputs.prod_alb_listener_http_arn
  prod_alb_listener_https_arn = data.terraform_remote_state.experience_shared.outputs.prod_alb_listener_https_arn

  prod_interservice_security_group_id   = data.terraform_remote_state.experience_shared.outputs.prod_interservice_security_group_id
  prod_service_egress_security_group_id = data.terraform_remote_state.experience_shared.outputs.prod_service_egress_security_group_id

  stage_cluster_arn  = data.terraform_remote_state.experience_shared.outputs.stage_cluster_arn
  stage_namespace_id = data.terraform_remote_state.experience_shared.outputs.stage_namespace_id

  stage_alb_listener_http_arn  = data.terraform_remote_state.experience_shared.outputs.stage_alb_listener_http_arn
  stage_alb_listener_https_arn = data.terraform_remote_state.experience_shared.outputs.stage_alb_listener_https_arn

  stage_interservice_security_group_id   = data.terraform_remote_state.experience_shared.outputs.stage_interservice_security_group_id
  stage_service_egress_security_group_id = data.terraform_remote_state.experience_shared.outputs.stage_service_egress_security_group_id

  stage_app_image = "${data.terraform_remote_state.experience_shared.outputs.identity_webapp_ecr_uri}:env.stage"
  prod_app_image  = "${data.terraform_remote_state.experience_shared.outputs.identity_webapp_ecr_uri}:env.prod"

  nginx_image = "760097843905.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/nginx_experience:78090f62ee23a39a1b4e929f25417bfa128c2aa8"

  service_env_names = ["stage", "prod"]

  service_env = { for env_name in local.service_env_names : env_name => {
    env_vars = {
      AUTH0_DOMAIN      = data.aws_ssm_parameter.auth0_domain[env_name].value
      AUTH0_CLIENT_ID   = data.aws_ssm_parameter.auth0_client_id[env_name].value
      IDENTITY_API_HOST = data.aws_ssm_parameter.api_host[env_name].value
    }

    secret_env_vars = {
      AUTH0_CLIENT_SECRET = "identity/${env_name}/identity_web_app/auth0_client_secret"
      IDENTITY_API_KEY    = "identity/${env_name}/identity_web_app/api_key"
      SESSION_KEYS        = "identity/${env_name}/identity_web_app/session_keys"
      APM_SERVER_URL      = "elasticsearch/logging/apm_server_url"
      APM_SECRET          = "elasticsearch/logging/apm_secret"
      AUTH0_ACTION_SECRET = "identity/${env_name}/redirect_action_secret"
    }
  } }
}

resource "aws_secretsmanager_secret" "session_keys" {
  for_each = toset(local.service_env_names)

  name = "identity/${each.key}/identity_web_app/session_keys"
}

resource "aws_secretsmanager_secret_version" "session_keys" {
  for_each = toset(local.service_env_names)

  secret_id     = aws_secretsmanager_secret.session_keys[each.key].id
  secret_string = random_password.session_keys[each.key].result
}

resource "random_password" "session_keys" {
  for_each = toset(local.service_env_names)

  length = 16
  keepers = {
    "env_name" : each.key,
  }
}

data "aws_ssm_parameter" "auth0_domain" {
  for_each = toset(local.service_env_names)

  name = "/identity/${each.key}/identity_web_app/auth0_domain"
}

data "aws_ssm_parameter" "auth0_client_id" {
  for_each = toset(local.service_env_names)

  name = "/identity/${each.key}/identity_web_app/auth0_client_id"
}

data "aws_ssm_parameter" "logout_redirect_url" {
  for_each = toset(local.service_env_names)

  name = "/identity/${each.key}/identity_web_app/logout_redirect_url"
}

data "aws_ssm_parameter" "api_host" {
  for_each = toset(local.service_env_names)

  name = "/identity/${each.key}/identity_web_app/api_base_url"
}
locals {
  e2e_app_image   = "${data.terraform_remote_state.experience_shared.outputs.buildkite_ecr_uri}:identity-env.e2e"
  stage_app_image = "${data.terraform_remote_state.experience_shared.outputs.identity_webapp_ecr_uri}:env.stage"
  prod_app_image  = "${data.terraform_remote_state.experience_shared.outputs.identity_webapp_ecr_uri}:env.prod"

  service_env_names = ["stage", "prod"]

  service_env = { for env_name in local.service_env_names : env_name => {
    env_vars = {
      AUTH0_DOMAIN      = data.aws_ssm_parameter.auth0_domain[env_name].value
      AUTH0_CLIENT_ID   = data.aws_ssm_parameter.auth0_client_id[env_name].value
      IDENTITY_API_HOST = data.aws_ssm_parameter.api_host[env_name].value
    }

    secret_env_vars = {
      AUTH0_CLIENT_SECRET = "identity/${env_name}/identity_web_app/auth0_client_secret"
      AUTH0_SECRET        = "identity/${env_name}/identity_web_app/auth0_secret"
      IDENTITY_API_KEY    = "identity/${env_name}/identity_web_app/api_key"
      SESSION_KEYS        = "identity/${env_name}/identity_web_app/session_keys"
      APM_SERVER_URL      = "elasticsearch/logging/apm_server_url"
      APM_SECRET          = "elasticsearch/logging/apm_secret"
      AUTH0_ACTION_SECRET = "identity/${env_name}/redirect_action_secret"
    }
  } }

  cloudfront_header_secrets = data.terraform_remote_state.cache.outputs.cloudfront_header_shared_secrets
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

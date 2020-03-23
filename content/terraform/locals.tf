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

  // Latest is available at data.aws_ssm_parameter.nginx_image_uri.value - test in staging before deployment
  nginx_image = "760097843905.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/nginx_experience:78090f62ee23a39a1b4e929f25417bfa128c2aa8"
}

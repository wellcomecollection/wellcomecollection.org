output "identity-admin_webapp_ecr_uri" {
  value = aws_ecr_repository.identity-admin_webapp.repository_url
}

// Production

output "prod_alb_dns" {
  value = module.prod.alb_dns_name
}

output "prod_alb_listener_http_arn" {
  value = module.prod.listener_http_arn
}

output "prod_alb_listener_https_arn" {
  value = module.prod.listener_https_arn
}

output "prod_interservice_security_group_id" {
  value = module.prod.interservice_security_group_id
}

output "prod_service_egress_security_group_id" {
  value = module.prod.service_egress_security_group_id
}

output "prod_cluster_arn" {
  value = module.prod.cluster_arn
}

output "prod_namespace_id" {
  value = module.prod.namespace_id
}

// Staging

output "stage_alb_dns" {
  value = module.stage.alb_dns_name
}

output "stage_alb_listener_http_arn" {
  value = module.stage.listener_http_arn
}

output "stage_alb_listener_https_arn" {
  value = module.stage.listener_https_arn
}

output "stage_interservice_security_group_id" {
  value = module.stage.interservice_security_group_id
}

output "stage_service_egress_security_group_id" {
  value = module.stage.service_egress_security_group_id
}

output "stage_cluster_arn" {
  value = module.stage.cluster_arn
}

output "stage_namespace_id" {
  value = module.stage.namespace_id
}

output "identity_admin_base_url_param_name" {
  value = {
    stage = aws_ssm_parameter.identity_admin_prod_base_url.name
    prod  = aws_ssm_parameter.identity_admin_stage_base_url.name
  }
}

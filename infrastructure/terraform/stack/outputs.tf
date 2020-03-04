output "cluster_arn" {
  value = aws_ecs_cluster.cluster.arn
}

output "namespace_id" {
  value = aws_service_discovery_private_dns_namespace.namespace.id
}

output "service_egress_security_group_id" {
  value = aws_security_group.service_egress_security_group.id
}

output "service_lb_ingress_security_group_id" {
  value = aws_security_group.service_lb_ingress_security_group.id
}

output "interservice_security_group_id" {
  value = aws_security_group.interservice_security_group.id
}

output "listener_https_arn" {
  value = module.alb.listener_https_arn
}

output "listener_http_arn" {
  value = module.alb.listener_http_arn
}

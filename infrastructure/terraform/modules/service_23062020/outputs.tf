output "target_group_arn" {
  value = aws_lb_target_group.http.arn
}

output "name" {
  value = module.service.name
}

output "task_role_name" {
  value = module.task_definition.task_role_name
}

output "nginx_container_port" {
  value = module.nginx_container.container_port
}

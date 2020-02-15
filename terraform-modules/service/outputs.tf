output "service_name" {
  value = var.name
}

output "target_group_arn" {
  value = module.service.target_group_arn
}

output "service_role_name" {
  value = module.service.role_name
}

output "task_role_name" {
  value = module.task.role_name
}

output "host_name" {
  value = var.host_name
}

output "arn" {
  value = aws_ecs_task_definition.task.arn
}

output "role_name" {
  value = module.iam_role.name
}

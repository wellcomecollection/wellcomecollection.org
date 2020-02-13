resource "aws_ecs_task_definition" "task" {
  family = "${var.name}_task_definition"

  container_definitions = templatefile(
    "${path.module}/templates/${var.template_name}.json.template",
    {
      log_group_region = var.aws_region
      log_group_name = aws_cloudwatch_log_group.task.name
      nginx_log_group_name = aws_cloudwatch_log_group.nginx_task.name

      app_uri = var.app_uri
      nginx_uri = var.nginx_uri
      primary_container_port = var.primary_container_port
      secondary_container_port = var.secondary_container_port
      volume_name = var.volume_name
      container_path = var.container_path
      environment_vars = local.env_var_string

      cpu = var.cpu
      memory = var.memory
    }
  )

  task_role_arn = local.task_role_arn

  volume {
    name = var.volume_name
    host_path = var.volume_host_path
  }
}

module "iam_role" {
  source = "./iam_role"
  name = var.name
}

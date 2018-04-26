module "ecs_pa11y_dashboard_iam" {
  source = "git::https://github.com/wellcometrust/terraform.git//ecs_iam?ref=v1.0.4"
  name   = "pa11y-dashboard"
}

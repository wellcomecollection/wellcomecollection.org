module "ecs_events_iam" {
  source = "git::https://github.com/wellcometrust/terraform.git//ecs_iam?ref=v1.0.4"
  name   = "whats-on"
}

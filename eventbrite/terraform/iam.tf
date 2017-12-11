module "ecs_exhibitions_iam" {
  source = "git::https://github.com/wellcometrust/terraform.git//ecs_iam?ref=v3.0.2"
  name   = "eventbrite"
}

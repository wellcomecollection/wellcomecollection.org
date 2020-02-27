module "ec2_terminating_topic" {
  source = "../../terraform-modules/sns"
  name   = "ec2_terminating_topic"
}

module "ec2_instance_terminating_for_too_long_alarm" {
  source = "../../terraform-modules/sns"
  name   = "ec2_instance_terminating_for_too_long_alarm"
}

module "alb_server_error_alarm" {
  source = "../../terraform-modules/sns"
  name   = "alb_server_error_alarm"
}

module "alb_client_error_alarm" {
  source = "../../terraform-modules/sns"
  name   = "alb_client_error_alarm"
}

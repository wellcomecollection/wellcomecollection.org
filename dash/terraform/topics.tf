module "ec2_terminating_topic" {
  source = "git::https://github.com/wellcometrust/terraform.git//sns?ref=v1.0.4"
  name   = "ec2_terminating_topic"
}

module "ec2_instance_terminating_for_too_long_alarm" {
  source = "git::https://github.com/wellcometrust/terraform.git//sns?ref=v1.0.4"
  name   = "ec2_instance_terminating_for_too_long_alarm"
}

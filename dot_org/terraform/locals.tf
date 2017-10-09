locals {
  vpc_id = "${data.terraform_remote_state.wellcomecollection.vpc_id}"
  vpc_subnets = "${data.terraform_remote_state.wellcomecollection.vpc_subnets}"
  alb-logs_id = "${data.terraform_remote_state.wellcomecollection.alb-logs_id}"
  server_error_alarm_topic_arn ="${data.terraform_remote_state.wellcomecollection.server_error_alarm_topic_arn}"
  client_error_alarm_topic_arn = "${data.terraform_remote_state.wellcomecollection.client_error_alarm_topic_arn}"
  ec2_terminating_topic_arn = "${data.terraform_remote_state.wellcomecollection.ec2_terminating_topic_arn}"
  ec2_terminating_topic_publish_policy = "${data.terraform_remote_state.wellcomecollection.ec2_terminating_topic_publish_policy}"
  ec2_instance_terminating_for_too_long_alarm_arn = "${data.terraform_remote_state.wellcomecollection.ec2_instance_terminating_for_too_long_alarm_arn}"
}

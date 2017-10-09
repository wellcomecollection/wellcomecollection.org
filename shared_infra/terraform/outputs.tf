output "alb-logs_id" {
  value = "${aws_s3_bucket.alb-logs.id}"
}

output "server_error_alarm_topic_arn" {
  value = "${module.alb_server_error_alarm.arn}"
}

output "client_error_alarm_topic_arn" {
  value = "${module.alb_client_error_alarm.arn}"
}

output "ec2_terminating_topic_arn" {
  value = "${module.ec2_terminating_topic.arn}"
}

output "ec2_terminating_topic_publish_policy" {
  value ="${module.ec2_terminating_topic.publish_policy}"
}

output "ec2_instance_terminating_for_too_long_alarm_arn" {
  value = "${module.ec2_instance_terminating_for_too_long_alarm.arn}"
}

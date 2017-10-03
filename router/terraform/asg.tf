module "router_cluster_asg" {
  source                = "github.com/wellcometrust/platform//terraform/ecs_asg"
  asg_name              = "loris-cluster"
  subnet_list           = ["${module.vpc_router.subnets}"]
  key_name              = "${var.key_name}"
  instance_profile_name = "${module.ecs_router_iam.instance_profile_name}"
  user_data             = "${module.router_userdata.rendered}"
  vpc_id                = "${module.vpc_router.vpc_id}"

  asg_desired = "2"
  asg_max     = "2"

  image_id      = "${data.aws_ami.stable_coreos.image_id}"
  instance_type = "t2.micro"

  sns_topic_arn         = "${module.ec2_terminating_topic.arn}"
  publish_to_sns_policy = "${module.ec2_terminating_topic.publish_policy}"

  alarm_topic_arn       = "${module.ec2_instance_terminating_for_too_long_alarm.arn}"
}

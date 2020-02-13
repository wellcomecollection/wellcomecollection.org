module "router_cluster_asg" {
  source                = "./asg"
  asg_name              = "router-cluster"
  subnet_list           = local.vpc_subnets
  key_name              = "wellcomecollection.org"
  instance_profile_name = module.ecs_router_iam.instance_profile_name
  user_data             = module.router_userdata.rendered
  vpc_id                = local.vpc_id

  asg_desired = "4"
  asg_max     = "4"

  image_id      = data.aws_ami.stable_coreos.image_id
  instance_type = "t2.small"

  sns_topic_arn         = module.ec2_terminating_topic.arn
  publish_to_sns_policy = module.ec2_terminating_topic.publish_policy

  alarm_topic_arn = module.ec2_instance_terminating_for_too_long_alarm.arn
}

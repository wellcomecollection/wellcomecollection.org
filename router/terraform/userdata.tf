module "router_userdata" {
  source            = "git::https://github.com/wellcometrust/terraform.git//terraform/userdata?ref=v1.0.0"
  cluster_name      = "${aws_ecs_cluster.router.name}"
}

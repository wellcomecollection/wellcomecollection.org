module "dot_org_userdata" {
  source            = "git::https://github.com/wellcometrust/terraform.git//userdata?ref=v1.0.0"
  cluster_name      = "${aws_ecs_cluster.dot_org.name}"
}

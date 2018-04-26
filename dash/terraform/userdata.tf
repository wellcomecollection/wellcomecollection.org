module "dash_cluster_userdata" {
  source       = "git::https://github.com/wellcometrust/terraform.git//userdata?ref=v1.0.4"
  cluster_name = "${aws_ecs_cluster.dash_cluster.name}"
}

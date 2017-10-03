module "router_userdata" {
  source            = "github.com/wellcometrust/platform//terraform/userdata"
  cluster_name      = "${aws_ecs_cluster.router.name}"
}

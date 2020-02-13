module "router_userdata" {
  source       = "./userdata"
  cluster_name = aws_ecs_cluster.router.name
}

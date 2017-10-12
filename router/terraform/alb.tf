module "router_alb" {
  source  = "git::https://github.com/wellcometrust/terraform.git//ecs_alb?ref=v1.0.1"
  name    = "router"
  subnets = ["${local.vpc_subnets}"]

  loadbalancer_security_groups = [
    "${module.router_cluster_asg.loadbalancer_sg_https_id}",
    "${module.router_cluster_asg.loadbalancer_sg_http_id}",
  ]

  certificate_domain = "*.wellcomecollection.org"
  vpc_id             = "${local.vpc_id}"

  alb_access_log_bucket = "${aws_s3_bucket.alb-logs.id}"
}

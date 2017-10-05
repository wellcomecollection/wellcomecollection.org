module "router_alb" {
  source  = "git::https://github.com/wellcometrust/terraform.git//terraform/ecs_alb?ref=v1.0.0"
  name    = "loris"
  subnets = ["${var.vpc_subnets}"]

  loadbalancer_security_groups = [
    "${module.router_cluster_asg.loadbalancer_sg_https_id}",
    "${module.router_cluster_asg.loadbalancer_sg_http_id}",
  ]

  certificate_domain = "api.wellcomecollection.org"
  vpc_id             = "${var.vpc_id}"

  alb_access_log_bucket = "${aws_s3_bucket.alb-logs.id}"
}

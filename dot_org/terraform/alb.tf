module "dot_org_alb" {
  source  = "git::https://github.com/wellcometrust/terraform.git//ecs_alb?ref=v1.0.0"
  name    = "dot_org"
  subnets = ["${local.vpc_subnets}"]

  loadbalancer_security_groups = [
    "${module.dot_org_cluster_asg.loadbalancer_sg_https_id}",
    "${module.dot_org_cluster_asg.loadbalancer_sg_http_id}",
  ]

  certificate_domain = "*.wellcomecollection.org"
  vpc_id             = "${local.vpc_id}"

  alb_access_log_bucket = "${local.alb-logs_id}"
}

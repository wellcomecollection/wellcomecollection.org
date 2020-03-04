resource "aws_ecs_cluster" "cluster" {
  name = "experience-frontend-${var.namespace}"
}

resource "aws_service_discovery_private_dns_namespace" "namespace" {
  name = "experience-${var.namespace}"
  vpc  = var.vpc_id
}

data "aws_vpc" "vpc" {
  id = var.vpc_id
}

module "alb" {
  source = "../modules/alb"

  name = var.namespace

  certificate_domain = "wellcomecollection.org"

  security_groups = [
    aws_security_group.service_lb_ingress_security_group.id
  ]

  vpc_id  = var.vpc_id
  subnets = var.subnets
}

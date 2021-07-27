module "alb" {
  source = "../../infrastructure/modules/alb"

  name    = "lhci-lb"
  subnets = local.public_subnets
  vpc_id  = local.vpc_id

  cert_arn = module.lighthouse_cert.arn
  security_groups = [
    aws_security_group.lb_security_group.id,
    aws_security_group.interservice_security_group.id
  ]
}

resource "aws_security_group" "lb_security_group" {
  name        = "experience_lhci_ingress_security_group"
  description = "Allow traffic between services and ALB"
  vpc_id      = local.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.vpc.cidr_block]
  }
}

resource "aws_security_group" "service_egress_security_group" {
  name        = "experience_lhci_egress_security_group"
  description = "Allow traffic to the internet"
  vpc_id      = local.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "interservice_security_group" {
  name        = "experience_lhci_interservice_security_group"
  description = "Allow traffic between services"
  vpc_id      = local.vpc_id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }
}

resource "aws_security_group" "service_egress_security_group" {
  name        = "experience_${var.namespace}_egress_security_group"
  description = "Allow traffic to the internet"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "service_lb_ingress_security_group" {
  name        = "experience_${var.namespace}_ingress_security_group"
  description = "Allow traffic between services and NLB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [data.aws_vpc.vpc.cidr_block]
  }
}

resource "aws_security_group" "interservice_security_group" {
  name        = "experience_${var.namespace}_interservice_security_group"
  description = "Allow traffic between services"
  vpc_id      = var.vpc_id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  tags = {
    Name = "experience_${var.namespace}_interservice"
  }
}

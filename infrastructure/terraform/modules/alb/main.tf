resource "aws_alb" "alb" {
  name    = var.name
  subnets = var.subnets
  security_groups = var.security_groups

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_alb_listener" "https" {
  load_balancer_arn = aws_alb.alb.id
  port = "443"
  protocol = "HTTPS"
  ssl_policy = "ELBSecurityPolicy-2015-05"
  certificate_arn = var.cert_arn

  default_action {
    target_group_arn = aws_alb_target_group.ecs_service_default.arn
    type = "forward"
  }
}

resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_alb.alb.id
  port = "80"
  protocol = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.ecs_service_default.arn
    type = "forward"
  }
}

resource "aws_alb_target_group" "ecs_service_default" {
  name = "${var.name}-default-target-group"
  port = 80
  protocol = "HTTP"
  vpc_id = var.vpc_id

  health_check {
    path = var.health_check_path
  }
}

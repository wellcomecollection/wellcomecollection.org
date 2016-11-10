resource "aws_alb" "wellcomecollection_alb" {
  name            = "wellcomecollection-alb"
  subnets         = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
  security_groups = ["${aws_security_group.http.id}", "${aws_security_group.node_app_port.id}"]
}

resource "aws_alb_target_group" "wellcomecollection" {
  name     = "wellcomecollection"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = "${aws_vpc.wellcomecollection.id}"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 20
    protocol            = "HTTP"
    path                = "/healthcheck"
    interval            = 30
  }
}

resource "aws_alb_listener" "wellcomecollection" {
  load_balancer_arn = "${aws_alb.wellcomecollection_alb.id}"
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.wellcomecollection.id}"
    type             = "forward"
  }
}

data "aws_acm_certificate" "next_wellcomecollection_org" {
  domain = "next.wellcomecollection.org"
  statuses = ["ISSUED"]
}

resource "aws_alb" "wellcomecollection_alb" {
  name            = "wellcomecollection-alb"
  subnets         = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
  security_groups = [
    "${aws_security_group.https.id}",
    "${aws_security_group.http.id}",
    "${aws_security_group.node_app_port.id}",
    "${aws_security_group.docker.id}"
  ]
}

resource "aws_alb_target_group" "wellcomecollection" {
  name     = "wellcomecollection"
  port     = 80
  protocol = "HTTP"
  vpc_id   = "${aws_vpc.wellcomecollection.id}"

  health_check {
    healthy_threshold   = 5
    unhealthy_threshold = 2
    timeout             = 5
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

resource "aws_alb_listener" "wellcomecollection_https" {
  load_balancer_arn = "${aws_alb.wellcomecollection_alb.id}"
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2015-05"
  certificate_arn   = "${data.aws_acm_certificate.next_wellcomecollection_org.arn}"

  default_action {
    target_group_arn = "${aws_alb_target_group.wellcomecollection.id}"
    type             = "forward"
  }
}

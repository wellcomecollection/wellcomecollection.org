resource "aws_elb" "wellcomecollection" {
  name                  = "${var.project_name}"
  subnets               = ["${aws_subnet.public.id}"]
  security_groups       = [
    "${aws_security_group.http.id}",
    "${aws_security_group.https.id}",
    "${aws_security_group.node_app_port.id}"
  ]

  listener {
    instance_port       = 3000
    instance_protocol   = "http"
    lb_port             = 3000
    lb_protocol         = "http"
  }

  listener {
    instance_port       = 3000
    instance_protocol   = "http"
    lb_port             = 80
    lb_protocol         = "http"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 20
    target              = "HTTP:3000/healthcheck"
    interval            = 30
  }
}

module "router_alb" {
  source  = "git::https://github.com/wellcometrust/terraform.git//ecs_alb?ref=v1.0.1"
  name    = "router"
  subnets = ["${local.vpc_subnets}"]

  loadbalancer_security_groups = [
    "${module.router_cluster_asg.loadbalancer_sg_https_id}",
    "${module.router_cluster_asg.loadbalancer_sg_http_id}",
  ]

  certificate_domain = "wellcomecollection.org"
  vpc_id             = "${local.vpc_id}"

  alb_access_log_bucket = "${aws_s3_bucket.alb-logs.id}"
}

resource "aws_lb_listener_rule" "https_robots_txt" {
  listener_arn = "${module.router_alb.listener_https_arn}"
  priority     = 1

  action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"

      message_body = <<EOF
User-agent: *
Disallow: /
EOF

      status_code = "200"
    }
  }

  condition {
    field  = "path-pattern"
    values = ["/robots.txt"]
  }

  condition {
    field  = "path-pattern"
    values = ["/robots.txt"]
  }

  condition {
    field = "host-header"

    values = [
      "*.wellcomecollection.org",
    ]
  }
}

data "local_file" "root_robots_txt" {
  filename = "${path.module}/robots.txt"
}

resource "aws_lb_listener_rule" "https_root_robots_txt" {
  listener_arn = "${module.router_alb.listener_https_arn}"
  priority     = 3

  action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "${data.local_file.root_robots_txt.content}"
      status_code  = "200"
    }
  }

  condition {
    field  = "path-pattern"
    values = ["/robots.txt"]
  }

  condition {
    field = "host-header"

    values = [
      "wellcomecollection.org",
    ]
  }
}

data "local_file" "root_humans_txt" {
  filename = "${path.module}/humans.txt"
}

resource "aws_lb_listener_rule" "https_root_humans_txt" {
  listener_arn = "${module.router_alb.listener_https_arn}"
  priority     = 4

  action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "${data.local_file.root_humans_txt.content}"
      status_code  = "200"
    }
  }

  condition {
    field  = "path-pattern"
    values = ["/humans.txt"]
  }

  condition {
    field = "host-header"

    values = [
      "wellcomecollection.org",
    ]
  }
}

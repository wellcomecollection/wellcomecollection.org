data "template_file" "container_definitions" {
  template = "${var.container_definitions}"

  vars {
    container_tag = "${var.container_tag}"
  }
}

data "template_file" "container_definitions_thumbor" {
  template = "${var.container_definitions_thumbor}"

  vars {
    container_tag = "${var.container_tag}"
  }
}

resource "aws_ecs_cluster" "wellcomecollection" {
  name = "wellcomecollection"
}

resource "aws_ecs_task_definition" "wellcomecollection" {
  family                = "wellcomecollection"
  container_definitions = "${data.template_file.container_definitions.rendered}"
}

resource "aws_ecs_service" "wellcomecollection" {
  name                               = "wellcomecollection"
  cluster                            = "${aws_ecs_cluster.wellcomecollection.id}"
  task_definition                    = "${aws_ecs_task_definition.wellcomecollection.arn}"
  desired_count                      = 2
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  iam_role                           = "${aws_iam_role.ecs_service_role.arn}"

  placement_strategy {
    type  = "spread"
    field = "instanceId"
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.wellcomecollection.id}"
    container_name   = "nginx-proxy"
    container_port   = 80
  }

  depends_on = [
    "aws_iam_role_policy.ecs_service_policy",
    "aws_alb_listener.wellcomecollection",
  ]
}

resource "aws_ecs_task_definition" "thumbor" {
  family                = "thumbor"
  container_definitions = "${data.template_file.container_definitions_thumbor.rendered}"
}

resource "aws_ecs_service" "thumbor" {
  name                               = "thumbor"
  cluster                            = "${aws_ecs_cluster.wellcomecollection.id}"
  task_definition                    = "${aws_ecs_task_definition.thumbor.arn}"
  desired_count                      = 1
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  iam_role                           = "${aws_iam_role.ecs_service_role.arn}"

  placement_strategy {
    type  = "spread"
    field = "instanceId"
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.thumbor.id}"
    container_name   = "thumbor"
    container_port   = 8000
  }

  depends_on = [
    "aws_iam_role_policy.ecs_service_policy",
    "aws_alb_listener.wellcomecollection",
  ]
}

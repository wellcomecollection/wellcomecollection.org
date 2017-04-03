resource "aws_ecs_cluster" "wellcomecollection" {
  name = "wellcomecollection"
}

resource "aws_ecs_task_definition" "wellcomecollection" {
  family = "wellcomecollection"
  container_definitions = "${data.template_file.container_definitions.rendered}"
}

resource "aws_ecs_service" "wellcomecollection" {
  name = "wellcomecollection"
  cluster = "${aws_ecs_cluster.wellcomecollection.id}"
  task_definition = "${aws_ecs_task_definition.wellcomecollection.arn}"
  desired_count = 2
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent = 200
  iam_role = "${aws_iam_role.ecs_service_role.arn}"

  load_balancer {
    target_group_arn = "${aws_alb_target_group.wellcomecollection.id}"
    container_name = "nginx-proxy"
    container_port = "80"
  }

  depends_on = [
    "aws_iam_role_policy.ecs_service_policy",
    "aws_alb_listener.wellcomecollection",
  ]
}

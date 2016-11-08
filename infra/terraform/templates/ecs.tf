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
  depends_on = ["aws_iam_role_policy.ecs_service_policy"]
  desired_count = 1
  deployment_minimum_healthy_percent = 50
  iam_role = "${aws_iam_role.ecs_service_role.arn}"

  load_balancer {
    elb_name = "${aws_elb.wellcomecollection.id}"
    container_name = "wellcomecollection"
    container_port = "3000"
  }
}

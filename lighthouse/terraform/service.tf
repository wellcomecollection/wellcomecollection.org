resource "aws_ecs_cluster" "lhci_cluster" {
  name = "lighthouse-ci"
}

module "lhci_server" {
  source    = "../../infrastructure/modules/service"
  namespace = "lighthouse-ci"

  cluster_arn = aws_ecs_cluster.lhci_cluster.arn

  container_image = "${aws_ecr_repository.lhci_server.repository_url}:latest"
  container_port  = local.lhci_app_port
  // https://github.com/GoogleChrome/lighthouse-ci/blob/c31cea34e1fd883879b545458c6a9fff27d2af48/packages/server/src/server.js#L51
  healthcheck_path   = "/healthz"
  desired_task_count = 1

  env_vars = {
    PORT    = local.lhci_app_port
    DB_HOST = aws_rds_cluster.lhci_db.endpoint
    DB_PORT = aws_rds_cluster.lhci_db.port
    DB_NAME = aws_rds_cluster.lhci_db.database_name
  }

  secret_env_vars = {
    DB_USER     = "ci/lighthouse/database/username"
    DB_PASSWORD = "ci/lighthouse/database/password"
  }

  security_group_ids = [
    aws_security_group.lhci_db_ingress.id,
    aws_security_group.service_egress_security_group.id,
    aws_security_group.interservice_security_group.id
  ]

  subnets = local.private_subnets
  vpc_id  = local.vpc_id
}

module "path_listener" {
  source = "../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = module.alb.listener_https_arn
  target_group_arn       = module.lhci_server.target_group_arn

  priority      = "1"
  path_patterns = ["*"]
}

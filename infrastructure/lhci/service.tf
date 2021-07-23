resource "aws_ecs_cluster" "lhci_cluster" {
  name = "lighthouse-ci"
}

resource "aws_service_discovery_private_dns_namespace" "namespace" {
  name = "lighthouse-ci"
  vpc  = local.vpc_id
}

module "lhci_server" {
  source    = "../modules/service"
  namespace = "lighthouse-ci"

  namespace_id = aws_service_discovery_private_dns_namespace.namespace.id
  cluster_arn  = aws_ecs_cluster.lhci_cluster.arn

  container_image = "${aws_ecr_repository.lhci_server.repository_url}:latest"
  container_port  = local.lhci_app_port
  // https://github.com/GoogleChrome/lighthouse-ci/blob/c31cea34e1fd883879b545458c6a9fff27d2af48/packages/server/src/server.js#L51
  healthcheck_path = "/healthz"

  env_vars = {
    PORT    = local.lhci_app_port
    DB_HOST = aws_rds_cluster.lchi_db.endpoint
    DB_PORT = aws_rds_cluster.lchi_db.port
    DB_NAME = aws_rds_cluster.lchi_db.database_name
  }

  secret_env_vars = {
    DB_USER     = "ci/lighthouse/database/username"
    DB_PASSWORD = "ci/lighthouse/database/password"
  }

  security_group_ids = [
    aws_security_group.lhci_db_ingress.id
  ]

  subnets = local.private_subnets
  vpc_id  = local.vpc_id
}

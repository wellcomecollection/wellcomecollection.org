locals {
  db_name    = "lhci"
  mysql_port = 3306
}

resource "aws_rds_cluster" "lhci_db" {
  cluster_identifier = "lhci-cluster"
  engine             = "aurora-mysql"
  engine_mode        = "serverless"
  engine_version     = "5.7.mysql_aurora.2.08.3"
  port               = local.mysql_port

  database_name   = local.db_name
  master_password = data.aws_secretsmanager_secret_version.db_password.secret_string
  master_username = data.aws_secretsmanager_secret_version.db_username.secret_string

  vpc_security_group_ids = [aws_security_group.lhci_db.id]
  db_subnet_group_name   = aws_db_subnet_group.lhci.id
  skip_final_snapshot    = true

  scaling_configuration {
    auto_pause   = true
    max_capacity = 1
  }
}

resource "aws_db_subnet_group" "lhci" {
  subnet_ids = local.private_subnets
}

resource "aws_security_group" "lhci_db" {
  description = "Allow TCP ingress on port 3306 from lhci_db_ingress and egress to the world"
  vpc_id      = local.vpc_id
  name        = "lhci_db_sg"

  ingress {
    from_port = local.mysql_port
    to_port   = local.mysql_port
    protocol  = "tcp"

    security_groups = [aws_security_group.lhci_db_ingress.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "lhci_db_ingress" {
  name        = "pipeline_rds_ingress_security_group"
  description = "Allow traffic to RDS database"
  vpc_id      = local.vpc_id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }
}

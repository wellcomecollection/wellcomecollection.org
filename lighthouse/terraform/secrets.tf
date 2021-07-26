resource "aws_secretsmanager_secret" "db_username" {
  name = "lighthouse/database/username"
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "lighthouse/database/password"
}

data "aws_secretsmanager_secret_version" "db_username" {
  secret_id = aws_secretsmanager_secret.db_username.id
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
}

resource "aws_secretsmanager_secret" "lhci_build_token" {
  name = "lighthouse/build_token"
}

resource "aws_secretsmanager_secret" "lhci_admin_token" {
  name = "lighthouse/admin_token"
}

resource "aws_secretsmanager_secret" "lhci_admin_username" {
  name = "lighthouse/admin/username"
}

resource "aws_secretsmanager_secret" "lhci_admin_password" {
  name = "lighthouse/admin/password"
}

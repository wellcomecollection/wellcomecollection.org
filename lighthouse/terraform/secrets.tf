resource "aws_secretsmanager_secret" "db_username" {
  name = "ci/lighthouse/database/username"
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "ci/lighthouse/database/password"
}

data "aws_secretsmanager_secret_version" "db_username" {
  secret_id = aws_secretsmanager_secret.db_username.id
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
}

resource "aws_secretsmanager_secret" "lhci_build_token" {
  name = "ci/lighthouse/build_token"
}

resource "aws_secretsmanager_secret" "lhci_admin_token" {
  name = "ci/lighthouse/admin_token"
}

resource "aws_secretsmanager_secret" "lhci_admin_username" {
  name = "ci/lighthouse/admin/username"
}

resource "aws_secretsmanager_secret" "lhci_admin_password" {
  name = "ci/lighthouse/admin/password"
}

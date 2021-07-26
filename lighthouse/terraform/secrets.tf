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



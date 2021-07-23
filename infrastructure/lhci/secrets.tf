resource "aws_secretsmanager_secret" "db_username" {
  name = "ci/lighthouse/database/username"
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "ci/lighthouse/database/password"
}

resource "aws_secretsmanager_secret_version" "db_username" {
  secret_id     = aws_secretsmanager_secret.db_username.id
  secret_string = random_password.db_username.result
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}

// OK to have these in state because they have to  be in the RDS cluster state regardless
resource "random_password" "db_username" {
  length  = 24
  special = true
}

resource "random_password" "db_password" {
  length  = 24
  special = true
}


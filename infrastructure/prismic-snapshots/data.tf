# Source of Prismic access token
data "aws_secretsmanager_secret_version" "prismic_access_token" {
  secret_id = "prismic-model/prod/access-token"
}

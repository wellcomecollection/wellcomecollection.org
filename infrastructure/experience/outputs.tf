output "buildkite_ecr_uri" {
  value = aws_ecr_repository.buildkite.repository_url
}

output "content_webapp_ecr_uri" {
  value = aws_ecr_repository.content_webapp.repository_url
}

output "identity_webapp_ecr_uri" {
  value = aws_ecr_repository.identity_webapp.repository_url
}

output "prod" {
  value = module.prod
}

output "stage" {
  value = module.stage
}

output "e2e" {
  value = module.e2e
}

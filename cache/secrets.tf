# This secret is used to authenticate requests from CloudFront at
# the load balancer in all environments. It is used to ensure that 
# only requests from CloudFront are allowed to access the load balancers.
resource "aws_secretsmanager_secret" "header_shared_secret_020124" {
  name = "shared/cloudfront_custom_header/020124"
  description = "Shared secret for authenticating requests from CloudFront"
}

data "aws_secretsmanager_secret_version" "header_shared_secret_020124" {
  secret_id = aws_secretsmanager_secret.header_shared_secret_020124.id
}

# resource "aws_secretsmanager_secret" "header_shared_secret_DDMMYY" {
#   name = "shared/cloudfront_custom_header/DDMMYY"
#   description = "Shared secret for authenticating requests from CloudFront"
# }

# data "aws_secretsmanager_secret_version" "header_shared_secret_DDMMYY" {
#   secret_id = aws_secretsmanager_secret.header_shared_secret_DDMMYY.id
# }


locals {
  current_shared_secret = data.aws_secretsmanager_secret_version.header_shared_secret_020124.secret_string
}

# **Secret rotation process**
#
# If you need to perform a rotation of the secret, follow this process:
# - Create a new secret above and add it to the list of outputs below. 
#   `terraform apply` in the cache stack will update will create the new secret
# - Update the listener rule configs in all apps (content & identity) to accept the new secret.
#   `terraform apply` in the content and identity stacks will update the listener rules (recommended to do targetted apply per env).
# - Update the CloudFront distros for all envs by setting current_shared_secret above to the new secret
#   `terraform apply` in the cache stack will update the CloudFront distros (recommended to do targetted apply per env)
# - Update the preview cloudfront distro by terraforming in the preview stack
#   `terraform apply` in the preview stack will update the preview CloudFront distro
# - Once all apps and CloudFront distros are updated, it's safe to delete the old secret in terraform

output "cloudfront_header_shared_secrets" {
  # This is a relatively insecure way to share the secret as we're storing it in tf state, 
  # but it's not high risk, the important thing is that it's not in the codebase.
  value = [
    data.aws_secretsmanager_secret_version.header_shared_secret_020124.secret_string,
    # data.aws_secretsmanager_secret_version.header_shared_secret_DDMMYY.secret_string
  ] 
  sensitive = true
}

output "current_shared_secret" {
  value = local.current_shared_secret
  sensitive = true
}
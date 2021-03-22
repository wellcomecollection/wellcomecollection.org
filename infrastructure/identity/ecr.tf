resource "aws_ecr_repository" "identity-admin_webapp" {
  name = "uk.ac.wellcome/identity-admin_webapp"

  lifecycle {
    prevent_destroy = true
  }
}

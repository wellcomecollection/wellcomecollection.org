resource "aws_ecr_repository" "lhci_server" {
  name = "uk.ac.wellcome/lhci_server"

  lifecycle {
    prevent_destroy = true
  }
}

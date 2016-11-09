data "terraform_remote_state" "wellcomecollection" {
  backend = "s3"

  config {
    bucket = "${var.build_state_bucket}"
    key = "build-state/terraform.tfstate"
    region = "eu-west-1"
  }
}

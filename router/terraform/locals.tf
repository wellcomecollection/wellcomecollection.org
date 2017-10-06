locals {
  vpc_id = "${data.terraform_remote_state.wellcomecollection.vpc_id}"
  vpc_subnets = "${data.terraform_remote_state.wellcomecollection.vpc_subnets}"
}

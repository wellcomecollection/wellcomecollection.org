locals {
  alb_id       = "${data.terraform_remote_state.infra.alb_id}"
  alb_dns_name = "${data.terraform_remote_state.infra.alb_dns_name}"
}

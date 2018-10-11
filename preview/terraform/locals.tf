locals {
  alb_id       = "${data.terraform_remote_state.router.alb_id}"
  alb_dns_name = "${data.terraform_remote_state.router.alb_dns_name}"
}

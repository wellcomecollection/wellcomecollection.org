locals {
  alb_id       = data.terraform_remote_state.router.outputs.alb_id
  alb_dns_name = data.terraform_remote_state.router.outputs.alb_dns_name
}


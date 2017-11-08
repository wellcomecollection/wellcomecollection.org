locals {
  vpc_id      = "${data.terraform_remote_state.infra.vpc_id}"
  vpc_subnets = "${data.terraform_remote_state.infra.vpc_subnets}"

  alb_listener_https_arn = "${data.terraform_remote_state.infra.alb_listener_https_arn}"
  alb_listener_http_arn  = "${data.terraform_remote_state.infra.alb_listener_http_arn}"

  alb_cloudwatch_id = "${data.terraform_remote_state.infra.alb_cloudwatch_id}"
}

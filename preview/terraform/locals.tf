locals {
  prod_alb_dns      = data.terraform_remote_state.experience.outputs.prod_alb_dns
  prod_cf_origin_id = data.terraform_remote_state.cache.outputs.wc_org_cf_distro_id

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"
}


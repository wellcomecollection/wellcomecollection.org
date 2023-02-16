locals {
  vpc_id = local.experience_vpcs["experience_vpc_id"]
  private_subnets = local.experience_vpcs["experience_vpc_private_subnets"]
  public_subnets  = local.experience_vpcs["experience_vpc_public_subnets"]

  wellcomecollection_cert_arn = data.terraform_remote_state.experience_infra.outputs["certificate_arn"]

  catalogue_app_image   = data.terraform_remote_state.experience_infra.outputs["catalogue_webapp_ecr_uri"]
  content_app_image   = data.terraform_remote_state.experience_infra.outputs["content_webapp_ecr_uri"]
  identity_app_image   = data.terraform_remote_state.experience_infra.outputs["identity_webapp_ecr_uri"]


  nginx_image = "760097843905.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/nginx_experience:78090f62ee23a39a1b4e929f25417bfa128c2aa8"
}

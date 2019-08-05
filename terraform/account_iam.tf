locals {
  platform_account_root = "arn:aws:iam::760097843905:root"
}

module "account" {
  source = "git::https://github.com/wellcometrust/terraform.git//iam/prebuilt/account?ref=v19.5.0"

  admin_principals          = ["${local.platform_account_root}"]
  read_only_principals      = ["${local.platform_account_root}"]
  monitoring_principals     = ["${local.platform_account_root}"]
  billing_principals        = ["${local.platform_account_root}"]
  developer_principals      = ["${local.platform_account_root}"]
  infrastructure_principals = ["${local.platform_account_root}"]

  pgp_key = "${data.template_file.pgp_key.rendered}"
}

data "template_file" "pgp_key" {
  template = "${file("${path.module}/wellcomedigitalplatform.key")}"
}

module "aws_account" {
  source = "git::https://github.com/wellcometrust/terraform.git//iam/prebuilt/account/aws?ref=1a9b2fc61027814148571a8f2769bf5165404ed0"

  prefix    = "experience"
  principal = ["${local.platform_account_root}"]
}

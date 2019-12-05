## Assumable roles

output "admin_role_arn" {
  value = "${module.aws_account.admin_role_arn}"
}

output "billing_role_arn" {
  value = "${module.aws_account.billing_role_arn}"
}

output "developer_role_arn" {
  value = "${module.aws_account.developer_role_arn}"
}

output "infrastructure_role_arn" {
  value = "${module.aws_account.infrastructure_role_arn}"
}

output "monitoring_role_arn" {
  value = "${module.aws_account.monitoring_role_arn}"
}

output "read_only_role_arn" {
  value = "${module.aws_account.read_only_role_arn}"
}


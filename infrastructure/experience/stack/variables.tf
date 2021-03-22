variable "vpc_id" {}
variable "namespace" {}
variable "subnets" {
  type = list(string)
}
variable "cert_arn" {}

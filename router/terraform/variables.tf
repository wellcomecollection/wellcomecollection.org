variable "key_name" {
  default = "wellcomecollection.org"
}

variable "nginx_uri" {
  default = "wellcome/wellcomecollection-router:prod"
}

variable "vpc_subnets" {}
variable "vpc_id" {}

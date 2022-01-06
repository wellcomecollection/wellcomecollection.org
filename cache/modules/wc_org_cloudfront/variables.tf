variable "load_balancer_dns" {
  type = string
}

variable "aliases" {
  type = set(string)
}

variable "namespace" {
  type = string
}

variable "assets_origin" {
  type = object({
    bucket_endpoint = string
    website_uri     = string
  })
}

variable "logging_prefix" {
  type = string
}

variable "lambda_arns" {
  type = object({
    request  = string
    response = string
  })
}

variable "certificate_arn" {
  type = string
}

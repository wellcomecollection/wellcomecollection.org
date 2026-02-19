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

variable "lambda_arns" {
  type = object({
    request  = string
    response = string
  })
}

variable "certificate_arn" {
  type = string
}

variable "cache_policies" {
  # name -> id
  type = map(string)
}

variable "request_policies" {
  # name -> id
  type = map(string)
}

variable "response_policies" {
  # name -> id
  type = map(string)
}

variable "waf_ip_allowlist" {
  type    = set(string)
  default = []
}

variable "header_shared_secret" {
  type = string
}

variable "allowed_countries" {
  type    = list(string)
  default = []
}

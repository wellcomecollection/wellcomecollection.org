variable "domain_name" {
  type = string
}

variable "subject_alternative_names" {
  type    = list(string)
  default = []
}

variable "ttl" {
  type    = number
  default = 300
}

variable "zone_id" {
  type = string
}
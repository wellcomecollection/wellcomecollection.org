variable "name" {
  type = string
}

variable "ttl_policy" {
  // This should be 'dynamic', 'static' or 'live' which correspond to
  // moderately short-lived default TTLs (~1 hour), very long TTLs (> 1 day),
  // and very short TTLs (~1 minute), respectively.
  type = string

  validation {
    condition     = contains(["dynamic", "static", "live"], var.ttl_policy)
    error_message = "ttl_policy must be 'dynamic', 'static' or 'live'"
  }
}

variable "query_string_whitelist" {
  type    = set(string)
  default = []
}

variable "cookie_whitelist" {
  type    = set(string)
  default = []
}

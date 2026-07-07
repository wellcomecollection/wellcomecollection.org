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

variable "google_bots_ip_set_arn" {
  type        = string
  description = "ARN of the shared google-bots IP set (defined at root level)"
}

variable "github_actions_ip_set_arn" {
  type        = string
  description = "ARN of the shared github-actions IP set (defined at root level)"
}

variable "enable_search_challenge" {
  type        = bool
  default     = false
  description = "Serve a silent JS challenge to token-less clients on /search* pages. High-risk: prove on stage before enabling elsewhere."
}

variable "enable_search_legacy_ua_block" {
  type        = bool
  default     = false
  description = "Block /search* requests claiming a Chrome major version below 100, ahead of the billed search challenge. Prove on stage before enabling elsewhere."
}

variable "search_challenge_immunity_seconds" {
  type        = number
  default     = 300
  description = "How long a solved search challenge token stays valid. 300 is the AWS default; longer values mean fewer billed re-challenges for real users but a longer window for a token-holding client before it is re-challenged."
}

variable "enable_waf_logging" {
  type        = bool
  default     = false
  description = "Log non-allowed (blocked/counted/challenged) WAF requests to CloudWatch Logs"
}

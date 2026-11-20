variable "name" {
  description = "Name of the Lambda"
}

variable "handler" {
  type = string
}

variable "description" {
  description = "Description of the Lambda function"
}

variable "timeout" {
  description = "The amount of time your Lambda function has to run in seconds"
  default     = 3
  type        = number
}

variable "alarm_topic_arn" {
  description = "ARN of the topic where to send notification for lambda errors"
}

variable "environment_variables" {
  type = map(string)
}

variable "source_file" {
  type = string
}

variable "extra_source_files" {
  type    = list(string)
  default = []
}

variable "memory_size" {
  default = 128
}

variable "log_retention_in_days" {
  description = "The number of days to keep CloudWatch logs"
  default     = 7
  type        = number
}

variable "runtime" {
  type = string
}

variable "alarm_component" {
  type        = string
  default     = null
  description = "Backplane Component name for the error alarm, set as the backplane:component tag and in the description prefix"
}

variable "alarm_repository" {
  type        = string
  default     = null
  description = "Owning repository for the error alarm, e.g. wellcomecollection/wellcomecollection.org, set as the github.com/project-slug tag"
}

variable "alarm_severity" {
  type        = string
  default     = "medium"
  description = "Severity of the error alarm: high, medium or low"

  validation {
    condition     = contains(["high", "medium", "low"], var.alarm_severity)
    error_message = "alarm_severity must be high, medium or low."
  }
}

variable "alarm_tags" {
  type        = map(string)
  default     = {}
  description = "Extra tags for the error alarm"
}

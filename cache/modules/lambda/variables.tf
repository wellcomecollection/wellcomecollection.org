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

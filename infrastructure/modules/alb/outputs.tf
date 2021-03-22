output "listener_https_arn" {
  value = aws_alb_listener.https.arn
}

output "listener_http_arn" {
  value = aws_alb_listener.http.arn
}

output "dns_name" {
  value = aws_alb.alb.dns_name
}

output "id" {
  value = aws_alb.alb.id
}

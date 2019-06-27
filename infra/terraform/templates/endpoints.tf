# libsys

resource "aws_vpc_endpoint" "libsys" {
  vpc_id            = "${aws_vpc.wellcomecollection.id}"
  service_name      = "${var.service-libsys}"
  vpc_endpoint_type = "Interface"

  security_group_ids = [
    "${aws_security_group.interservice_security_group.id}",
  ]

  subnet_ids = [
    "${aws_subnet.private_a.id}",
    "${aws_subnet.private_b.id}",
  ]

  private_dns_enabled = false
}

resource "aws_route53_record" "libsys" {
  zone_id = "${aws_route53_zone.internal.zone_id}"
  name    = "libsys.${aws_route53_zone.internal.name}"
  type    = "CNAME"
  ttl     = "300"

  records = [
    "${lookup(aws_vpc_endpoint.libsys.dns_entry[0], "dns_name")}",
  ]
}

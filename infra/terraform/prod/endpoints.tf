# libsys

resource "aws_route53_zone" "internal" {
  name = "experience.internal."

  vpc {
    vpc_id = "${module.wellcomecollection.vpc_id}"
  }
}


# Consuming services will need this security group to talk with the libsys endpoint
resource "aws_security_group" "interservice" {
  name        = "libsys_interservice"
  description = "Allow traffic between services"
  vpc_id      = "${module.wellcomecollection.vpc_id}"

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  tags {
    Name = "libsys_interservice"
  }
}

locals {
  libsys_enpoint_service_name = "com.amazonaws.vpce.eu-west-1.vpce-svc-092f3a43194e6113a"
}

resource "aws_vpc_endpoint" "libsys" {
  vpc_id            = "${module.wellcomecollection.vpc_id}"
  service_name      = "${local.libsys_enpoint_service_name}"
  vpc_endpoint_type = "Interface"

  security_group_ids = [
    "${aws_security_group.interservice.id}",
  ]

  subnet_ids = [
    "${module.wellcomecollection.subnet-private-a}",
    "${module.wellcomecollection.subnet-private-b}",
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

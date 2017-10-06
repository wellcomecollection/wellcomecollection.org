resource "aws_vpc" "wellcomecollection" {
  # 172.20.0.0 - 172.20.255.255
  cidr_block           = "172.20.0.0/16"
  enable_dns_hostnames = true

  tags {
    Name = "wellcomecollection"
  }
}

resource "aws_internet_gateway" "wellcomecollection" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-igw"
  }
}

resource "aws_route" "public_a" {
  route_table_id         = "${aws_route_table.public_a.id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.wellcomecollection.id}"
}

resource "aws_route" "public_b" {
  route_table_id         = "${aws_route_table.public_b.id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.wellcomecollection.id}"
}

# TODO: You can use modules to do this
# Availability Zone A
# Public
resource "aws_subnet" "public_a" {
  vpc_id                  = "${aws_vpc.wellcomecollection.id}"
  cidr_block              = "172.20.0.0/20"                    # 172.20.0.0 - 172.20.15.255
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true

  tags {
    Name = "wellcomecollection-public-a"
  }
}

resource "aws_route_table" "public_a" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-public-a"
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = "${element(aws_subnet.public_a.*.id, count.index)}"
  route_table_id = "${aws_route_table.public_a.id}"
}

# Private
resource "aws_subnet" "private_a" {
  vpc_id                  = "${aws_vpc.wellcomecollection.id}"
  cidr_block              = "172.20.16.0/20"                   # 172.20.16.0 - 172.20.31.255
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = false

  tags {
    Name = "wellcomecollection-private-a"
  }
}

resource "aws_route_table" "private_a" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-private-a"
  }
}

resource "aws_route_table_association" "private_a" {
  subnet_id      = "${element(aws_subnet.private_a.*.id, count.index)}"
  route_table_id = "${aws_route_table.private_a.id}"
}

# 172.20.32.0/20 Potential data layer
# 172.20.48.0/20 Spare

# Availability Zone B
# Public
resource "aws_subnet" "public_b" {
  vpc_id                  = "${aws_vpc.wellcomecollection.id}"
  cidr_block              = "172.20.64.0/20"                   # 172.20.64.0 - 172.20.127.255
  availability_zone       = "eu-west-1b"
  map_public_ip_on_launch = true

  tags {
    Name = "wellcomecollection-public-b"
  }
}

resource "aws_route_table" "public_b" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-public-b"
  }
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = "${element(aws_subnet.public_b.*.id, count.index)}"
  route_table_id = "${aws_route_table.public_b.id}"
}

# Private
resource "aws_subnet" "private_b" {
  vpc_id                  = "${aws_vpc.wellcomecollection.id}"
  cidr_block              = "172.20.80.0/20"                   # 172.20.80.0 - 172.20.95.255
  availability_zone       = "eu-west-1b"
  map_public_ip_on_launch = false

  tags {
    Name = "wellcomecollection-private-b"
  }
}

resource "aws_route_table" "private_b" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-private-b"
  }
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = "${element(aws_subnet.private_b.*.id, count.index)}"
  route_table_id = "${aws_route_table.private_b.id}"
}

output "vpc_id" {
  value = "${aws_vpc.wellcomecollection.id}"
}

output "vpc_subnets" {
  value = ["${aws_subnet.public_a.*.id}", "${aws_subnet.public_b.*.id}"]
}

# 172.20.96.0/20 Potential data layer
# 172.20.112.0/20 Spare


# For zone c
# 172.20.128.0/20 Public App
# 172.20.144.0/20 Private App
# 172.20.160.0/20 Data
# 172.20.176.0/20 Spare


# 172.20.192.0/18 Completely Spare


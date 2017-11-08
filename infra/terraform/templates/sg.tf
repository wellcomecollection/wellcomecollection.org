resource "aws_security_group" "http" {
  name        = "allow-http"
  description = "Allow http traffic"
  vpc_id      = "${aws_vpc.wellcomecollection.id}"

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }
}

resource "aws_security_group" "docker" {
  name        = "docker"
  description = "Allow all docker ports"
  vpc_id      = "${aws_vpc.wellcomecollection.id}"

  # HTTP
  ingress {
    from_port   = 32768
    to_port     = 61000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 32768
    to_port     = 61000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "https" {
  name        = "allow-http-s"
  description = "Allow https traffic"
  vpc_id      = "${aws_vpc.wellcomecollection.id}"

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }
}

resource "aws_security_group" "node_app_port" {
  name        = "allow-3000"
  description = "Allow node app (:3000) traffic"
  vpc_id      = "${aws_vpc.wellcomecollection.id}"

  # Our apps run on port 3000
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ssh_in" {
  name        = "ssh-in"
  description = "Used to allow SSH access"
  vpc_id      = "${aws_vpc.wellcomecollection.id}"

  # HTTP SSH from anywhere
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "https_sg_id" {
  value = "${aws_security_group.https.id}"
}

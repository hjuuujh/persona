resource "aws_instance" "app-private" {
  ami = "ami-0c9c942bd7bf113a2"

  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.private-subnet.0.id
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.private-sg.id]
  depends_on             = [aws_security_group.private-sg]

  tags = {
    Name = "Persona App"
  }
}

resource "aws_instance" "private" {
  ami = "ami-0c9c942bd7bf113a2"

  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.private-subnet.0.id
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.private-sg.id]
  depends_on             = [aws_security_group.private-sg]

  tags = {
    Name = "Persona Backend"
  }
}

resource "aws_instance" "jenkins" {
  ami = "ami-0c9c942bd7bf113a2"

  instance_type          = "m5.large"
  subnet_id              = aws_subnet.app-subnet.0.id
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.app-sg.id]

  depends_on = [aws_security_group.app-sg]
  tags = {
    Name = "Jenkins"
  }
}

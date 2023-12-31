# app 용 sg생성, 관리자용 ssh 22, react용 3000, alb용 http 80 https 443 open
# alb 나중에 생성후 route53 연결 필요, redirect로 수정 필요
resource "aws_security_group" "app-sg" {
  name   = "app-sg"
  vpc_id = aws_vpc.persona-vpc.id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    # 서로열어야해서 하나씩 설정
    cidr_blocks = [var.my_ip]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-sg"
  }
}


# private용 sg생성, 관리자용 ssh 22, 프론트엔드에서 요청받을 8080필요 (app sg에서만 접근가능)
resource "aws_security_group" "private-sg" {
  name   = "private-sg"
  vpc_id = aws_vpc.persona-vpc.id

  ingress {
    from_port = 22
    to_port   = 22
    protocol  = "tcp"

    security_groups = ["${aws_security_group.app-sg.id}"]
  }
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = ["${aws_security_group.app-sg.id}"]
  }

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = ["${aws_security_group.app-sg.id}"]
  }

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = ["${aws_security_group.alb-sg.id}"]
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = ["${aws_security_group.alb-sg.id}"]
  }

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = ["${aws_security_group.alb-sg.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "private-sg"
  }
}

# db용 sg생성, 관리자용 ssh 22, 백엔드에서 db 요청받을 3306필요 (private sg에서만 접근가능)
resource "aws_security_group" "db-sg" {
  name   = "db-sg"
  vpc_id = aws_vpc.persona-vpc.id

  ingress {
    from_port = 3306
    to_port   = 3306
    protocol  = "tcp"
    /* cidr_blocks = ["0.0.0.0/0"] */

    security_groups = ["${aws_security_group.private-sg.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db-sg"
  }
}

resource "aws_security_group" "alb-sg" {
  name   = "alb-sg"
  vpc_id = aws_vpc.persona-vpc.id


  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb-sg"
  }
}

resource "aws_security_group" "asg-sg" {
  name   = "asg-sg"
  vpc_id = aws_vpc.persona-vpc.id

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = ["${aws_security_group.private-sg.id}"]
  }

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = ["${aws_security_group.private-sg.id}"]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = ["${aws_security_group.alb-sg.id}"]
  }

}

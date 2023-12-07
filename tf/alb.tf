resource "aws_alb_target_group" "frontend-80" {
  name     = "frontend-target-group-80"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.persona-vpc.id

  health_check {
    interval            = 30
    path                = "/"
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }

  tags = { Name = "Frontend Target Group" }
}

resource "aws_alb_target_group_attachment" "frontend-80" {
  target_group_arn = aws_alb_target_group.frontend-80.arn
  target_id        = aws_instance.app-private.id
  depends_on       = [aws_alb_target_group.frontend-80]
  port             = 80
}

resource "aws_alb_target_group" "backend-8080" {
  name     = "backend-target-group-8080"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.persona-vpc.id

  health_check {
    interval            = 30
    path                = "/hello"
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }

  tags = { Name = "Backend Target Group" }
}

resource "aws_alb_target_group_attachment" "backend-8080" {
  target_group_arn = aws_alb_target_group.backend-8080.arn
  target_id        = aws_instance.private.id
  depends_on       = [aws_alb_target_group.backend-8080]
  port             = 8080
}

resource "aws_alb" "persona-alb" {
  name               = "persona-alb"
  internal           = false
  security_groups    = [aws_security_group.alb-sg.id]
  load_balancer_type = "application"
  ip_address_type    = "ipv4"
  subnets            = [aws_subnet.app-subnet.0.id, aws_subnet.app-subnet.1.id]

  tags = {
    Name = "Persona Alb"
  }


  lifecycle { create_before_destroy = true }
}

# alb의 리스너
resource "aws_alb_listener" "listner-80" {
  load_balancer_arn = aws_alb.persona-alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_alb_listener" "listner-443" {
  load_balancer_arn = aws_alb.persona-alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:ap-northeast-2:699829773896:certificate/4530051d-9465-462b-ba0d-e9cb65df4f91"

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.frontend-80.arn
  }
}

resource "aws_lb_listener_certificate" "alb-certificate" {
  listener_arn    = aws_alb_listener.listner-443.arn
  certificate_arn = "arn:aws:acm:ap-northeast-2:699829773896:certificate/4530051d-9465-462b-ba0d-e9cb65df4f91"
}

resource "aws_alb_listener_rule" "http-static-80" {
  listener_arn = aws_alb_listener.listner-80.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.frontend-80.arn
  }

  condition {
    host_header {
      values = ["www.ratee.net"]
    }
  }
}

resource "aws_alb_listener_rule" "static-80" {
  listener_arn = aws_alb_listener.listner-443.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.frontend-80.arn
  }

  condition {
    host_header {
      values = ["www.ratee.net"]
    }
  }
}

resource "aws_alb_listener_rule" "static-8080" {
  listener_arn = aws_alb_listener.listner-443.arn
  priority     = 99

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.backend-8080.arn
  }

  condition {
    host_header {
      values = ["api.ratee.net"]
    }
  }
}

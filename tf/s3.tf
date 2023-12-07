resource "aws_s3_bucket_acl" "example" {
  depends_on = [
    aws_s3_bucket_ownership_controls.example,
    aws_s3_bucket_public_access_block.example,
  ]

  bucket = aws_s3_bucket.bucket-for-persona.id
  acl    = "public-read-write"
}

resource "aws_s3_bucket" "bucket-for-persona" {
  bucket = "bucket-for-persona"

  tags = {
    Name        = "bucket-for-persona"
    Environment = "Dev"
  }
}
resource "aws_s3_bucket" "raw-profile-image" {
  bucket = "raw-profile-image"

  tags = {
    Name = "raw-profile-image"
  }
}

resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = aws_s3_bucket.bucket-for-persona.id
  policy = data.aws_iam_policy_document.allow_access_from_another_account.json
}
data "aws_iam_policy_document" "allow_access_from_another_account" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["699829773896"]
    }

    actions = [
      "s3:*"
    ]

    resources = [
      aws_s3_bucket.bucket-for-persona.arn,
      "${aws_s3_bucket.bucket-for-persona.arn}/*",
    ]
    effect = "Allow"
  }
}

resource "aws_s3_bucket_ownership_controls" "example" {
  bucket = aws_s3_bucket.bucket-for-persona.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}
resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.bucket-for-persona.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket" "persona-tf-state" {
  bucket = "persona-tf-state"

  tags = {
    Name = "persona-tf-state"
  }
}
resource "aws_s3_bucket_ownership_controls" "persona-tf-state-ownership" {
  bucket = aws_s3_bucket.persona-tf-state.id

  rule {
    object_ownership = "ObjectWriter"
  }
}




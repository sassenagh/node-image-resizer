data "aws_region" "current" {}

output "aws_region" {
  value = data.aws_region.current.name
}

output "aws_provider_region" {
  value = var.aws_region != null ? var.aws_region : "NO_DEFINED"
}

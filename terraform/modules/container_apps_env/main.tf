variable "name" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "log_analytics_workspace_id" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

resource "azurerm_container_app_environment" "cae" {
  name                       = var.name
  location                   = var.location
  resource_group_name        = var.resource_group_name
  log_analytics_workspace_id = var.log_analytics_workspace_id
  tags                       = var.tags
}

output "id" {
  value = azurerm_container_app_environment.cae.id
}

output "default_domain" {
  value = azurerm_container_app_environment.cae.default_domain
}

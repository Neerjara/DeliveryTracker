terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "location" {
  type    = string
  default = "eastus"
}

variable "backend_image" {
  type    = string
  default = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
}

variable "frontend_image" {
  type    = string
  default = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
}

locals {
  tags = {
    Environment = var.environment
    Project     = "DeliveryTracker"
    ManagedBy   = "Terraform"
  }
}

data "azurerm_client_config" "current" {}

module "resource_group" {
  source   = "../../modules/resource_group"
  name     = "rg-deliverytracker-${var.environment}-${var.location}"
  location = var.location
  tags     = local.tags
}

module "app_insights" {
  source              = "../../modules/app_insights"
  name                = "deliverytracker-${var.environment}"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  tags                = local.tags
}

module "key_vault" {
  source              = "../../modules/key_vault"
  name                = "kv-dt-${var.environment}-01"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  tenant_id           = data.azurerm_client_config.current.tenant_id
  tags                = local.tags
}

module "container_registry" {
  source              = "../../modules/container_registry"
  name                = "crdeliverytracker${var.environment}01"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  sku                 = "Standard"
  tags                = local.tags
}

module "container_apps_env" {
  source                      = "../../modules/container_apps_env"
  name                        = "cae-deliverytracker-${var.environment}"
  resource_group_name         = module.resource_group.name
  location                    = module.resource_group.location
  log_analytics_workspace_id  = module.app_insights.log_analytics_workspace_id
  tags                        = local.tags
}

module "backend_app" {
  source                        = "../../modules/container_app"
  name                          = "ca-deliverytracker-backend-${var.environment}"
  resource_group_name           = module.resource_group.name
  container_app_environment_id = module.container_apps_env.id
  image                         = var.backend_image
  target_port                   = 5000
  cpu                           = 0.5
  memory                        = "1.0Gi"
  registry_server               = module.container_registry.login_server
  registry_username             = module.container_registry.admin_username
  registry_password             = module.container_registry.admin_password
  env_vars = {
    "ASPNETCORE_ENVIRONMENT"                = "Development"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.app_insights.connection_string
  }
  tags = local.tags
}

module "frontend_app" {
  source                        = "../../modules/container_app"
  name                          = "ca-deliverytracker-frontend-${var.environment}"
  resource_group_name           = module.resource_group.name
  container_app_environment_id = module.container_apps_env.id
  image                         = var.frontend_image
  target_port                   = 80
  cpu                           = 0.25
  memory                        = "0.5Gi"
  registry_server               = module.container_registry.login_server
  registry_username             = module.container_registry.admin_username
  registry_password             = module.container_registry.admin_password
  env_vars = {
    "VITE_API_BASE_URL" = "https://${module.backend_app.fqdn}/api"
  }
  tags = local.tags
}

output "frontend_url" {
  value = "https://${module.frontend_app.fqdn}"
}

output "backend_swagger_url" {
  value = "https://${module.backend_app.fqdn}/swagger"
}

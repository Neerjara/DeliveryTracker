variable "name" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "container_app_environment_id" {
  type = string
}

variable "image" {
  type = string
}

variable "target_port" {
  type = number
}

variable "cpu" {
  type    = number
  default = 0.5
}

variable "memory" {
  type    = string
  default = "1.0Gi"
}

variable "registry_server" {
  type = string
}

variable "registry_username" {
  type = string
}

variable "registry_password" {
  type      = string
  sensitive = true
}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "tags" {
  type    = map(string)
  default = {}
}

resource "azurerm_container_app" "app" {
  name                         = var.name
  container_app_environment_id = var.container_app_environment_id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"
  tags                         = var.tags

  identity {
    type = "SystemAssigned"
  }

  secret {
    name  = "registry-password"
    value = var.registry_password
  }

  registry {
    server               = var.registry_server
    username             = var.registry_username
    password_secret_name = "registry-password"
  }

  ingress {
    external_enabled = true
    target_port      = var.target_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    container {
      name   = var.name
      image  = var.image
      cpu    = var.cpu
      memory = var.memory

      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
}

output "fqdn" {
  value = azurerm_container_app.app.ingress[0].fqdn
}

output "principal_id" {
  value = azurerm_container_app.app.identity[0].principal_id
}

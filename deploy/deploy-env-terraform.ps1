param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('dev', 'uat', 'prod')]
    [string]$Environment,

    [string]$Location = "eastus"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Terraform Azure Landing Zone Deployment for [$Environment] environment..." -ForegroundColor Cyan

# 1. Check Azure Login
$azAccount = Get-Command az -ErrorAction SilentlyContinue
if (-not $azAccount) {
    Write-Error "Azure CLI ('az') is not installed or not in PATH."
}

Write-Host "Verifying Azure CLI authentication status..." -ForegroundColor Yellow
az account show --output none
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Azure using 'az login'" -ForegroundColor Red
    az login
}

# 2. Run Terraform for target environment
$envDir = "terraform/environments/$Environment"
if (-not (Test-Path $envDir)) {
    Write-Error "Environment directory '$envDir' not found."
}

Write-Host "Initializing Terraform in $envDir..." -ForegroundColor Yellow
Push-Location $envDir

try {
    terraform init
    if ($LASTEXITCODE -ne 0) { throw "Terraform init failed." }

    Write-Host "Applying Terraform configuration for $Environment..." -ForegroundColor Green
    terraform apply -auto-approve -var="environment=$Environment" -var="location=$Location"
    if ($LASTEXITCODE -ne 0) { throw "Terraform apply failed." }

    Write-Host "🎉 Successfully deployed DeliveryTracker Landing Zone [$Environment]!" -ForegroundColor Green
}
finally {
    Pop-Location
}

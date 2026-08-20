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

# 2. Run Terraform Base Infrastructure setup
$envDir = "terraform/environments/$Environment"
if (-not (Test-Path $envDir)) {
    Write-Error "Environment directory '$envDir' not found."
}

Write-Host "Step 1: Initializing & Applying Base Infrastructure (ACR, Key Vault, App Insights)..." -ForegroundColor Yellow
Push-Location $envDir

try {
    terraform init
    if ($LASTEXITCODE -ne 0) { throw "Terraform init failed." }

    terraform apply -auto-approve -var="environment=$Environment" -var="location=$Location"
    if ($LASTEXITCODE -ne 0) { throw "Base terraform apply failed." }

    $acrName = "crdeliverytracker${Environment}01"
    Write-Host "Step 2: Building Backend Docker Image in cloud ACR ($acrName)..." -ForegroundColor Yellow
    Pop-Location
    az acr build --registry $acrName --image "deliverytracker-backend:latest" ./backend
    if ($LASTEXITCODE -ne 0) { throw "Backend ACR build failed." }

    Write-Host "Step 3: Building Frontend Docker Image in cloud ACR ($acrName)..." -ForegroundColor Yellow
    az acr build --registry $acrName --image "deliverytracker-frontend:latest" ./frontend
    if ($LASTEXITCODE -ne 0) { throw "Frontend ACR build failed." }

    Write-Host "Step 4: Updating Container Apps with newly built Docker images..." -ForegroundColor Yellow
    Push-Location $envDir
    $acrServer = "$acrName.azurecr.io"
    terraform apply -auto-approve `
        -var="environment=$Environment" `
        -var="location=$Location" `
        -var="backend_image=$acrServer/deliverytracker-backend:latest" `
        -var="frontend_image=$acrServer/deliverytracker-frontend:latest"

    Write-Host "🎉 Successfully built Docker images & deployed Container Apps [$Environment]!" -ForegroundColor Green
}
finally {
    Pop-Location
}

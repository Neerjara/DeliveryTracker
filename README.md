# DeliveryTracker Enterprise Azure Landing Zone (DEV ➔ UAT ➔ PROD)

A full-stack, enterprise-grade microservices & analytics architecture deployed to **Azure Container Apps** across isolated **DEV**, **UAT**, and **PROD** environments using **Terraform**, **GitHub Actions**, and **dbt Data Warehouse**.

---

## 🏗️ Architecture Diagram

```text
                               ┌──────────────────────┐
                               │      Developers      │
                               │ GitHub / Git         │
                               └──────────┬───────────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │   GitHub Actions     │
                               │                      │
                               │ Build → Test → Scan  │
                               │ → Package → Deploy   │
                               └──────────┬───────────┘
                                          │
                         ┌────────────────┼────────────────┐
                         │ (Dev Trigger)  │ (UAT Approval) │ (Prod Approval)
                         ▼                ▼                ▼
                   ┌──────────┐     ┌──────────┐     ┌──────────┐
                   │ DEV Env  │     │ UAT Env  │     │ PROD Env │
                   └────┬─────┘     └────┬─────┘     └────┬─────┘
                        │                │                │
     ┌──────────────────┼────────────────┴────────────────┼──────────────────┐
     │                  │                                 │                  │
     ▼                  ▼                                 ▼                  ▼
┌──────────┐      ┌──────────┐                      ┌───────────┐      ┌─────────────┐
│ Frontend │      │ .NET     │                      │   dbt     │      │ Data        │
│ (React)  │      │ Backend  │                      │ Pipeline  │ ───> │ Warehouse   │
└────┬─────┘      └────┬─────┘                      └─────┬─────┘      │ (Databricks)│
     │                 │                                  │            └─────────────┘
     └────────┬────────┘                                  │
              ▼                                           ▼
┌──────────────────────────┐                      ┌─────────────┐
│ Azure Container Apps     │                      │ Delta Lake  │
│ (Managed Environment)    │                      │ Data Store  │
└────────────┬─────────────┘                      └─────────────┘
             │
 ┌───────────┼────────────────┬──────────────────┐
 │           │                │                  │
 ▼           ▼                ▼                  ▼
┌──────────┐ ┌──────────┐ ┌───────────────┐ ┌──────────┐
│Key Vault │ │Entra ID  │ │App Insights   │ │Virtual   │
│(Secrets) │ │(Identity)│ │+ Log Analytics│ │Network   │
└──────────┘ └──────────┘ └───────────────┘ └──────────┘
```

---

## 📂 Repository Layout

```text
DeliveryTracker/
├── .github/
│   └── workflows/
│       └── cd-deploy-environments.yml # Automated CI/CD (DEV -> UAT -> PROD with Manual Gate)
├── terraform/                         # Infrastructure as Code
│   ├── modules/
│   │   ├── resource_group/            # Isolated RG per environment
│   │   ├── container_registry/        # Azure Container Registry (ACR)
│   │   ├── container_apps_env/        # Container Apps Environment
│   │   ├── container_app/             # Container App resource definition
│   │   ├── key_vault/                 # Azure Key Vault for secrets
│   │   └── app_insights/              # App Insights + Log Analytics
│   └── environments/                  # Environment configurations
│       ├── dev/                       # DEV environment (main.tf)
│       ├── uat/                       # UAT environment (main.tf)
│       └── prod/                      # PROD environment (main.tf)
├── dbt_warehouse/                     # dbt Data Analytics Pipeline
│   ├── dbt_project.yml
│   ├── profiles.yml
│   ├── models/
│   │   ├── staging/stg_orders.sql
│   │   └── marts/fct_order_deliveries.sql
│   └── tests/assert_order_amount_positive.sql
├── deploy/
│   └── deploy-env-terraform.ps1       # Automated local PowerShell deployment
├── backend/                           # ASP.NET Core Web API + xUnit unit tests
└── frontend/                          # React + TypeScript SPA dashboard
```

---

## ⚡ Deployment Instructions

### 1. Deploy via PowerShell CLI
Deploy a specific environment (`dev`, `uat`, or `prod`) locally using Terraform:

```powershell
# Deploy DEV Environment
.\deploy\deploy-env-terraform.ps1 -Environment dev

# Deploy UAT Environment
.\deploy\deploy-env-terraform.ps1 -Environment uat

# Deploy PROD Environment
.\deploy\deploy-env-terraform.ps1 -Environment prod
```

---

### 2. CI/CD via GitHub Actions

The pipeline (`.github/workflows/cd-deploy-environments.yml`) executes:
1. **CI**: Runs xUnit backend unit tests (`dotnet test`).
2. **DEV**: Automatically deploys infrastructure and microservices to DEV on push to `main`.
3. **UAT**: Automatically deploys to UAT environment after successful DEV stage.
4. **PROD**: Requires **Manual Approval** in GitHub Environments before deploying to PROD.

---

### 3. Run dbt Data Transformations

Run your dbt analytics pipeline against Databricks / Delta Lake:

```bash
cd dbt_warehouse

# Run staging and mart models for DEV environment
dbt run --target dev

# Run data quality tests
dbt test --target dev
```

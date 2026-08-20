# Setting Up Azure OIDC Authentication for GitHub Actions

Using **OpenID Connect (OIDC)** allows GitHub Actions workflows to provision Azure resources securely via Terraform without needing long-lived client secret keys.

---

## 1. Create an Azure AD Application & Service Principal

Run the following commands using Azure CLI (`az`):

```bash
# Set your active subscription
az account set --subscription "<YOUR_AZURE_SUBSCRIPTION_ID>"

# Create an Azure AD App Registration
APP_ID=$(az ad app create --display-name "github-actions-deliverytracker" --query appId -o tsv)

# Create a Service Principal for the App
az ad sp create --id $APP_ID

# Assign Contributor role to the Subscription for resource creation
az role assignment create \
  --role "Contributor" \
  --assignee $APP_ID \
  --subscription "<YOUR_AZURE_SUBSCRIPTION_ID>"
```

---

## 2. Configure Federated Credentials for GitHub Actions

Connect your GitHub repository to the Azure App:

```bash
# Federated credential for GitHub Actions main branch deployments
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-main-branch",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>:ref:refs/heads/main",
    "description": "GitHub Actions main branch execution",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Federated credential for Pull Requests
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-actions-pull-requests",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>:pull_request",
    "description": "GitHub Actions PR validation",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

---

## 3. Add GitHub Repository Secrets

In your GitHub Repository ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions**, add:

| Secret Name | Description / Value |
|---|---|
| `AZURE_CLIENT_ID` | `$APP_ID` (Application ID created above) |
| `AZURE_TENANT_ID` | Your Azure Active Directory Tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Your Azure Subscription ID |

---

## 4. GitHub Environment Approval Gates Setup

In GitHub ➔ **Settings** ➔ **Environments**:
1. Create environment `dev` (No protection rules).
2. Create environment `uat` (No protection rules).
3. Create environment `production` ➔ Enable **Required reviewers** (Add your GitHub username or team leads).

Now, whenever code merges to `main`:
- DEV & UAT resources are automatically provisioned/updated by Terraform via GitHub Actions.
- PROD deployment pauses until approved in GitHub UI!

# Variables - EDIT THESE VALUES
$resourceGroup = "hrm-app-rg"
$location = "eastus"
$appServicePlan = "hrm-app-plan"
$frontendAppName = "hrm-frontend-app"  # Must be globally unique

Write-Host "Starting Azure deployment for HRM Management System..." -ForegroundColor Green

# Login to Azure
Write-Host "Logging into Azure..." -ForegroundColor Yellow
az login

# Create Resource Group
Write-Host "Creating resource group..." -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

# Create App Service Plan
Write-Host "Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku B1 --is-linux

# Create Frontend Web App (Static Web App would be better, but using App Service for simplicity)
Write-Host "Creating frontend web app..." -ForegroundColor Yellow
az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $frontendAppName --runtime "NODE|18-lts"

Write-Host "Azure resources created successfully!" -ForegroundColor Green
Write-Host "Frontend App: https://$frontendAppName.azurewebsites.net" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Deploy frontend code: Run deploy-frontend.ps1"
Write-Host "2. Test the application"
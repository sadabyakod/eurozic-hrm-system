# Frontend deployment script
$resourceGroup = "hrm-app-rg"
$frontendAppName = "hrm-frontend-app"  # Must match the name from deploy-azure.ps1

Write-Host "Preparing HRM frontend for deployment..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location "C:\Users\sadab\OneDrive\AIChatBot\frontend"

# Build the React app for production
Write-Host "Building React app for production..." -ForegroundColor Yellow
npm run build

# Create deployment package from build folder
Write-Host "Creating deployment package..." -ForegroundColor Yellow
Set-Location "build"
if (Test-Path "..\frontend-deploy.zip") { Remove-Item "..\frontend-deploy.zip" }
Compress-Archive -Path "*" -DestinationPath "..\frontend-deploy.zip" -Force
Set-Location ".."

# Deploy to Azure
Write-Host "Uploading frontend to Azure App Service..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group $resourceGroup --name $frontendAppName --src "frontend-deploy.zip"

# Clean up
Remove-Item "frontend-deploy.zip"

Write-Host "Frontend deployment completed!" -ForegroundColor Green
Write-Host "Frontend URL: https://$frontendAppName.azurewebsites.net" -ForegroundColor Cyan

# Test the deployment
Write-Host "Testing frontend deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest "https://$frontendAppName.azurewebsites.net" -UseBasicParsing
    Write-Host "Frontend is responding: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend might still be starting up. Check in a few minutes." -ForegroundColor Yellow
}

Write-Host "`nDeployment Summary:" -ForegroundColor Yellow
Write-Host "Frontend: https://$frontendAppName.azurewebsites.net" -ForegroundColor Cyan
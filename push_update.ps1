# Push Vite config fix to GitHub
Write-Host "Adding changes..."
git add .

Write-Host "Committing changes..."
git commit -m "Fixed SPA routing - added historyApiFallback to Vite config"

Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "Push complete!"

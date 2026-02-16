# Push DeepFake link to GitHub
Write-Host "Adding changes..."
git add .

Write-Host "Committing changes..."
git commit -m "Added DeepFake link to header navigation (desktop and mobile)"

Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "Push complete!"

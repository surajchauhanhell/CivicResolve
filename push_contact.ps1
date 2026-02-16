# Push contact info updates to GitHub
Write-Host "Adding changes..."
git add .

Write-Host "Committing changes..."
git commit -m "Updated contact information - Indian phone number and Mumbai address"

Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "Push complete!"

# Add and push changes to GitHub
Write-Host "Adding changes..."
git add .

Write-Host "Committing changes..."
git commit -m "Updated officer panel with statistics and improved sign-in button visibility"

Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "Push complete!"

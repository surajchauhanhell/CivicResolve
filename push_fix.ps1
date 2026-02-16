# Fix Vercel build and push
Write-Host "Adding changes..."
git add .

Write-Host "Committing changes..."
git commit -m "Fixed Vercel build error - removed invalid config and added vercel.json for SPA routing"

Write-Host "Pushing to GitHub..."
git push origin main

Write-Host "Push complete!"

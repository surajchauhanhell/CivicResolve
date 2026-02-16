# Complete GitHub push script
Write-Host "Starting GitHub push process..."

# Add all files
Write-Host "Adding all files to git..."
git add .

# Commit
Write-Host "Committing changes..."
git commit -m "Initial commit: Civic Resolve application"

# Check current branch
$currentBranch = git branch --show-current

# If no branch exists or not on main, create/switch to main
if ([string]::IsNullOrEmpty($currentBranch) -or $currentBranch -ne "main") {
    Write-Host "Switching to main branch..."
    git checkout -b main
}

# Set remote origin
Write-Host "Configuring remote origin..."
$remoteExists = git remote | Select-String "origin"
if ($remoteExists) {
    git remote set-url origin https://github.com/surajchauhanhell/CivicResolve.git
}
else {
    git remote add origin https://github.com/surajchauhanhell/CivicResolve.git
}

# Force push to GitHub
Write-Host "Pushing to GitHub..."
git push -f origin main

Write-Host "Push complete!"

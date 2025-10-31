param(
    [Parameter(Mandatory = $true)]
    [string]$CommitMessage
)

# Git add all changes
Write-Host "Adding all changes..." -ForegroundColor Cyan
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to add files" -ForegroundColor Red
    exit 1
}

# Git commit
Write-Host "Committing changes with message: '$CommitMessage'" -ForegroundColor Cyan
git commit -m "$CommitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to commit changes" -ForegroundColor Red
    exit 1
}

# Git push
# Write-Host "Pushing to remote..." -ForegroundColor Cyan
# git push

# if ($LASTEXITCODE -ne 0) {
#     Write-Host "Error: Failed to push changes" -ForegroundColor Red
#     exit 1
# }

# Write-Host "Successfully pushed changes!" -ForegroundColor Green

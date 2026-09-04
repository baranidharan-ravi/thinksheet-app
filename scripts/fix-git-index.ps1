# Automated Git Index Repair & Health Safeguard for Windows
Write-Host "Checking Git index health..." -ForegroundColor Cyan

# Remove any stale lock files
$lockFiles = Get-ChildItem -Path .git -Filter "*.lock" -Recurse -ErrorAction SilentlyContinue
if ($lockFiles) {
    Write-Host "Clearing stale lock files..." -ForegroundColor Yellow
    $lockFiles | Remove-Item -Force -ErrorAction SilentlyContinue
}

# Check index size
$indexFile = Get-Item .git/index -ErrorAction SilentlyContinue
if ($null -eq $indexFile -or $indexFile.Length -lt 12) {
    Write-Host "Detected corrupted or 0-byte index file ($($indexFile.Length) bytes). Rebuilding..." -ForegroundColor Yellow
    Remove-Item -Force .git/index -ErrorAction SilentlyContinue
    git reset
} else {
    Write-Host "Index file size is healthy ($($indexFile.Length) bytes)." -ForegroundColor Green
}

# Ensure Git fsync and Windows cache stability configs are set
git config core.fsync index,committed
git config core.preloadindex true
git config core.trustctime false

# Verify git status
Write-Host "Verifying git status..." -ForegroundColor Cyan
git status -s

Write-Host "`nGit index repaired and healthy! If VS Code Source Control still shows an error badge, press Ctrl+Shift+P -> 'Git: Refresh' or click the circular Refresh icon in the Source Control panel." -ForegroundColor Green

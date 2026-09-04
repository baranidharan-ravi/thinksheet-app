# Automated Git Index Repair & Health Safeguard for Windows
Write-Host "Checking Git index health..." -ForegroundColor Cyan

# 1. Remove any stale lock files (.git/index.lock, etc.)
$lockFiles = Get-ChildItem -Path .git -Filter "*.lock" -Recurse -ErrorAction SilentlyContinue
if ($lockFiles) {
    Write-Host "Clearing stale lock files..." -ForegroundColor Yellow
    $lockFiles | Remove-Item -Force -ErrorAction SilentlyContinue
}

# 2. Inspect index file integrity
$indexFile = Get-Item .git/index -ErrorAction SilentlyContinue
$isCorrupted = ($null -eq $indexFile -or $indexFile.Length -lt 12)

if ($isCorrupted) {
    $currentBytes = if ($indexFile) { $indexFile.Length } else { 0 }
    Write-Host "Detected corrupted or 0-byte index file ($currentBytes bytes). Healing index..." -ForegroundColor Yellow
    
    # Check if a clean backup exists for instant restoration
    $backup = Get-Item .git/index.clean_bak -ErrorAction SilentlyContinue
    if ($backup -and $backup.Length -ge 12) {
        Write-Host "Restoring from clean index backup ($($backup.Length) bytes)..." -ForegroundColor Cyan
        Copy-Item -Path .git/index.clean_bak -Destination .git/index -Force
    } else {
        Remove-Item -Force .git/index -ErrorAction SilentlyContinue
    }
    
    # Rebuild from HEAD
    git reset
} else {
    Write-Host "Index file size is healthy ($($indexFile.Length) bytes)." -ForegroundColor Green
}

# 3. Cache a clean backup copy of the healthy index
$refreshedIndex = Get-Item .git/index -ErrorAction SilentlyContinue
if ($refreshedIndex -and $refreshedIndex.Length -ge 12) {
    Copy-Item -Path .git/index -Destination .git/index.clean_bak -Force
}

# 4. Enforce stable Git index configurations on Windows (avoid fsync write hangs on secondary/external drives)
git config --unset core.fsync 2>$null
git config core.preloadindex false
git config core.trustctime false
git config index.version 2
git config core.fscache true

# 5. Verify git status
Write-Host "Verifying git status..." -ForegroundColor Cyan
git status -s

Write-Host "`nGit index repaired and healthy! If VS Code Source Control still shows an error badge, press Ctrl+Shift+P -> 'Git: Refresh' or click the circular Refresh icon in the Source Control panel." -ForegroundColor Green


# Kill processes on port 3001
$connections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
foreach ($conn in $connections) {
    $processId = $conn.OwningProcess
    if ($processId) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped process $processId"
    }
}

Start-Sleep 1

# Start backend
Set-Location "C:\Links-360\backend"
npm run dev
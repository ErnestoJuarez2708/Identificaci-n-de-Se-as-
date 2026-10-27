$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$tempRoot = [System.IO.Path]::GetFullPath($env:TEMP)
$junctionPath = Join-Path $tempRoot "asl-api-$PID"
$pythonPath = Join-Path $junctionPath ".venv\Scripts\python.exe"
$originalPythonUtf8 = $env:PYTHONUTF8
$hadPythonUtf8 = Test-Path Env:PYTHONUTF8
$locationPushed = $false
$exitCode = 1

if (-not (Test-Path (Join-Path $projectRoot ".venv\Scripts\python.exe"))) {
    throw "No se encontró el entorno virtual. Ejecuta 'uv sync' desde la carpeta del proyecto."
}

if ($junctionPath -match "[^\u0000-\u007F]") {
    throw "La ruta temporal contiene caracteres no ASCII. Configura TEMP en una ruta ASCII o mueve el proyecto a una ruta ASCII."
}

if (Test-Path -LiteralPath $junctionPath) {
    throw "Ya existe la ruta temporal '$junctionPath'; no se modificó."
}

$env:PYTHONUTF8 = "1"

try {
    New-Item -ItemType Junction -Path $junctionPath -Target $projectRoot | Out-Null
    Push-Location $junctionPath
    $locationPushed = $true

    & $pythonPath -m fastapi dev api.py
    $exitCode = $LASTEXITCODE
    if ($null -eq $exitCode) {
        $exitCode = 1
    }
}
finally {
    if ($locationPushed) {
        Pop-Location
    }

    if (Test-Path -LiteralPath $junctionPath) {
        & $env:ComSpec /c "rmdir `"$junctionPath`""
        if ($LASTEXITCODE -ne 0) {
            Write-Error "No se pudo quitar el acceso temporal '$junctionPath'."
        }
    }

    if ($hadPythonUtf8) {
        $env:PYTHONUTF8 = $originalPythonUtf8
    }
    else {
        Remove-Item Env:PYTHONUTF8 -ErrorAction SilentlyContinue
    }
}

exit $exitCode

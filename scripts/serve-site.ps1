param(
  [ValidateRange(1024, 65535)]
  [int]$Port = 8767
)

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$candidates = [Collections.Generic.List[object]]::new()

$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if (Test-Path -LiteralPath $bundledPython -PathType Leaf) {
  $candidates.Add([pscustomobject]@{ Command = $bundledPython; Prefix = @() })
}
foreach ($name in @('py', 'python', 'python3')) {
  $found = Get-Command $name -ErrorAction SilentlyContinue
  if ($found) {
    $prefix = if ($name -eq 'py') { @('-3') } else { @() }
    $candidates.Add([pscustomobject]@{ Command = $found.Source; Prefix = $prefix })
  }
}

$selected = $null
foreach ($candidate in $candidates) {
  try {
    $versionArgs = @($candidate.Prefix) + @('--version')
    $version = & $candidate.Command @versionArgs 2>&1
    if ($LASTEXITCODE -eq 0 -and (($version -join ' ') -match '^Python 3')) {
      $selected = $candidate
      break
    }
  } catch {
    continue
  }
}
if (!$selected) {
  throw 'Python 3 não foi encontrado. Instale Python 3 ou use a prévia pública do site.'
}

Write-Output "Prévia local: http://127.0.0.1:$Port/"
Write-Output 'Mantenha este terminal aberto; pressione Ctrl+C para encerrar.'
& $selected.Command @($selected.Prefix) -m http.server $Port --bind 127.0.0.1 --directory $projectRoot
exit $LASTEXITCODE

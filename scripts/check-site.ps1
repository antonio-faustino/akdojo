param(
  [string]$JavaScriptRuntime = 'node'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$html = [IO.File]::ReadAllText((Join-Path $projectRoot 'index.html'))
$problems = [Collections.Generic.List[string]]::new()
$ids = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)

foreach ($match in [regex]::Matches($html, '\bid="([^"]+)"')) {
  if (!$ids.Add($match.Groups[1].Value)) {
    $problems.Add("Duplicate ID: $($match.Groups[1].Value)")
  }
}

function Test-LocalReference([string]$reference, [string]$directory) {
  if (!$reference -or $reference -match '^(?:[a-z][a-z0-9+.-]*:|//)') { return }
  if ($reference.StartsWith('#')) {
    $anchor = [Uri]::UnescapeDataString($reference.Substring(1))
    if ($anchor -and !$ids.Contains($anchor)) { $problems.Add("Missing anchor: $reference") }
    return
  }
  $relative = [Uri]::UnescapeDataString(($reference -split '[?#]', 2)[0])
  $base = if ($relative.StartsWith('/')) { $projectRoot } else { $directory }
  $target = Join-Path $base $relative.TrimStart('/')
  if (!(Test-Path -LiteralPath $target -PathType Leaf)) {
    $problems.Add("Missing resource: $reference (from $directory)")
  }
}

foreach ($match in [regex]::Matches($html, '\b(?:src|href)="([^"]*)"')) {
  Test-LocalReference $match.Groups[1].Value $projectRoot
}
foreach ($match in [regex]::Matches($html, '\b(?:srcset|imagesrcset)="([^"]+)"')) {
  foreach ($candidate in ($match.Groups[1].Value -split ',')) {
    Test-LocalReference (($candidate.Trim() -split '\s+')[0]) $projectRoot
  }
}
foreach ($file in Get-ChildItem (Join-Path $projectRoot 'assets/css') -Filter '*.css') {
  foreach ($match in [regex]::Matches([IO.File]::ReadAllText($file.FullName), 'url\(\s*["'']?([^\s)"'']+)["'']?\s*\)')) {
    Test-LocalReference $match.Groups[1].Value $file.DirectoryName
  }
}
foreach ($match in [regex]::Matches($html, '(?s)<script type="application/ld\+json">(.*?)</script>')) {
  try { $null = $match.Groups[1].Value | ConvertFrom-Json }
  catch { $problems.Add('Invalid JSON-LD') }
}

$runtime = Get-Command $JavaScriptRuntime -ErrorAction SilentlyContinue
if ($runtime) {
  $scripts = @(Get-ChildItem (Join-Path $projectRoot 'assets/js') -Recurse -Filter '*.js')
  foreach ($file in $scripts) {
    & $runtime.Source --check $file.FullName | Out-Host
    if ($LASTEXITCODE -ne 0) { $problems.Add("Invalid JavaScript: $($file.Name)") }
  }
  Write-Output "JavaScript syntax checked: $($scripts.Count) files."
} else {
  Write-Warning 'Node.js unavailable: JavaScript syntax was not checked. Use -JavaScriptRuntime with an installed Node.js executable.'
}

if ($problems.Count) { throw ($problems -join [Environment]::NewLine) }
Write-Output "Local resources, anchors, unique IDs and JSON-LD validated. IDs: $($ids.Count)."

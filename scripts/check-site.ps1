param(
  [string]$JavaScriptRuntime = 'node'
)

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
$problems = [Collections.Generic.List[string]]::new()
$pageFiles = @('index.html', 'programas/index.html', 'quem-somos/index.html', 'transparencia/index.html', 'apoie/index.html')
$pages = @{}
$idsByPath = @{}
$totalIds = 0

foreach ($relative in $pageFiles) {
  $path = [IO.Path]::GetFullPath((Join-Path $projectRoot $relative))
  if (!(Test-Path -LiteralPath $path -PathType Leaf)) {
    $problems.Add("Missing page: $relative")
    continue
  }
  $html = [IO.File]::ReadAllText($path)
  $pages[$path] = $html
  $ids = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
  foreach ($match in [regex]::Matches($html, '\bid="([^"]+)"')) {
    if (!$ids.Add($match.Groups[1].Value)) { $problems.Add("Duplicate ID in ${relative}: $($match.Groups[1].Value)") }
  }
  $idsByPath[$path] = $ids
  $totalIds += $ids.Count
  if ([regex]::Matches($html, '<h1\b').Count -ne 1) { $problems.Add("Expected one H1 in $relative") }
  foreach ($match in [regex]::Matches($html, '(?s)<script type="application/ld\+json">(.*?)</script>')) {
    try { $null = $match.Groups[1].Value | ConvertFrom-Json }
    catch { $problems.Add("Invalid JSON-LD in $relative") }
  }
}

function Test-LocalReference([string]$reference, [string]$baseDirectory, [string]$sourcePath) {
  if (!$reference -or $reference -match '^(?:[a-z][a-z0-9+.-]*:|//)') { return }
  $pieces = $reference -split '#', 2
  $pathPart = [Uri]::UnescapeDataString(($pieces[0] -split '\?', 2)[0])
  $fragment = if ($pieces.Count -gt 1) { [Uri]::UnescapeDataString($pieces[1]) } else { '' }
  if (!$pathPart) {
    $target = $sourcePath
  } else {
    $directory = if ($pathPart.StartsWith('/')) { $projectRoot } else { $baseDirectory }
    $target = [IO.Path]::GetFullPath((Join-Path $directory $pathPart.TrimStart('/')))
    if ($target -ne $projectRoot -and !$target.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
      $problems.Add("Resource leaves project: $reference (from $sourcePath)")
      return
    }
    if (Test-Path -LiteralPath $target -PathType Container) { $target = Join-Path $target 'index.html' }
  }
  if (!(Test-Path -LiteralPath $target -PathType Leaf)) {
    $problems.Add("Missing resource: $reference (from $sourcePath)")
    return
  }
  if ($fragment -and $target.EndsWith('.html', [StringComparison]::OrdinalIgnoreCase)) {
    if (!$idsByPath.ContainsKey($target)) {
      $targetHtml = [IO.File]::ReadAllText($target)
      $targetIds = [Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
      foreach ($match in [regex]::Matches($targetHtml, '\bid="([^"]+)"')) { $null = $targetIds.Add($match.Groups[1].Value) }
      $idsByPath[$target] = $targetIds
    }
    if (!$idsByPath[$target].Contains($fragment)) { $problems.Add("Missing anchor: $reference (from $sourcePath)") }
  }
}

foreach ($path in $pages.Keys) {
  $html = $pages[$path]
  $baseDirectory = Split-Path $path -Parent
  $baseMatch = [regex]::Match($html, '<base href="([^"]+)"')
  if ($baseMatch.Success) {
    $baseDirectory = [IO.Path]::GetFullPath((Join-Path $baseDirectory $baseMatch.Groups[1].Value))
    $html = $html.Remove($baseMatch.Index, $baseMatch.Length)
  }
  foreach ($match in [regex]::Matches($html, '\b(?:src|href)="([^"]*)"')) {
    Test-LocalReference $match.Groups[1].Value $baseDirectory $path
  }
  foreach ($match in [regex]::Matches($html, '\b(?:srcset|imagesrcset)="([^"]+)"')) {
    foreach ($candidate in ($match.Groups[1].Value -split ',')) {
      Test-LocalReference (($candidate.Trim() -split '\s+')[0]) $baseDirectory $path
    }
  }
}

foreach ($file in Get-ChildItem (Join-Path $projectRoot 'assets/css') -Filter '*.css') {
  foreach ($match in [regex]::Matches([IO.File]::ReadAllText($file.FullName), 'url\(\s*["'']?([^\s)"'']+)["'']?\s*\)')) {
    Test-LocalReference $match.Groups[1].Value $file.DirectoryName $file.FullName
  }
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
Write-Output "Local resources, anchors, unique IDs and JSON-LD validated. Pages: $($pages.Count). IDs: $totalIds."

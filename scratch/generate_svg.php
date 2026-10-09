<?php
$pngPath = __DIR__ . '/../public/images/fondo-marcas.png';
$svgPath = __DIR__ . '/../public/images/fondo-marcas.svg';

if (!file_exists($pngPath)) {
    die("PNG not found\n");
}

$data = base64_encode(file_get_contents($pngPath));
$size = getimagesize($pngPath);
$w = $size[0];
$h = $size[1];

$svgContent = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 $w $h" width="100%" height="100%" preserveAspectRatio="none">
  <image width="$w" height="$h" preserveAspectRatio="none" xlink:href="data:image/png;base64,$data" href="data:image/png;base64,$data" />
</svg>
SVG;

file_put_contents($svgPath, $svgContent);
echo "Generated $svgPath successfully (Size: " . strlen($svgContent) . " bytes)\n";

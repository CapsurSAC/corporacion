<?php
$size = getimagesize(__DIR__ . '/../public/images/fondo-marcas.png');
echo "WIDTH=" . $size[0] . ", HEIGHT=" . $size[1] . ", MIME=" . $size['mime'] . "\n";

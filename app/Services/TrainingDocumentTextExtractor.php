<?php

namespace App\Services;

use Smalot\PdfParser\Parser;
use RuntimeException;
use ZipArchive;

class TrainingDocumentTextExtractor
{
    public function extract(string $path, string $mimeType): string
    {
        if ($mimeType === 'application/pdf') {
            $text = (new Parser())->parseFile($path)->getText();
        } elseif ($mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            $text = $this->extractDocx($path);
        } else {
            throw new RuntimeException('El formato del documento no es compatible.');
        }

        $text = trim(preg_replace('/[ \t]+/', ' ', preg_replace('/\R{3,}/', "\n\n", $text)) ?? '');
        if (mb_strlen($text) < 40) {
            throw new RuntimeException('No se pudo extraer suficiente texto. Verifica que el documento no sea un escaneo sin OCR.');
        }

        return $text;
    }

    protected function extractDocx(string $path): string
    {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            throw new RuntimeException('No se pudo abrir el documento Word.');
        }

        $xml = $zip->getFromName('word/document.xml');
        $zip->close();
        if ($xml === false) {
            throw new RuntimeException('El documento Word no contiene contenido legible.');
        }

        $xml = preg_replace('/<w:tab[^>]*\/>/', "\t", $xml) ?? $xml;
        $xml = preg_replace('/<\/w:p>/', "\n", $xml) ?? $xml;
        return html_entity_decode(strip_tags($xml), ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}

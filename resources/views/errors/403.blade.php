<!doctype html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Acceso no autorizado</title>
        @viteReactRefresh
        @vite(['resources/js/app.tsx', 'resources/css/app.css'])
    </head>
    <body>
        <div id="app"></div>
        <script>
            document.getElementById('app').innerHTML = '<main style="display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,sans-serif;text-align:center;padding:24px"><section><p style="color:#059669;font-weight:700">ERROR 403</p><h1>Acceso no autorizado</h1><p>{{ $message }}</p><a href="/capacitado">Volver a mi área</a></section></main>';
        </script>
    </body>
</html>
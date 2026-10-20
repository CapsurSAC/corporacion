<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class([
    'dark' => ($appearance ?? 'system') == 'dark',
    'light' => ($appearance ?? 'system') != 'dark',
])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to apply the initial color scheme before the app loads --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';
                const isDark = appearance === 'dark' ||
                    (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.classList.toggle('light', !isDark);
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                document.documentElement.setAttribute('data-mui-color-scheme', isDark ? 'dark' : 'light');
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/logo-app.png" sizes="any">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Dancing+Script:wght@600;700&display=swap" rel="stylesheet">
        <link rel="preload" as="image" href="/images/capsur-de-dia.jpeg">
        <link rel="preload" as="image" href="/images/capsur-de-noche.jpeg">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Grupo Capsur') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>

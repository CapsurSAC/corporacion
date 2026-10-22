import { Head, Link } from '@inertiajs/react';

export default function Forbidden({ message }: { message?: string }) {
    return (
        <>
            <Head title="Acceso no autorizado" />
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Error 403</p>
                    <h1 className="mt-3 text-3xl font-bold text-slate-900">Acceso no autorizado</h1>
                    <p className="mt-4 text-slate-600">{message || 'No tienes autorización para acceder a esta sección.'}</p>
                    <Link href="/capacitado" className="mt-8 inline-flex rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700">
                        Volver a mi área
                    </Link>
                </section>
            </main>
        </>
    );
}